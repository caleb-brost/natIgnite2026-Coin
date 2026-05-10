# Gordian AI — natIgnite 2026 Demo

An Executive Winning System (EWS) that helps leadership teams capture decisions, generate repeatable playbooks, and query institutional knowledge through a local AI coach.

Built as a prototype for the natIgnite 2026 pitch.

---

## What it does

| Feature | Description |
|---|---|
| **Win Jar** | Browse every captured win across the org |
| **Capture a Win** | AI-guided chat flow that structures a leadership outcome into a Decision DNA playbook |
| **Ask Gordian** | Chat with a local LLM grounded in your org's captured wins and playbooks |
| **Decision Replay** | Rehearse high-stakes decisions before they happen |
| **Dashboard** | Stats, recent wins, and top-cited playbooks at a glance |

---

## Project structure

```
natIgnite2026-Coin/
├── gordian_ai/          # Next.js 15 front-end + API routes
│   ├── app/
│   │   ├── page.tsx             # All views (single-file SPA)
│   │   ├── _components/         # Shared UI components (icons, etc.)
│   │   ├── _lib/                # Data helpers (wins.ts, replay.ts)
│   │   └── api/
│   │       ├── gordian-chat/    # Ask Gordian — proxies to local LLM
│   │       ├── capture-win-chat/ # Win capture conversation flow
│   │       ├── replay-scenarios/ # Decision Replay scenario generation
│   │       └── wins/            # Win CRUD + AI summary endpoint
│   └── data/
│       └── wins/                # Stored win JSON files (WIN-001.json, …)
└── local-llm/           # FastAPI server running SmolLM3-3B locally
    ├── server.py
    ├── download_model.py
    └── requirements.txt
```

---

## Getting started

### 1. Front-end (Next.js)

```bash
cd gordian_ai
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### 2. Local LLM server

The Ask Gordian and Win Capture features talk to a local FastAPI server running `SmolLM3-3B` (4-bit quantized GGUF via `llama-cpp-python`). On Apple Silicon it uses Metal for 5–10× faster inference than a CPU-only setup.

```bash
cd local-llm
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip

# macOS Apple Silicon (Metal/GPU):
CMAKE_ARGS="-DGGML_METAL=on" pip install llama-cpp-python --no-binary llama-cpp-python
# Linux with CUDA: CMAKE_ARGS="-DGGML_CUDA=on"
# CPU-only fallback: pip install llama-cpp-python

pip install -r requirements.txt
python download_model.py        # downloads ~2 GB GGUF to .local-models/
uvicorn server:app --host 127.0.0.1 --port 8001
```

The Next.js app expects the LLM server at `http://127.0.0.1:8001` (override with `LOCAL_LLM_URL` env var).

See [`local-llm/README.md`](local-llm/README.md) for environment variables, quantization options, and endpoint docs.

---

## Tech stack

- **Next.js 15** (App Router, TypeScript) — front-end and API routes
- **Tailwind CSS** — utility styling
- **llama-cpp-python** — local LLM inference
- **SmolLM3-3B Q4_K_M** — the default model (~2 GB, runs on-device)
- **FastAPI / Uvicorn** — local model server
- Win data stored as flat JSON files (`gordian_ai/data/wins/`)

---

## Environment variables

| Var | Default | Purpose |
|---|---|---|
| `LOCAL_LLM_URL` | `http://127.0.0.1:8001/chat` | LLM server endpoint used by the Next.js API routes |
| `GORDIAN_MODEL_DIR` | `<repo>/.local-models/smollm3-3b` | Where the GGUF weights live |
| `GORDIAN_MAX_TOKENS` | `256` | Max tokens per LLM reply |

See `local-llm/README.md` for the full list of model-level variables.
