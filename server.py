#!/usr/bin/env python3
"""NeonTouch Synth // In-VM 10-Finger Ephemeral Neon Light & Polyphonic Music Studio (Port 8112).

Pure touchscreen + multi-input musical instrument tied into Run Nexus (:5000).
Zero camera or microphone access — engineered specifically to run at ultra-low CPU
and 60 FPS inside a headless Wayland / Chrome Remote Desktop VM while providing
full 1-to-10 simultaneous colorful ephemeral lines and polyphonic Web Audio synthesis.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

ROOT_DIR = Path(__file__).resolve().parent


class NeonTouchHandler(BaseHTTPRequestHandler):
    server_version = "NeonTouchSynth/3.0"

    def log_message(self, fmt: str, *args: Any) -> None:
        return

    def _send_json(self, payload: Any, status: int = HTTPStatus.OK) -> None:
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self) -> None:  # noqa: N802
        route = urlparse(self.path).path

        if route == "/api/health":
            self._send_json({
                "status": "ok",
                "service": "neontouch-music-synth",
                "version": "3.0-vm-optimized",
                "port": self.server.server_port,
                "max_fingers": 10,
                "camera_enabled": False,
                "microphone_enabled": False,
                "vm_multifinger_modes": [
                    "touch_brush_1_to_10",
                    "ephemeral_overlap_stack",
                    "crd_two_finger_gesture_decoder",
                    "ten_key_polyphonic_matrix",
                ],
            })
            return

        if route in ("/", "/index.html"):
            target = ROOT_DIR / "index.html"
        elif route.startswith("/static/"):
            target = (ROOT_DIR / route.lstrip("/")).resolve()
            if not str(target).startswith(str((ROOT_DIR / "static").resolve())):
                self._send_json({"error": "Forbidden"}, status=HTTPStatus.FORBIDDEN)
                return
        else:
            self._send_json({"error": f"Not found: {route}"}, status=HTTPStatus.NOT_FOUND)
            return

        if not target.is_file():
            self._send_json({"error": "Asset not found"}, status=HTTPStatus.NOT_FOUND)
            return

        data = target.read_bytes()
        mime, _ = mimetypes.guess_type(str(target))
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", mime or "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.end_headers()
        self.wfile.write(data)


def create_server(host: str = "127.0.0.1", port: int = 8112) -> ThreadingHTTPServer:
    ThreadingHTTPServer.allow_reuse_address = True
    return ThreadingHTTPServer((host, port), NeonTouchHandler)


def main() -> int:
    parser = argparse.ArgumentParser(description="NeonTouch // 10-Finger Neon Music Synth (Port 8112)")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8112)
    args = parser.parse_args()

    srv = create_server(args.host, args.port)
    print(f"NeonTouch Music Synth v3.0 listening on http://{args.host}:{args.port}", flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        srv.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
