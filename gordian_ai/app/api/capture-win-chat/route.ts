import { NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

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
  | "pick_next_question"
  | "process_user_message"
  | "summarize_section"
  | "generate_playbook";

type CaptureChatRequest = {
  winName: string;
  sectionId: SectionId;
  sectionLabel: string;
  questionIndex: number;
  questionsPerSection: number;
  currentQuestion?: string;
  lastAnswer?: string;
  userMessage?: string;
  answers: Answers;
  /** Every question already asked, keyed by section. Used to avoid repeats. */
  priorQuestions?: Partial<Record<SectionId, string[]>>;
  mode: Mode;
};

function normalizeQ(q: string): string {
  return (q || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function flattenPriorQuestions(
  priorQuestions: Partial<Record<SectionId, string[]>> | undefined,
): { raw: string[]; normalized: Set<string> } {
  const raw: string[] = [];
  const normalized = new Set<string>();
  if (!priorQuestions) return { raw, normalized };
  for (const arr of Object.values(priorQuestions)) {
    if (!Array.isArray(arr)) continue;
    for (const q of arr) {
      if (typeof q !== "string" || !q.trim()) continue;
      raw.push(q.trim());
      normalized.add(normalizeQ(q));
    }
  }
  return { raw, normalized };
}

type Playbook = {
  name: string;
  summaries: Record<SectionId, string[]>;
  repeatableRule: string;
  suggestedNextWin: string;
  sdj: { save: string; delete: string; join: string };
};

type ProcessResult =
  | {
      kind: "answer";
      assistantMessage: string;
      capturedAnswer: string;
    }
  | {
      kind: "side_question";
      reply: string;
    };

type CaptureChatResponse = {
  assistantMessage: string;
  nextQuestion?: string | null;
  sectionSummary?: string[];
  isSectionComplete: boolean;
  isFlowComplete: boolean;
  playbook: Playbook | null;
  /** Returned by generate_playbook so the client can persist it on the win. */
  answerTitles?: Record<SectionId, string[]>;
  /** Returned by process_user_message for side-question routing. */
  process?: ProcessResult;
};

const COACH_SYSTEM = `You are Gordian, an Executive Winning System (EWS) leadership coach.
You guide leaders through capturing one real win across five sections:
Strategy, Work Plan, People, Operations, Results.
Be concise, professional, and practical. Never invent facts about the user's organization.
You may briefly answer a leader's general business question if they ask one mid-flow,
but your primary job is to help them capture this win.
When asked for JSON, return valid JSON only — no prose, no code fences.`;

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

const SECTION_LABELS: Record<SectionId, string> = {
  strategy: "Strategy",
  workPlan: "Work Plan",
  people: "People",
  operations: "Operations",
  results: "Results",
};

const HEADER_TO_SECTION: Record<string, SectionId> = {
  strategy: "strategy",
  "work plan": "workPlan",
  people: "people",
  operations: "operations",
  results: "results",
};

let questionPoolCache:
  | { mtimeMs: number; pool: Record<SectionId, string[]> }
  | null = null;

async function loadQuestionPool(): Promise<Record<SectionId, string[]>> {
  const filePath = path.join(process.cwd(), "data", "questions.md");
  let stat;
  try {
    stat = await fs.stat(filePath);
  } catch {
    return {
      strategy: [],
      workPlan: [],
      people: [],
      operations: [],
      results: [],
    };
  }
  if (questionPoolCache && questionPoolCache.mtimeMs === stat.mtimeMs) {
    return questionPoolCache.pool;
  }
  const raw = await fs.readFile(filePath, "utf8");
  const pool: Record<SectionId, string[]> = {
    strategy: [],
    workPlan: [],
    people: [],
    operations: [],
    results: [],
  };
  let current: SectionId | null = null;
  for (const lineRaw of raw.split(/\r?\n/)) {
    const line = lineRaw.trim();
    if (!line) continue;
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      const key = h2[1].toLowerCase();
      current = HEADER_TO_SECTION[key] ?? null;
      continue;
    }
    if (line.startsWith("#")) continue;
    if (line.startsWith("---")) continue;
    if (!current) continue;
    pool[current].push(line);
  }
  questionPoolCache = { mtimeMs: stat.mtimeMs, pool };
  return pool;
}

function fallbackQuestion(sectionId: SectionId, qIdx: number): string {
  const defaults: Record<SectionId, string[]> = {
    strategy: [
      "What was the main strategic goal behind this win?",
      "Why did this win matter to your organization?",
      "What problem or opportunity were you addressing?",
      "What constraint shaped the strategy most?",
    ],
    workPlan: [
      "What was the practical plan that made this win happen?",
      "What were the key milestones?",
      "What resources or approvals did you need?",
      "Where did the plan need to flex?",
    ],
    people: [
      "Who helped make this win happen, and in what role?",
      "What skills or attitudes were decisive?",
      "Who was Accountable, Consulted, or Told?",
      "Whose contribution mattered most but is least visible?",
    ],
    operations: [
      "What systems or processes supported this win?",
      "What operational barriers did you solve?",
      "Which functions had to coordinate?",
      "What would need to be standing for someone to repeat it?",
    ],
    results: [
      "What measurable results showed this was a win?",
      "What quantitative outcomes can you cite?",
      "What qualitative outcomes can you cite?",
      "What's the repeatable lesson worth keeping?",
    ],
  };
  const arr = defaults[sectionId];
  return arr[Math.min(qIdx, arr.length - 1)];
}

async function pickNextQuestion(
  body: CaptureChatRequest,
): Promise<CaptureChatResponse> {
  const pool = await loadQuestionPool();
  const allCandidates = pool[body.sectionId] ?? [];
  const askedSoFar = body.answers[body.sectionId] ?? [];

  const { raw: priorRaw, normalized: priorSet } = flattenPriorQuestions(
    body.priorQuestions,
  );

  // Drop any candidate that has already been asked (cross-section).
  const remaining = allCandidates.filter(
    (q) => !priorSet.has(normalizeQ(q)),
  );

  const numbered = (remaining.length ? remaining : allCandidates)
    .map((q, i) => `  ${i + 1}. ${q}`)
    .join("\n");
  const priorAnswers = askedSoFar
    .map((a, i) => `  Q${i + 1} answer: ${a}`)
    .join("\n");
  const priorQuestionsBlock = priorRaw
    .map((q, i) => `  ${i + 1}. ${q}`)
    .join("\n");

  const userBlock =
    `Win: "${body.winName || "(unnamed)"}"\n` +
    `Current section: ${body.sectionLabel}\n` +
    `Question slot: ${body.questionIndex + 1} of ${body.questionsPerSection}\n` +
    `Candidate questions still available for this section:\n${numbered || "  (none)"}\n` +
    (priorQuestionsBlock
      ? `Questions already asked in this capture (DO NOT REPEAT or paraphrase any of these):\n${priorQuestionsBlock}\n`
      : "") +
    (priorAnswers
      ? `Prior answers in this section (avoid asking what's already covered):\n${priorAnswers}\n`
      : "") +
    `Pick or adapt ONE question that fits this leader's win type, opens new ground, ` +
    `and does not overlap in meaning with any question listed under "already asked". ` +
    `Return JSON: {"question": "..."}. The question must be a single sentence, plain text.`;

  let question: string | undefined;
  try {
    const llmRaw = await callLLM([
      { role: "system", content: COACH_SYSTEM },
      { role: "user", content: userBlock },
    ]);
    const parsed = tryParseJson<{ question?: string }>(llmRaw);
    if (parsed?.question && typeof parsed.question === "string") {
      question = parsed.question.trim();
    } else if (llmRaw) {
      question = llmRaw.replace(/^[-*•\d.)\s]+/, "").trim();
    }
  } catch {
    // fall through to fallback
  }

  // If the LLM returned a duplicate (or nothing usable), pick the first
  // remaining candidate that hasn't been asked yet.
  const isDuplicate = (q: string | undefined) =>
    !!q && priorSet.has(normalizeQ(q));

  if (!question || isDuplicate(question)) {
    const firstFresh =
      remaining[0] ??
      allCandidates.find((q) => !priorSet.has(normalizeQ(q))) ??
      fallbackQuestion(body.sectionId, body.questionIndex);
    question = firstFresh;
  }

  // Final guard — even fallbacks shouldn't repeat a prior question.
  if (isDuplicate(question)) {
    const idx = body.questionIndex % allCandidates.length;
    const offset = (start: number) => {
      for (let i = 0; i < allCandidates.length; i++) {
        const candidate = allCandidates[(start + i) % allCandidates.length];
        if (!priorSet.has(normalizeQ(candidate))) return candidate;
      }
      return undefined;
    };
    question =
      offset(idx) ??
      `${fallbackQuestion(body.sectionId, body.questionIndex)} (anything new to add?)`;
  }

  return {
    assistantMessage: question,
    nextQuestion: question,
    isSectionComplete: false,
    isFlowComplete: false,
    playbook: null,
  };
}

async function processUserMessage(
  body: CaptureChatRequest,
): Promise<CaptureChatResponse> {
  const message = (body.userMessage ?? "").trim();
  if (!message) {
    return {
      assistantMessage: "I didn't catch that — could you rephrase?",
      isSectionComplete: false,
      isFlowComplete: false,
      playbook: null,
      process: { kind: "side_question", reply: "I didn't catch that — could you rephrase?" },
    };
  }

  const prompt =
    `You are mid-capture. Section: ${body.sectionLabel}.\n` +
    `Question we just asked the leader: "${body.currentQuestion ?? ""}"\n` +
    `Leader's message: "${message}"\n\n` +
    `Classify the message as one of:\n` +
    `  side_question — the leader is asking YOU something (definitions, frameworks, advice, examples). ` +
    `Signals: ends with "?", starts with what/how/why/when/should/can/do/is, asks for examples, asks you to explain a term.\n` +
    `  answer — the leader is responding to the question above with their own facts about the win. ` +
    `Signals: declarative, names people/numbers/timelines, describes what they did.\n\n` +
    `Examples:\n` +
    `  "What does 'repeatable rule' mean?" -> side_question\n` +
    `  "Can you give me an example of a strategy answer?" -> side_question\n` +
    `  "How do other leaders usually describe this?" -> side_question\n` +
    `  "Our goal was to retain a top-10 account before it churned." -> answer\n` +
    `  "Maya led it, with help from Daniel and Priya." -> answer\n\n` +
    `Respond as JSON only with one of these shapes:\n` +
    `  {"kind":"answer","ack":"<<= 12 word acknowledgement, no follow-up question>>"}\n` +
    `  {"kind":"side_question","reply":"<<concise 1-3 sentence answer to their question>>"}\n` +
    `When in doubt and the message is interrogative or asks for help, choose side_question.`;

  type Parsed = { kind?: string; ack?: string; reply?: string };
  let parsed: Parsed | null = null;
  try {
    const raw = await callLLM([
      { role: "system", content: COACH_SYSTEM },
      { role: "user", content: prompt },
    ]);
    parsed = tryParseJson<Parsed>(raw);
  } catch {
    parsed = null;
  }

  if (parsed?.kind === "side_question" && typeof parsed.reply === "string") {
    return {
      assistantMessage: parsed.reply,
      isSectionComplete: false,
      isFlowComplete: false,
      playbook: null,
      process: { kind: "side_question", reply: parsed.reply },
    };
  }

  const ack =
    (parsed?.kind === "answer" && parsed.ack && typeof parsed.ack === "string"
      ? parsed.ack
      : "Captured.");
  return {
    assistantMessage: ack,
    isSectionComplete: false,
    isFlowComplete: false,
    playbook: null,
    process: { kind: "answer", assistantMessage: ack, capturedAnswer: message },
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

type PlaybookWithTitles = Omit<Playbook, "name"> & {
  answerTitles: Record<SectionId, string[]>;
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
    `  "repeatableRule": "one sentence — the concrete lesson from THIS win worth repeating",\n` +
    `  "suggestedNextWin": "one short sentence — a specific next win this leader should pursue",\n` +
    `  "sdj": {\n` +
    `    "save": "one sentence naming the specific practice, decision, or behavior from THIS win that should be kept and repeated — not a generic definition",\n` +
    `    "delete": "one sentence naming the specific friction, misstep, or obstacle from THIS win that should be eliminated next time — not a generic definition",\n` +
    `    "join": "one sentence naming a specific adjacent team, initiative, or opportunity that could benefit from connecting with THIS win's approach — not a generic definition"\n` +
    `  },\n` +
    `  "answerTitles": {\n` +
    `    "strategy": ["..."],\n` +
    `    "workPlan": ["..."],\n` +
    `    "people": ["..."],\n` +
    `    "operations": ["..."],\n` +
    `    "results": ["..."]\n` +
    `  }\n` +
    `}\n` +
    `Each summary array: 2-4 short bullets. ` +
    `SDJ values must be specific to this win — draw directly from the answers above, not from general knowledge. ` +
    `answerTitles: for each answer, write ONE concise 2-5 word label that names the core idea — ` +
    `think "Client Retention Goal" not "Our goal was to". ` +
    `Do NOT copy the first words of the answer; distill the essential concept into a meaningful noun phrase. ` +
    `One title per answer, same order as the answers above. ` +
    `Return JSON only.`;

  const raw = await callLLM([
    { role: "system", content: COACH_SYSTEM },
    { role: "user", content: prompt },
  ]);

  const parsed = tryParseJson<PlaybookWithTitles>(raw);
  const fallbackSummaries: Record<SectionId, string[]> = {
    strategy: body.answers.strategy ?? [],
    workPlan: body.answers.workPlan ?? [],
    people: body.answers.people ?? [],
    operations: body.answers.operations ?? [],
    results: body.answers.results ?? [],
  };

  let sdj = parsed?.sdj;
  if (!sdj) {
    try {
      const sdjRaw = await callLLM([
        { role: "system", content: COACH_SYSTEM },
        {
          role: "user",
          content:
            `Win name: "${body.winName}"\n\n${sectionsBlock}\n\n` +
            `Based solely on the answers above, produce a JSON object:\n` +
            `{\n` +
            `  "save": "one sentence — the specific practice or decision from this win to keep repeating",\n` +
            `  "delete": "one sentence — the specific friction or misstep from this win to eliminate next time",\n` +
            `  "join": "one sentence — a specific adjacent team or initiative to connect with this win's approach"\n` +
            `}\n` +
            `Be concrete and specific to this win. Return JSON only.`,
        },
      ]);
      sdj = tryParseJson<{ save: string; delete: string; join: string }>(sdjRaw) ?? undefined;
    } catch {
      // fall through to static fallback
    }
  }

  const playbook: Playbook = {
    name: body.winName || "Untitled Win",
    summaries: parsed?.summaries ?? fallbackSummaries,
    repeatableRule:
      parsed?.repeatableRule ??
      "Align the right people around a clear plan, then measure honestly.",
    suggestedNextWin:
      parsed?.suggestedNextWin ??
      "Pilot this playbook on a parallel team in the next quarter.",
    sdj: sdj ?? {
      save: "The decisions and rituals that drove this win.",
      delete: "The friction points the team had to work around.",
      join: "Adjacent playbooks that share the same pattern.",
    },
  };

  const answerTitles =
    parsed?.answerTitles ?? deriveTitlesFallback(body.answers);

  return {
    assistantMessage: "Your Executive Winning System playbook is ready.",
    isSectionComplete: true,
    isFlowComplete: true,
    playbook,
    answerTitles,
  };
}

// Stop-words to skip when picking meaningful words for a fallback title.
const STOP_WORDS = new Set([
  "a","an","the","and","or","but","of","in","on","at","to","for","with",
  "we","our","my","i","it","is","was","were","had","have","has","be","been",
  "that","this","what","which","who","how","why","when","their","they",
  "he","she","its","by","as","from","so","if","up","did","do","does","are",
]);

function deriveTitlesFallback(
  answers: Answers,
): Record<SectionId, string[]> {
  const out: Record<SectionId, string[]> = {
    strategy: [],
    workPlan: [],
    people: [],
    operations: [],
    results: [],
  };
  (Object.keys(out) as SectionId[]).forEach((k) => {
    out[k] = (answers[k] ?? []).map((body) => {
      const clean = (body || "").replace(/\s+/g, " ").trim();
      // Pick up to 4 content-bearing words, skipping stop-words.
      const meaningful = clean
        .split(" ")
        .map((w) => w.replace(/[^a-zA-Z0-9'-]/g, ""))
        .filter((w) => w.length > 1 && !STOP_WORDS.has(w.toLowerCase()))
        .slice(0, 4);
      if (meaningful.length >= 2) return meaningful.join(" ");
      // Last resort: first 5 words of the raw answer.
      const words = clean.split(" ");
      return words.length <= 5
        ? clean.replace(/[.!?,;:]+$/, "")
        : words.slice(0, 5).join(" ").replace(/[.!?,;:]+$/, "") + "…";
    });
  });
  return out;
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
      case "pick_next_question":
        result = await pickNextQuestion(body);
        break;
      case "process_user_message":
        result = await processUserMessage(body);
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
