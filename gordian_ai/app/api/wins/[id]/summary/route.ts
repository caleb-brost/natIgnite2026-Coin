import {
  getWin,
  isFinalized,
  isValidWinId,
  listWins,
  saveWin,
  type Sdj,
  type StoredWin,
  type WinPlaybook,
} from "../../../../_lib/wins";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCAL_LLM_URL =
  process.env.LOCAL_LLM_URL ?? "http://127.0.0.1:8001/chat";

const SYSTEM_PROMPT = `You are Gordian, an Executive Winning System (EWS) leadership coach.
Given ONE focal captured win plus a corpus of prior wins from the same organization,
produce a Save / Delete / Join reflection that explicitly considers cross-win patterns.
- save: what to keep doing or repeat from THIS win in light of prior wins.
- delete: what to drop, given what other wins have shown.
- join: what to combine with another specific prior win for compounding effect (reference its name when useful).
Each value must be 1–3 sentences, concrete, and non-generic.
Return JSON only — no prose, no code fences. Shape: {"save": string, "delete": string, "join": string}.`;

type LlmMessage = { role: "system" | "user" | "assistant"; content: string };

async function callLLM(messages: LlmMessage[]): Promise<string> {
  const res = await fetch(LOCAL_LLM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}`);
  const data = (await res.json()) as { answer?: string };
  return (data.answer ?? "").trim();
}

function tryParseSdj(text: string): Sdj | null {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  try {
    const obj = JSON.parse(cleaned) as Partial<Sdj>;
    if (
      typeof obj.save === "string" &&
      typeof obj.delete === "string" &&
      typeof obj.join === "string"
    ) {
      return { save: obj.save, delete: obj.delete, join: obj.join };
    }
  } catch {
    // fall through
  }
  return null;
}

function serializeWin(w: StoredWin & { playbook: WinPlaybook }) {
  return {
    id: w.id,
    name: w.name,
    summaries: w.playbook.summaries,
    repeatableRule: w.playbook.repeatableRule,
    sdj: w.playbook.sdj,
  };
}

function hasPlaybook(
  w: StoredWin,
): w is StoredWin & { playbook: WinPlaybook } {
  return Boolean(w.playbook);
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!isValidWinId(id)) {
    return Response.json({ error: "Invalid win id" }, { status: 400 });
  }

  const focal = await getWin(id);
  if (!focal) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  if (!isFinalized(focal) || !hasPlaybook(focal)) {
    return Response.json(
      { error: "Win is still a draft — finish capturing it first." },
      { status: 409 },
    );
  }

  const all = await listWins();
  const others = all.filter(hasPlaybook).filter((w) => w.id !== focal.id);

  const userPrompt = JSON.stringify(
    {
      focalWin: serializeWin(focal),
      priorWins: others.map(serializeWin),
    },
    null,
    2,
  );

  try {
    const raw = await callLLM([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ]);
    const sdj = tryParseSdj(raw);
    if (!sdj) throw new Error("LLM returned unparseable SDJ JSON");

    const generatedAt = new Date().toISOString();
    const updated: StoredWin = {
      ...focal,
      aiSummary: { sdj, generatedAt },
    };
    await saveWin(updated);

    return Response.json({ sdj, source: "ai", generatedAt });
  } catch {
    return Response.json({
      sdj: focal.playbook.sdj,
      source: "fallback",
      generatedAt: focal.createdAt,
    });
  }
}
