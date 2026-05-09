import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Role = "system" | "user" | "assistant";
type Message = { role: Role; content: string };

const LOCAL_LLM_URL =
  process.env.LOCAL_LLM_URL ?? "http://127.0.0.1:8001/chat";

export async function POST(request: NextRequest) {
  let body: { messages?: Message[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages is required" }, { status: 400 });
  }

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
