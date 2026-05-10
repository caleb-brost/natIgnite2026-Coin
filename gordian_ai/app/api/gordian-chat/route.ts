import { NextRequest } from "next/server";
import { isFinalized, listWins, type StoredWin } from "../../_lib/wins";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Role = "system" | "user" | "assistant";
type Message = { role: Role; content: string };

const LOCAL_LLM_URL =
  process.env.LOCAL_LLM_URL ?? "http://127.0.0.1:8001/chat";

const ASK_SYSTEM = `You are Gordian, an Executive Winning System (EWS) leadership coach.
Answer using the captured wins corpus below. Cite wins by id (e.g. WIN-001) when relevant.
If the corpus lacks enough info, say so plainly instead of inventing.
HARD LIMITS: 1-3 short sentences, max 40 words. Stop as soon as the question is answered.
Plain prose only (no I, me, myself). No markdown: no asterisks, underscores, headers, bullets, numbered lists, or code fences.`;

function compactWin(w: StoredWin): Record<string, unknown> {
  return {
    id: w.id,
    name: w.name,
    author: w.author,
    createdAt: w.createdAt,
    description: w.description,
    answers: w.answers,
    answerTitles: w.answerTitles,
    summaries: w.playbook?.summaries,
    repeatableRule: w.playbook?.repeatableRule,
    sdj: w.playbook?.sdj,
    aiSdj: w.aiSummary?.sdj,
  };
}

async function buildContextMessage(): Promise<Message> {
  const all = await listWins();
  const wins = all.filter(isFinalized).map(compactWin);
  const corpus = JSON.stringify(wins);
  return {
    role: "system",
    content:
      `Captured wins corpus (${wins.length} win${wins.length === 1 ? "" : "s"}). ` +
      `Use it as your only source of truth about prior wins:\n\n` +
      corpus,
  };
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")           // ## headings
    .replace(/\*\*(.+?)\*\*/g, "$1")        // **bold**
    .replace(/\*(.+?)\*/g, "$1")            // *italic*
    .replace(/__(.+?)__/g, "$1")            // __bold__
    .replace(/_(.+?)_/g, "$1")              // _italic_
    .replace(/`{1,3}[^`]*`{1,3}/g, "$&".replace(/`/g, "")) // `code`
    .replace(/^```[\s\S]*?```$/gm, "")      // fenced code blocks
    .replace(/^\s*[-*+]\s+/gm, "")          // bullet list markers
    .replace(/^\s*\d+\.\s+/gm, "")          // numbered list markers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [link](url)
    .replace(/\n{3,}/g, "\n\n")             // collapse excess blank lines
    .trim();
}

export async function POST(request: NextRequest) {
  let body: { messages?: Message[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userMessages = body.messages;
  if (!Array.isArray(userMessages) || userMessages.length === 0) {
    return Response.json({ error: "messages is required" }, { status: 400 });
  }

  // Strip any inbound system messages — we set the system + corpus ourselves.
  const conversation = userMessages.filter((m) => m.role !== "system");

  let contextMessage: Message;
  try {
    contextMessage = await buildContextMessage();
  } catch {
    contextMessage = {
      role: "system",
      content:
        "Captured wins corpus is currently unavailable. Answer from general knowledge and tell the user the corpus could not be loaded.",
    };
  }

  const messages: Message[] = [
    { role: "system", content: ASK_SYSTEM },
    contextMessage,
    ...conversation,
  ];

  try {
    const upstream = await fetch(LOCAL_LLM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      return Response.json(
        {
          error: "Local model server returned an error.",
          status: upstream.status,
          detail: detail.slice(0, 500),
        },
        { status: 502 },
      );
    }

    const data = await upstream.json();
    if (typeof data.answer === "string") {
      data.answer = stripMarkdown(data.answer);
    }
    return Response.json(data);
  } catch {
    return Response.json(
      {
        error:
          "I couldn't reach the local Gordian model. Make sure the local-llm server is running on port 8001.",
      },
      { status: 503 },
    );
  }
}
