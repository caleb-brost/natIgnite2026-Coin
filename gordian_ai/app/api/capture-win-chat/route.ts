import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCAL_LLM_URL =
  process.env.LOCAL_LLM_URL ?? "http://127.0.0.1:8001/chat";

type SectionId =
  | "strategy"
  | "workPlan"
  | "people"
  | "operations"
  | "results";
type Answers = Record<SectionId, string[]>;
type Mode =
  | "ask_next_question"
  | "summarize_section"
  | "generate_playbook";

type CaptureChatRequest = {
  winName: string;
  sectionId: SectionId;
  sectionLabel: string;
  questionIndex: number;
  currentQuestion: string;
  lastAnswer?: string;
  answers: Answers;
  mode: Mode;
};

type Playbook = {
  name: string;
  summaries: Record<SectionId, string[]>;
  repeatableRule: string;
  suggestedNextWin: string;
  sdj: { save: string; delete: string; join: string };
};

type CaptureChatResponse = {
  assistantMessage: string;
  nextQuestion?: string | null;
  sectionSummary?: string[];
  isSectionComplete: boolean;
  isFlowComplete: boolean;
  playbook: Playbook | null;
};

const COACH_SYSTEM = `You are Gordian, an Executive Winning System (EWS) leadership coach.
You guide leaders through capturing one real win across five sections:
Strategy, Work Plan, People, Operations, Results.
Be concise, professional, and practical. Never invent facts.
When asked for JSON, return valid JSON only — no prose, no code fences.`;

async function callLLM(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
): Promise<string> {
  const res = await fetch(LOCAL_LLM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}`);
  const data = (await res.json()) as { answer: string };
  return (data.answer ?? "").trim();
}

function bulletize(text: string, max = 5): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
  return lines.slice(0, max);
}

function tryParseJson<T>(text: string): T | null {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

async function generateAck(
  body: CaptureChatRequest,
): Promise<CaptureChatResponse> {
  const ack = await callLLM([
    { role: "system", content: COACH_SYSTEM },
    {
      role: "user",
      content:
        `Section: ${body.sectionLabel}\n` +
        `Question we just asked: "${body.currentQuestion}"\n` +
        `User's answer: "${body.lastAnswer ?? ""}"\n\n` +
        `Reply with a single short acknowledgement (max 12 words). ` +
        `No follow-up question, no preamble. Plain text only.`,
    },
  ]);
  return {
    assistantMessage: ack || "Captured.",
    nextQuestion: null,
    isSectionComplete: false,
    isFlowComplete: false,
    playbook: null,
  };
}

async function generateSectionSummary(
  body: CaptureChatRequest,
): Promise<CaptureChatResponse> {
  const sectionAnswers = body.answers[body.sectionId] ?? [];
  const numbered = sectionAnswers
    .map((a, i) => `${i + 1}. ${a}`)
    .join("\n");

  const text = await callLLM([
    { role: "system", content: COACH_SYSTEM },
    {
      role: "user",
      content:
        `Win: "${body.winName}"\n` +
        `Section: ${body.sectionLabel}\n` +
        `Answers from the leader:\n${numbered}\n\n` +
        `Summarize this section as 3-5 short, sharp bullets. ` +
        `Each bullet on its own line, prefixed with "- ". No headings.`,
    },
  ]);

  const bullets = bulletize(text, 5);
  const sectionSummary =
    bullets.length > 0
      ? bullets
      : sectionAnswers.map((a) => a.trim()).filter(Boolean);

  return {
    assistantMessage: `Here's what I captured for ${body.sectionLabel}.`,
    sectionSummary,
    isSectionComplete: true,
    isFlowComplete: false,
    playbook: null,
  };
}

const SECTION_LABELS: Record<SectionId, string> = {
  strategy: "Strategy",
  workPlan: "Work Plan",
  people: "People",
  operations: "Operations",
  results: "Results",
};

async function generatePlaybook(
  body: CaptureChatRequest,
): Promise<CaptureChatResponse> {
  const sectionsBlock = (Object.keys(SECTION_LABELS) as SectionId[])
    .map((id) => {
      const ans = (body.answers[id] ?? [])
        .map((a, i) => `  ${i + 1}. ${a}`)
        .join("\n");
      return `### ${SECTION_LABELS[id]}\n${ans}`;
    })
    .join("\n\n");

  const prompt =
    `Win name: "${body.winName}"\n\n${sectionsBlock}\n\n` +
    `Produce a JSON object with this exact shape:\n` +
    `{\n` +
    `  "summaries": {\n` +
    `    "strategy": ["..."],\n` +
    `    "workPlan": ["..."],\n` +
    `    "people": ["..."],\n` +
    `    "operations": ["..."],\n` +
    `    "results": ["..."]\n` +
    `  },\n` +
    `  "repeatableRule": "one sentence — the lesson worth repeating",\n` +
    `  "suggestedNextWin": "one short sentence",\n` +
    `  "sdj": {\n` +
    `    "save": "what to repeat",\n` +
    `    "delete": "what to avoid",\n` +
    `    "join": "what to connect to"\n` +
    `  }\n` +
    `}\n` +
    `Each summary array: 2-4 short bullets. Return JSON only.`;

  const raw = await callLLM([
    { role: "system", content: COACH_SYSTEM },
    { role: "user", content: prompt },
  ]);

  const parsed = tryParseJson<Omit<Playbook, "name">>(raw);
  const fallbackSummaries: Record<SectionId, string[]> = {
    strategy: body.answers.strategy ?? [],
    workPlan: body.answers.workPlan ?? [],
    people: body.answers.people ?? [],
    operations: body.answers.operations ?? [],
    results: body.answers.results ?? [],
  };

  const playbook: Playbook = {
    name: body.winName || "Untitled Win",
    summaries: parsed?.summaries ?? fallbackSummaries,
    repeatableRule:
      parsed?.repeatableRule ??
      "Align the right people around a clear plan, then measure honestly.",
    suggestedNextWin:
      parsed?.suggestedNextWin ??
      "Pilot this playbook on a parallel team in the next quarter.",
    sdj: parsed?.sdj ?? {
      save: "The decisions and rituals that drove this win.",
      delete: "The friction points the team had to work around.",
      join: "Adjacent playbooks that share the same pattern.",
    },
  };

  return {
    assistantMessage: "Your Executive Winning System playbook is ready.",
    isSectionComplete: true,
    isFlowComplete: true,
    playbook,
  };
}

export async function POST(request: NextRequest) {
  let body: CaptureChatRequest;
  try {
    body = (await request.json()) as CaptureChatRequest;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    let result: CaptureChatResponse;
    switch (body.mode) {
      case "ask_next_question":
        result = await generateAck(body);
        break;
      case "summarize_section":
        result = await generateSectionSummary(body);
        break;
      case "generate_playbook":
        result = await generatePlaybook(body);
        break;
      default:
        return Response.json({ error: "Unknown mode" }, { status: 400 });
    }
    return Response.json(result);
  } catch {
    return Response.json(
      {
        error:
          "I couldn't reach the Gordian model right now. Make sure the local LLM server is running, then try again.",
      },
      { status: 503 },
    );
  }
}
