# Gordian Local LLM

Local FastAPI server that runs `HuggingFaceTB/SmolLM3-3B` (GGUF, via
[`llama-cpp-python`](https://github.com/abetlen/llama-cpp-python)) on your
machine and serves answers to the Ask Gordian UI.

The GGUF weights live outside the Next.js bundle in
`../.local-models/smollm3-3b/` and are git-ignored.

On Apple Silicon this is **5–10× faster** than the previous transformers/MPS
setup because llama.cpp uses Metal directly and the model is 4-bit quantized.

## Setup

```bash
cd local-llm
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip

# Install llama-cpp-python with Metal (GPU) support on macOS.
# On Linux with CUDA: CMAKE_ARGS="-DGGML_CUDA=on"
# On any other machine: just `pip install llama-cpp-python` (CPU only).
CMAKE_ARGS="-DGGML_METAL=on" pip install llama-cpp-python --no-binary llama-cpp-python

pip install -r requirements.txt

python download_model.py
uvicorn server:app --host 127.0.0.1 --port 8001
```

The server listens at `http://127.0.0.1:8001/chat`.

## Endpoints

- `GET  /health` — returns the loaded model path.
- `POST /chat` — body: `{ "messages": [{ "role": "user" | "assistant" | "system", "content": "..." }] }`
  Response: `{ "answer": "...", "sources": [{ "title": "...", "type": "local" }] }`.

## Environment variables

| Var | Default | Purpose |
|---|---|---|
| `GORDIAN_MODEL_DIR` | `<repo>/.local-models/smollm3-3b` | Where the GGUF file is downloaded / loaded from |
| `GORDIAN_GGUF_REPO` | `bartowski/SmolLM3-3B-GGUF` | HF repo to download from |
| `GORDIAN_GGUF_FILE` | `SmolLM3-3B-Q4_K_M.gguf` | Specific quant file (try `Q5_K_M` for higher quality, `Q3_K_M` for more speed) |
| `GORDIAN_N_CTX` | `2048` | Context window |
| `GORDIAN_N_GPU_LAYERS` | `-1` | Layers offloaded to GPU (`-1` = all) |
| `GORDIAN_N_THREADS` | auto | CPU threads |
| `GORDIAN_MAX_TOKENS` | `256` | Max generated tokens per reply |

## Quantization tradeoffs

| File | Size | Speed | Quality |
|---|---|---|---|
| `SmolLM3-3B-Q3_K_M.gguf` | ~1.6 GB | fastest | good |
| `SmolLM3-3B-Q4_K_M.gguf` | ~2.0 GB | fast | better (default) |
| `SmolLM3-3B-Q5_K_M.gguf` | ~2.3 GB | medium | best |

## Notes

- `/no_think` is included in the system prompt and `<think>…</think>` blocks
  are stripped server-side, so the UI never sees chain-of-thought.
- If the GGUF file isn't found at the expected path, the server falls back to
  the first `*.gguf` in `GORDIAN_MODEL_DIR`.
