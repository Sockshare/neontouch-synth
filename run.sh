#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
PORT="${PORT:-8112}"
lsof -t -iTCP:"$PORT" -sTCP:LISTEN 2>/dev/null | xargs -r kill -9 || true
(sleep 1.0 && DISPLAY="${DISPLAY:-:0}" xdg-open "http://localhost:${PORT}" >/dev/null 2>&1 || true) &
exec python3 server.py --host 127.0.0.1 --port "$PORT"
