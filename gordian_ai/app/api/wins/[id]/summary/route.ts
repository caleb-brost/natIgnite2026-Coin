import {
  getWin,
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
Given a leader's captured win, produce a Save / Delete / Join reflection grounded in the actual answers.
- save: ONE specific practice, decision, or behavior from THIS win that the business should keep and repeat going forward. Name it concretely — do not describe it generically.
- delete: ONE specific friction, mistake, or obstacle from THIS win that should NOT be repeated in a similar strategy. Name what it was — do not use abstract language.
- join: ONE specific adjacent initiative, team, or opportunity that could be combined with this win's approach to improve future results. Be specific about what to combine and why.
Each value must be exactly 1 sentence drawn directly from the captured answers. Never use generic filler like "the decisions that drove this win."
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

function hasPlaybook(
  w: StoredWin,
): w is StoredWin & { playbook: WinPlaybook } {
  return Boolean(w.playbook);
}

function serializeFocalWin(w: StoredWin): Record<string, unknown> {
  const base: Record<string, unknown> = {
    id: w.id,
    name: w.name,
    answers: w.answers,
  };
  if (hasPlaybook(w)) {
    base.summaries = w.playbook.summaries;
    base.repeatableRule = w.playbook.repeatableRule;
  }
  return base;
}

function serializeOtherWin(w: StoredWin & { playbook: WinPlaybook }) {
  return {
    id: w.id,
    name: w.name,
    summaries: w.playbook.summaries,
    repeatableRule: w.playbook.repeatableRule,
  };
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

  const hasAnyAnswers = Object.values(focal.answers).some(
    (v) => Array.isArray(v) && v.some(Boolean),
  );
  if (!hasAnyAnswers) {
    return Response.json(
      { error: "No answers captured yet — nothing to summarise." },
      { status: 409 },
    );
  }

  const all = await listWins();
  const others = all.filter(hasPlaybook).filter((w) => w.id !== focal.id);

  const userPrompt = JSON.stringify(
    {
      focalWin: serializeFocalWin(focal),
      priorWins: others.map(serializeOtherWin),
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
    const fallbackSdj: Sdj = hasPlaybook(focal)
      ? focal.playbook.sdj
      : { save: "", delete: "", join: "" };
    return Response.json({
      sdj: fallbackSdj,
      source: "fallback",
      generatedAt: focal.createdAt,
    });
  }
}
