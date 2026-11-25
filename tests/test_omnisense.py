#!/usr/bin/env python3
"""Unit & Integration Tests for NIGHT CITY CYBERDECK (10-Feature Cyberpunk DJ v9)."""

import json
import sys
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from server import create_server  # noqa: E402


class TestNightCityCyberdeck(unittest.TestCase):
    def test_all_10_cyberpunk_dj_features_and_zero_camera_or_mic(self) -> None:
        srv = create_server("127.0.0.1", 0)
        port = srv.server_address[1]
        threading.Thread(target=srv.serve_forever, daemon=True).start()
        base = f"http://127.0.0.1:{port}"
        try:
            with urllib.request.urlopen(f"{base}/api/health") as r:
                health = json.loads(r.read().decode("utf-8"))
                self.assertEqual(health["status"], "ok")
                self.assertFalse(health["camera_enabled"])
                self.assertFalse(health["microphone_enabled"])

            with urllib.request.urlopen(f"{base}/") as r:
                html = r.read().decode("utf-8")
                self.assertIn("NIGHT CITY CYBERDECK", html)
                self.assertIn("btn-gen-song", html)       # 1. Procedural Song Generator
                self.assertIn("btn-kaleidoscope", html)   # 2. Kaleidoscope Lasers
                self.assertIn("step-matrix", html)        # 3. 16-Step Neon Grid
                self.assertIn("jog-a", html)              # 4. Dual Holo-Turntables & Crossfader
                self.assertIn("kaoss-btn", html)          # 5. Punch-In Glitch FX
                self.assertIn("vox-btn", html)            # 6. Cyber Vocoder
                self.assertIn("data-scene", html)         # 7. Song Scene Arranger
                self.assertIn("btn-export-mix", html)     # 8. Synth Mix Exporter
                self.assertNotIn("cam-video", html)
                self.assertNotIn("mic-spectrum", html)

            with urllib.request.urlopen(f"{base}/static/js/app.js") as r:
                js = r.read().decode("utf-8")
                self.assertIn("skylinePeaks", js)         # 9. Live Neon Skyline FFT
                self.assertIn("reticles", js)             # 10. Cyber Reticles & Plasma Trails
                self.assertNotIn("getUserMedia", js)

            for removed in ("/api/captures", "/api/voice/respond", "/api/frame"):
                with self.assertRaises(urllib.error.HTTPError) as ctx:
                    urllib.request.urlopen(f"{base}{removed}")
                self.assertEqual(ctx.exception.code, 404)
        finally:
            srv.shutdown()
            srv.server_close()


if __name__ == "__main__":
    unittest.main()
