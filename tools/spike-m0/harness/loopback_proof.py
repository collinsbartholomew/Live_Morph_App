#!/usr/bin/env python3
"""Loopback proof: two webrtcbin instances in-process complete ICE/DTLS/SRTP/RTP
and the receiver decodes frames. Proves the local GStreamer WebRTC media stack."""
import gi, time
gi.require_version('Gst', '1.0')
gi.require_version('GstWebRTC', '1.0')
from gi.repository import Gst, GstWebRTC, GLib

Gst.init(None)
loop = GLib.MainLoop()
frames = [0]

def probe(pad, info):
    frames[0] += 1
    if frames[0] == 1:
        print("FIRST FRAME DECODED")
    return Gst.PadProbeReturn.OK

# ---- sender: videotestsrc -> vp8 -> rtp -> webrtcbin ----
sender = Gst.parse_launch(
    'webrtcbin name=sw stun-server=stun://stun.l.google.com:19302 '
    'videotestsrc is-live=true pattern=smpte ! video/x-raw,width=640,height=480,framerate=15/1 ! '
    'videoconvert ! queue ! vp8enc deadline=1 ! rtpvp8pay ! queue ! '
    'application/x-rtp,media=video,encoding-name=VP8,payload=96 ! sw.')
sw = sender.get_by_name('sw')

# ---- receiver: webrtcbin + decodebin + fakesink ----
receiver = Gst.Pipeline.new('recv')
rw = Gst.ElementFactory.make('webrtcbin', 'rw')
receiver.add(rw)

def on_pad_added(el, pad):
    caps = pad.get_current_caps()
    if not caps or not caps.get_structure(0).get_name().startswith('video'):
        return
    dec = Gst.ElementFactory.make('decodebin', None)
    receiver.add(dec); dec.sync_state_with_parent()
    pad.link(dec.get_static_pad('sink'))
    def dec_pad(d, dpad):
        n = dpad.get_current_caps().get_structure(0).get_name()
        if not n.startswith('video/x-raw'):
            return
        conv = Gst.ElementFactory.make('videoconvert', None)
        fs = Gst.ElementFactory.make('fakesink', None)
        receiver.add(conv); receiver.add(fs)
        conv.link(fs); conv.sync_state_with_parent(); fs.sync_state_with_parent()
        dpad.link(conv.get_static_pad('sink'))
        conv.get_static_pad('src').add_probe(Gst.PadProbeType.BUFFER, probe)
        print("receiver decode chain linked")
    dec.connect('pad-added', dec_pad)
rw.connect('pad-added', on_pad_added)

sender.set_state(Gst.State.PLAYING)
receiver.set_state(Gst.State.PLAYING)

def cross(src, dst):
    def cb(el, mlineidx, cand):
        GLib.idle_add(dst.emit, 'add-ice-candidate', mlineidx, cand)
    src.connect('on-ice-candidate', cb)
cross(sw, rw)
cross(rw, sw)

sw.connect('notify::connection-state', lambda e,p: print('sender conn:', e.get_property('connection-state').value_nick))
rw.connect('notify::connection-state', lambda e,p: print('receiver conn:', e.get_property('connection-state').value_nick))
sw.connect('notify::ice-connection-state', lambda e,p: print('sender ice:', e.get_property('ice-connection-state').value_nick))
rw.connect('notify::ice-connection-state', lambda e,p: print('receiver ice:', e.get_property('ice-connection-state').value_nick))

def send_to(dst, sdp):
    print("  -> passing SDP (%d bytes)" % len(sdp))
    dst.emit('set-remote-description', sdp, None)

def on_negotiation(el):
    def created(promise, target, _):
        promise.wait()
        offer = promise.get_reply().get_value('offer')
        target.emit('set-local-description', offer, None)
        GLib.idle_add(lambda: recv_answer(offer))
        print("sender offer created")
    promise = Gst.Promise.new_with_change_func(created, el, None)
    el.emit('create-offer', None, promise)

def recv_answer(offer):
    sw.emit('set-remote-description', offer, None)  # give sender the offer first? no
sw.disconnect_by_func(on_negotiation) if False else None

# Use a cleaner single-thread state machine driven by idle callbacks.
# Sender creates offer -> receiver sets remote -> receiver creates answer -> sender sets remote.
steps = {'offer': None}
def step1_create_offer():
    def created(promise, target, _):
        promise.wait()
        steps['offer'] = promise.get_reply().get_value('offer')
        sw.emit('set-local-description', steps['offer'], None)
        print("1) sender local offer set")
        GLib.idle_add(step2_receiver_remote)
    promise = Gst.Promise.new_with_change_func(created, sw, None)
    sw.emit('create-offer', None, promise)

def step2_receiver_remote():
    rw.emit('set-remote-description', steps['offer'], None)
    print("2) receiver remote offer set")
    def created(promise, target, _):
        promise.wait()
        ans = promise.get_reply().get_value('answer')
        rw.emit('set-local-description', ans, None)
        print("3) receiver local answer set")
        GLib.idle_add(lambda: step4_sender_remote(ans))
    promise = Gst.Promise.new_with_change_func(created, rw, None)
    rw.emit('create-answer', None, promise)

def step4_sender_remote(ans):
    sw.emit('set-remote-description', ans, None)
    print("4) sender remote answer set")

sw.connect('on-negotiation-needed', lambda el: GLib.idle_add(step1_create_offer) if steps['offer'] is None else None)

GLib.timeout_add_seconds(14, lambda: (loop.quit(), False)[0])

loop.run()
print("RESULT: receiver decoded frames =", frames[0])