# NeonTouch Synth // Night City Cyberdeck

A zero-dependency Python + Web Audio 10-finger ephemeral neon light instrument and cyberpunk DJ music generator running on **`http://127.0.0.1:8112`** (`Port 8112`), with zero camera or microphone access required.

## Quick Start

```bash
chmod +x run.sh
./run.sh
```

Or run the server directly with Python 3:

```bash
python3 server.py --host 127.0.0.1 --port 8112
```

Open **`http://127.0.0.1:8112`** in your browser.

## Endpoints

- `GET /` — Cyberdeck & NeonTouch Synth web UI (`index.html`)
- `GET /api/health` — JSON health and capabilities check (`camera_enabled: false`, `microphone_enabled: false`)
- `GET /static/*` — Static CSS (`static/css/styles.css`) and JavaScript (`static/js/app.js`) assets

## Tests

```bash
python3 -m unittest discover -s tests -v
```
