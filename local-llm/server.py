"""Local FastAPI inference server for Ask Gordian (SmolLM3-3B via llama.cpp)."""
from __future__ import annotations

import os
from pathlib import Path
from typing import List, Literal

from fastapi import FastAPI, HTTPException
from llama_cpp import Llama
import llama_cpp.llama_chat_format as _lcf
from pydantic import BaseModel

# SmolLM3's bundled chat template uses the transformers-specific `{% generation %}`
# tag, which jinja2 (used by llama-cpp-python) can't parse. Swallow the parse
# error so model load succeeds; we format the ChatML prompt ourselves below.
_ORIG_JINJA_INIT = _lcf.Jinja2ChatFormatter.__init__


def _safe_jinja_init(self, template, *args, **kwargs):
    try:
        _ORIG_JINJA_INIT(self, template, *args, **kwargs)
    except Exception as exc:  # noqa: BLE001
        print(f"[gordian] ignoring bundled chat template parse error: {exc}")
        # Install a minimal ChatML template so the formatter object is valid.
        _ORIG_JINJA_INIT(
            self,
            "{% for m in messages %}<|im_start|>{{ m.role }}\n{{ m.content }}<|im_end|>\n{% endfor %}<|im_start|>assistant\n",
            *args,
            **kwargs,
        )


_lcf.Jinja2ChatFormatter.__init__ = _safe_jinja_init

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parent
DEFAULT_DIR = REPO_ROOT / ".local-models" / "smollm3-3b"
MODEL_DIR = Path(os.environ.get("GORDIAN_MODEL_DIR", str(DEFAULT_DIR))).resolve()
GGUF_FILE = os.environ.get("GORDIAN_GGUF_FILE", "SmolLM3-3B-Q4_K_M.gguf")

model_path = MODEL_DIR / GGUF_FILE
if not model_path.exists():
    # Fall back to the first .gguf file in the directory.
    candidates = sorted(MODEL_DIR.glob("*.gguf"))
    if not candidates:
        raise RuntimeError(
            f"No GGUF file found in {MODEL_DIR}. Run `python download_model.py` first."
        )
    model_path = candidates[0]

print(f"[gordian] loading {model_path}")

# n_gpu_layers=-1 offloads all layers to GPU (Metal on macOS, CUDA elsewhere).
# n_threads/n_ctx kept modest for fast first-token latency.
llm = Llama(
    model_path=str(model_path),
    n_ctx=int(os.environ.get("GORDIAN_N_CTX", "2048")),
    n_gpu_layers=int(os.environ.get("GORDIAN_N_GPU_LAYERS", "-1")),
    n_threads=int(os.environ.get("GORDIAN_N_THREADS", "0")) or None,
    verbose=False,
)


def _format_chatml(messages: list[dict]) -> str:
    parts = []
    for msg in messages:
        parts.append(f"<|im_start|>{msg['role']}\n{msg['content']}<|im_end|>")
    # Prefill an empty <think></think> block: SmolLM3 emits reasoning inside
    # <think>...</think> by default, and prefilling closes the block before
    # the model can fill it, so it goes straight to the final answer.
    parts.append("<|im_start|>assistant\n<think>\n\n</think>\n\n")
    return "\n".join(parts)

SYSTEM_PROMPT = (
    "/no_think\n"
    "You are Ask Gordian, a leadership decision coach grounded in the "
    "Executive Winning System framework. Give practical, concise answers "
    "(3-6 short sentences). When relevant, reference Strategy, Work Plan, "
    "People, Operations, and Results. Do not pretend to have sources unless "
    "they are actually provided. If no playbook data is available, say the "
    "answer is based on general leadership reasoning. Never reveal hidden "
    "reasoning; output only the final answer."
)


class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]


class Source(BaseModel):
    title: str
    type: str


class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]


app = FastAPI(title="Gordian Local LLM")


def _strip_think(text: str) -> str:
    """Remove any <think>...</think> blocks. If a block is unclosed (e.g. the
    model ran out of max_tokens mid-thought), drop everything from <think> on."""
    while "<think>" in text and "</think>" in text:
        start = text.index("<think>")
        end = text.index("</think>") + len("</think>")
        text = text[:start] + text[end:]
    if "<think>" in text:
        text = text[: text.index("<think>")]
    return text.strip()


@app.get("/health")
def health() -> dict:
    return {"ok": True, "model_path": str(model_path)}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    if not req.messages:
        raise HTTPException(status_code=400, detail="messages is empty")

    has_system = any(m.role == "system" for m in req.messages)
    convo = [m.model_dump() for m in req.messages]
    if not has_system:
        convo = [{"role": "system", "content": SYSTEM_PROMPT}] + convo

    prompt = _format_chatml(convo)
    result = llm.create_completion(
        prompt=prompt,
        max_tokens=int(os.environ.get("GORDIAN_MAX_TOKENS", "256")),
        temperature=0.7,
        top_p=0.9,
        stop=["<|im_end|>", "<|im_start|>"],
    )

    answer = _strip_think(result["choices"][0]["text"])

    return ChatResponse(
        answer=answer,
        sources=[Source(title="Local Gordian model", type="local")],
    )
