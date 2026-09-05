#!/usr/bin/env python3
"""M0.3 capture server: serves capture.html, stores POSTed SDP/ICE dumps."""
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs
import time

ROOT = Path(__file__).parent
OUT = ROOT / 'out'
WWW = ROOT / 'www'
OUT.mkdir(exist_ok=True)
REF_PNG = Path('/home/omega/@OMEGA/@PROJECTS/@LIVE_MORPH/Live_Morph_App/apps/liveescape/icons/icon.png')

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def do_GET(self):
        if self.path.startswith('/capture.html') or self.path == '/':
            body = (WWW / 'capture.html').read_bytes()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        elif self.path.startswith('/ref.png'):
            body = REF_PNG.read_bytes()
            self.send_response(200)
            self.send_header('Content-Type', 'image/png')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404); self.end_headers()

    def do_POST(self):
        q = parse_qs(urlparse(self.path).query)
        what = q.get('what', ['unknown'])[0]
        n = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(n)
        seq = int(time.time() * 1000)
        if what in ('offer', 'answer', 'offer_gathered'):
            (OUT / f'capture_{what}.sdp').write_bytes(body)
            print(f'[dump] {what}: {len(body)} bytes', flush=True)
        elif what in ('local_ice', 'remote_ice'):
            name = 'browser_local_ice' if what == 'local_ice' else 'browser_remote_ice'
            with open(OUT / f'{name}.jsonl', 'ab') as f:
                f.write(body + b'\n')
        elif what == 'log':
            line = body.decode('utf-8', 'replace')
            with open(OUT / 'capture.log', 'a') as f:
                f.write(f'[{seq}] {line}\n')
            print(f'[log] {line}', flush=True)
        elif what == 'done':
            (OUT / 'done.flag').write_text('1')
            print('[dump] done', flush=True)
        self.send_response(204)
        self.end_headers()

if __name__ == '__main__':
    HTTPServer(('127.0.0.1', 8790), H).serve_forever()
