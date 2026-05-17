"""Download a GGUF build of SmolLM3-3B for llama.cpp inference.

The GGUF file lives in a folder outside the Next.js app and is git-ignored.
"""
import os
from pathlib import Path

from huggingface_hub import hf_hub_download

# Defaults: bartowski's GGUF release, Q4_K_M (~2 GB) — good speed/quality tradeoff.
REPO_ID = os.environ.get("GORDIAN_GGUF_REPO", "ggml-org/SmolLM3-3B-GGUF")
FILENAME = os.environ.get("GORDIAN_GGUF_FILE", "SmolLM3-Q4_K_M.gguf")

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parent
DEFAULT_DIR = REPO_ROOT / ".local-models" / "smollm3-3b"

target_dir = Path(os.environ.get("GORDIAN_MODEL_DIR", str(DEFAULT_DIR))).resolve()
target_dir.mkdir(parents=True, exist_ok=True)

print(f"Downloading {REPO_ID}/{FILENAME} -> {target_dir}")
path = hf_hub_download(
    repo_id=REPO_ID,
    filename=FILENAME,
    local_dir=str(target_dir),
)
print(f"Done: {path}")
