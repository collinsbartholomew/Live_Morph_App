#!/usr/bin/env python3
"""M0.4 spike: GStreamer webrtcbin <-> LiveMorph proxy <-> Decart.

Flow (mirrors liveescape):
  1. WS connect to proxy
  2. create offer with video recvonly transceiver -> send
  3. on_answer: set-remote-description
  4. send set_image (base64 PNG) + prompt  (liveescape order)
  5. incoming RTP -> decodebin -> videoconvert -> appsink (count + save frames)
  6. log everything; print summary at end
"""
import argparse, asyncio, base64, json, signal, sys, time, traceback, threading
from pathlib import Path

import gi
gi.require_version('Gst', '1.0')
gi.require_version('GstWebRTC', '1.0')
gi.require_version('GstSdp', '1.0')
from gi.repository import Gst, GstWebRTC, GstSdp, GLib
import websockets

OUT = Path(__file__).parent.parent / 'out'
OUT.mkdir(exist_ok=True)
frame_count = 0
first_frame_t = None

def log(*a):
    print(f"[{time.strftime('%H:%M:%S')}]", *a, flush=True)

# libnice (used by webrtcbin) drives ICE timers on a GLib main context.
# Run a dedicated GLib main loop in a thread; capture its default context
# from inside that thread so we can push it as thread-default when creating
# the pipeline on the main (asyncio) thread.
_ready = threading.Event()
_glib_ctx = None
def _glib_thread():
    global _glib_ctx
    loop = GLib.MainLoop()
    _glib_ctx = loop.get_context()
    _ready.set()
    loop.run()
_threading_started = threading.Thread(target=_glib_thread, daemon=True)
_threading_started.name = 'glib-mainloop'
_threading_started.start()
_ready.wait(timeout=5)

class Spike:
    def __init__(self, ws_url, image_path, prompt, seconds, model, turn=None):
        self.ws_url, self.image_path, self.prompt = ws_url, image_path, prompt
        self.seconds, self.model = seconds, model
        self.turn = turn
        self.pipeline = None
        self.webrtc = None
        self.ws = None
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        self.t0 = time.monotonic()
        self.answer_sdp = None
        self.gst_answer_path = OUT / 'gst_answer.sdp'

    # ---------- GStreamer ----------
    def build_pipeline(self):
        self._th = _glib_ctx.push_thread_default()
        try:
            self._build_pipeline_inner()
        finally:
            _glib_ctx.pop_thread_default()

    def _build_pipeline_inner(self):
        launch = (
            'webrtcbin name=w stun-server=stun://stun.l.google.com:19302 '
            'videotestsrc is-live=true pattern=ball ! '
            'video/x-raw,width=640,height=480,framerate=24/1 ! '
            'videoconvert ! queue ! vp8enc deadline=1 ! rtpvp8pay ! queue ! '
            'application/x-rtp,media=video,encoding-name=VP8,payload=96 ! w. '
        )
        self.pipeline = Gst.parse_launch(launch)
        self.webrtc = self.pipeline.get_by_name('w')
        if self.turn:
            self.webrtc.set_property('turn-server', self.turn)
            log('TURN configured:', self.turn)
        self.webrtc.connect('on-negotiation-needed', self.on_negotiation_needed)
        self.webrtc.connect('on-ice-candidate', self.on_ice_candidate)
        self.webrtc.connect('pad-added', self.on_pad_added)
        self.webrtc.connect('notify::ice-connection-state',
            lambda el, p: log('ICE state:', el.get_property('ice-connection-state').value_nick))
        self.webrtc.connect('notify::connection-state',
            lambda el, p: log('peer conn state:', el.get_property('connection-state').value_nick))
        self.pipeline.set_state(Gst.State.PLAYING)
        log('pipeline PLAYING (sendrecv test-pattern 640x480/24 VP8)')

    def on_negotiation_needed(self, element):
        log('on-negotiation-needed -> create-offer')
        promise = Gst.Promise.new_with_change_func(self.on_offer_created, element, None)
        element.emit('create-offer', None, promise)

    def on_offer_created(self, promise, element, _):
        promise.wait()
        reply = promise.get_reply()
        offer = reply.get_value('offer')
        element.emit('set-local-description', offer, None)
        sdp_text = offer.sdp.as_text()
        (OUT / 'gst_offer.sdp').write_text(sdp_text)
        log('local offer set (%d bytes)' % len(sdp_text))
        asyncio.run_coroutine_threadsafe(self.send({'type':'offer','sdp':sdp_text,'model':self.model}), self.loop)

    def on_ice_candidate(self, element, mlineindex, candidate):
        if ' typ relay ' in candidate:
            log('*** GOT RELAY CANDIDATE:', candidate.split()[4] if len(candidate.split())>4 else candidate)
        elif ' typ srflx ' in candidate:
            log('srflx candidate')
        asyncio.run_coroutine_threadsafe(
            self.send({'type':'ice-candidate',
                       'candidate':{'candidate':candidate,'sdpMLineIndex':mlineindex}}),
            self.loop)

    def on_pad_added(self, element, pad):
        caps = pad.get_current_caps()
        if not caps or not caps.get_structure(0).get_name().startswith('video'):
            return
        log('decoded video pad appeared')
        conv = Gst.ElementFactory.make('videoconvert', None)
        rate = Gst.ElementFactory.make('videorate', None)
        filt = Gst.ElementFactory.make('capsfilter', None)
        filt.set_property('caps', Gst.Caps.from_string('video/x-raw,framerate=1/2'))
        enc = Gst.ElementFactory.make('jpegenc', None)
        sink = Gst.ElementFactory.make('multifilesink', None)
        sink.set_property('location', str(OUT / 'frame-%04d.jpg'))
        for el in (conv, rate, filt, enc, sink):
            self.pipeline.add(el)
        for a, b in ((conv,rate),(rate,filt),(filt,enc),(enc,sink)): a.link(b)
        for el in (conv,rate,filt,enc,sink): el.sync_state_with_parent()
        sinkpad = conv.get_static_pad('sink')
        pad.link(sinkpad)
        conv.get_static_pad('src').add_probe(Gst.PadProbeType.BUFFER, self.frame_probe)
        log('decode chain linked (0.5fps jpeg)')

    def frame_probe(self, pad, info):
        global frame_count, first_frame_t
        frame_count += 1
        if frame_count == 1:
            first_frame_t = time.monotonic()
            log('*** FIRST DECODED FRAME at t=%.1fs ***' % (first_frame_t - self.t0))
        elif frame_count % 25 == 0:
            log('frames decoded: %d' % frame_count)
        return Gst.PadProbeReturn.OK

    # ---------- Signaling ----------
    async def send(self, obj):
        if self.ws:
            await self.ws.send(json.dumps(obj))
            log('ws=> %s' % obj.get('type'))

    def set_remote_answer(self, sdp_text):
        self.answer_sdp = sdp_text
        self.gst_answer_path.write_text(sdp_text)
        log('=== ANSWER SDP (%d bytes) ===' % len(sdp_text))
        for line in sdp_text.splitlines():
            if line.startswith(('m=','a=group','a=candidate','a=ice-','a=fingerprint',
                                'a=setup','a=mid','a=send','a=recv','a=inactive',
                                'a=rtpmap','c=')):
                log('  ' + line.strip())
        ret, sdpmsg = GstSdp.sdp_message_new_from_text(sdp_text)
        answer = GstWebRTC.WebRTCSessionDescription.new(GstWebRTC.WebRTCSDPType.ANSWER, sdpmsg)
        self.webrtc.emit('set-remote-description', answer, None)
        log('remote answer applied')
        data = base64.b64encode(Path(self.image_path).read_bytes()).decode()
        asyncio.run_coroutine_threadsafe(self.send(
            {'type':'set_image','image_data':data,'prompt':self.prompt,'enhance_prompt':True}), self.loop)
        asyncio.run_coroutine_threadsafe(asyncio.sleep(0.2), self.loop)
        asyncio.run_coroutine_threadsafe(self.send(
            {'type':'prompt','prompt':self.prompt,'enhance_prompt':True}), self.loop)

    async def ws_loop(self):
        async with websockets.connect(self.ws_url, max_size=8*1024*1024) as ws:
            self.ws = ws
            log('WS connected')
            self.build_pipeline()
            try:
                async for raw in ws:
                    try: msg = json.loads(raw)
                    except Exception: continue
                    t = msg.get('type')
                    log('ws<= %s' % t, ''.join([' %s=%s'%(k,str(v)[:50]) for k,v in msg.items() if k not in ('type',)]))
                    if t == 'answer' and msg.get('sdp'):
                        self.set_remote_answer(msg['sdp'])
                    elif t == 'ice-candidate' and msg.get('candidate'):
                        c = msg['candidate']
                        if isinstance(c, dict):
                            self.webrtc.emit('add-ice-candidate', c.get('sdpMLineIndex',0), c.get('candidate',''))
            except websockets.exceptions.ConnectionClosed as e:
                log('WS closed: code=%s reason=%s' % (e.code, e.reason))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ws', required=True)
    ap.add_argument('--image', required=True)
    ap.add_argument('--prompt', default='cinematic portrait, golden light')
    ap.add_argument('--seconds', type=int, default=25)
    ap.add_argument('--model', default='lucy-2.5')
    ap.add_argument('--turn', default=None, help='turn://user:pass@host:port')
    args = ap.parse_args()
    Gst.init(None)
    spike = Spike(args.ws, args.image, args.prompt, args.seconds, args.model, args.turn)
    task = spike.loop.create_task(spike.ws_loop())
    async def stopper():
        await asyncio.sleep(args.seconds)
        log('time limit reached (%ds)' % args.seconds)
        if spike.pipeline: spike.pipeline.set_state(Gst.State.NULL)
        if spike.ws: await spike.ws.close()
        for t in list(asyncio.all_tasks(spike.loop)):
            if t is not asyncio.current_task(): t.cancel()
    stop_task = spike.loop.create_task(stopper())
    try:
        results = spike.loop.run_until_complete(asyncio.gather(task, stop_task, return_exceptions=True))
        for r in results:
            if isinstance(r, Exception):
                log('TASK FAILED:', repr(r))
                traceback.print_exception(type(r), r, r.__traceback__)
    except KeyboardInterrupt: pass
    finally:
        if spike.pipeline: spike.pipeline.set_state(Gst.State.NULL)
    jpgs = sorted(OUT.glob('frame-*.jpg'))
    log('RESULT: frames_decoded=%d jpeg_files=%d answer_dumped=%s' % (frame_count, len(jpgs), spike.gst_answer_path.exists()))

if __name__ == '__main__':
    main()
