import { listWins, type StoredWin } from "./wins";

export type ReplayOptionId = "A" | "B" | "C" | "D";

export type ReplayOption = {
  id: ReplayOptionId;
  text: string;
  isCorrect: boolean;
  why: string;
};

export type ReplayDifficulty = "Easy" | "Medium" | "Hard";

export type ReplayScenario = {
  id: string;
  sourceWinId: string;
  sourceWinName: string;
  title: string;
  category: string;
  difficulty: ReplayDifficulty;
  prompt: string;
  question: string;
  options: ReplayOption[];
  repeatableRule: string;
};

export type ReplayScenariosResponse = {
  scenarios: ReplayScenario[];
};

const FALLBACK_CATEGORY = "Leadership";
const FALLBACK_QUESTION =
  "Review the captured win and choose the action that best repeats the successful pattern.";
const FALLBACK_RULE =
  "Align the right people on the real problem before committing to an external action.";

const DISTRACTORS: { text: string; why: string }[] = [
  {
    text: "Move quickly with a unilateral decision before anyone can slow it down.",
    why: "Speed without alignment usually re-creates the trust gap that caused the original problem.",
  },
  {
    text: "Wait for more information before doing anything substantive.",
    why: "Pure delay lets the situation drift and erodes the credibility this win was built on.",
  },
  {
    text: "Defer to whoever is loudest or most senior in the room.",
    why: "Authority bias replaces the deliberate judgment that made the original win repeatable.",
  },
  {
    text: "Apply a generic best-practice template without adapting to context.",
    why: "Template thinking misses the specific signal the captured win turned into a rule.",
  },
  {
    text: "Escalate to leadership immediately so they can absorb the risk.",
    why: "Premature escalation skips the working-level alignment that made the original outcome stick.",
  },
  {
    text: "Optimize for visible speed of response over quality of the response.",
    why: "Optics-first beats substance-first only until the next escalation — the original win avoided that trap.",
  },
  {
    text: "Apologize and promise an aggressive new commitment to reset the relationship.",
    why: "New commitments before internal alignment risk repeating the same break in trust.",
  },
];

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (copy.length > 0 && out.length < n) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function firstNonEmptyString(values: Array<unknown>): string | null {
  for (const v of values) {
    if (typeof v === "string") {
      const trimmed = v.trim();
      if (trimmed.length > 0) return trimmed;
    }
  }
  return null;
}

function firstFromArray(value: unknown): string | null {
  if (!Array.isArray(value)) return null;
  for (const item of value) {
    if (typeof item === "string" && item.trim().length > 0) return item.trim();
  }
  return null;
}

/** Trim text to a sentence boundary under `max` chars, with ellipsis fallback. */
function concise(text: string, max: number): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  // Prefer cutting at the first sentence end within budget.
  const slice = t.slice(0, max);
  const sentenceEnd = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("? "),
    slice.lastIndexOf("! "),
  );
  if (sentenceEnd >= Math.floor(max * 0.5)) {
    return slice.slice(0, sentenceEnd + 1).trim();
  }
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > Math.floor(max * 0.5) ? slice.slice(0, lastSpace) : slice;
  return cut.trim().replace(/[.,;:]$/, "") + "…";
}

function buildPrompt(win: StoredWin): string {
  const summaries = win.playbook?.summaries;
  const candidates: Array<unknown> = [
    win.description,
    firstFromArray(summaries?.strategy),
    firstFromArray(win.answers?.strategy),
    firstFromArray(summaries?.workPlan),
    firstFromArray(win.answers?.workPlan),
  ];
  const base =
    firstNonEmptyString(candidates) ??
    "A decision moment from a captured win is now in front of you.";
  return concise(base, 220);
}

function buildCorrectOption(win: StoredWin): { text: string; why: string; rule: string } {
  const rawRule = (win.playbook?.repeatableRule ?? "").trim() || FALLBACK_RULE;
  const rule = concise(rawRule, 160);

  // Pick the most concrete evidence available for *why* this rule worked.
  // Order of preference: SDJ "save" (the discipline to keep), results summary
  // (what the rule produced), people summary (the human pattern that drove it).
  const save = typeof win.playbook?.sdj?.save === "string"
    ? win.playbook.sdj.save.trim()
    : "";
  const resultsSummary = firstFromArray(win.playbook?.summaries?.results);
  const peopleSummary = firstFromArray(win.playbook?.summaries?.people);
  const resultsAnswer = firstFromArray(win.answers?.results);

  const evidence =
    firstNonEmptyString([save, resultsSummary, peopleSummary, resultsAnswer]) ?? "";
  const why = evidence
    ? concise(`In the original win: ${evidence}`, 200)
    : concise(`Repeats the pattern that made ${win.name ?? "this win"} work.`, 160);

  return { text: rule, why, rule };
}

function pickCategory(win: StoredWin): string {
  if (Array.isArray(win.tags)) {
    for (const tag of win.tags) {
      if (typeof tag === "string" && tag.trim().length > 0) return tag.trim();
    }
  }
  return FALLBACK_CATEGORY;
}

function pickDifficulty(win: StoredWin): ReplayDifficulty {
  // Wins with a finalized playbook + multi-bullet answers get rated harder.
  const hasPlaybook = Boolean(win.playbook?.repeatableRule);
  const richAnswers =
    Array.isArray(win.answers?.strategy) && win.answers.strategy.length > 1;
  if (hasPlaybook && richAnswers) return "Hard";
  if (hasPlaybook) return "Medium";
  return "Easy";
}

export function generateScenarioFromWin(win: StoredWin): ReplayScenario | null {
  if (!win || typeof win.id !== "string" || !win.id) return null;

  const sourceWinName =
    firstNonEmptyString([win.name, win.playbook?.name]) ?? "Untitled Win";
  const correct = buildCorrectOption(win);
  const distractors = pickRandom(DISTRACTORS, 3);

  // Shuffle correct + 3 distractors into A–D.
  const slots: ReplayOptionId[] = ["A", "B", "C", "D"];
  const picks: { text: string; why: string; isCorrect: boolean }[] = [
    { text: correct.text, why: correct.why, isCorrect: true },
    ...distractors.map((d) => ({ text: d.text, why: d.why, isCorrect: false })),
  ];
  // Fisher-Yates shuffle of picks.
  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }
  const options: ReplayOption[] = picks.map((p, i) => ({
    id: slots[i],
    text: concise(p.text, 120),
    isCorrect: p.isCorrect,
    why: concise(p.why, 140),
  }));

  return {
    id: `${win.id}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`,
    sourceWinId: win.id,
    sourceWinName,
    title: sourceWinName,
    category: pickCategory(win),
    difficulty: pickDifficulty(win),
    prompt: buildPrompt(win),
    question: FALLBACK_QUESTION,
    options,
    repeatableRule: correct.rule,
  };
}

export async function buildReplayScenarios(max = 3): Promise<ReplayScenariosResponse> {
  let wins: StoredWin[] = [];
  try {
    wins = await listWins();
  } catch {
    return { scenarios: [] };
  }
  const usable = wins.filter(
    (w) =>
      w &&
      typeof w.id === "string" &&
      (firstNonEmptyString([w.description, w.name]) !== null ||
        Boolean(w.playbook?.repeatableRule)),
  );
  const chosen = pickRandom(usable, max);
  const scenarios: ReplayScenario[] = [];
  for (const w of chosen) {
    const s = generateScenarioFromWin(w);
    if (s) scenarios.push(s);
  }
  return { scenarios };
}
