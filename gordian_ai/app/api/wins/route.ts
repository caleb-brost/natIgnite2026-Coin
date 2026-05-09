import { NextRequest } from "next/server";
import {
  listWins,
  nextWinId,
  saveWin,
  type StoredWin,
  type WinAnswers,
  type WinPlaybook,
} from "../../_lib/wins";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateWinRequest = {
  answers: WinAnswers;
  /** Omit when starting a draft — capture flow fills this on completion. */
  playbook?: WinPlaybook;
  questions?: Record<string, string[]>;
  answerTitles?: Record<string, string[]>;
};

function isValidAnswers(a: unknown): a is WinAnswers {
  if (!a || typeof a !== "object") return false;
  const o = a as Record<string, unknown>;
  if (typeof o.winName !== "string") return false;
  for (const k of ["strategy", "workPlan", "people", "operations", "results"]) {
    const v = o[k];
    if (!Array.isArray(v) || !v.every((s) => typeof s === "string")) return false;
  }
  return true;
}

function isValidPlaybook(p: unknown): p is WinPlaybook {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  if (typeof o.name !== "string") return false;
  if (typeof o.repeatableRule !== "string") return false;
  if (typeof o.suggestedNextWin !== "string") return false;
  if (!o.summaries || typeof o.summaries !== "object") return false;
  if (!o.sdj || typeof o.sdj !== "object") return false;
  const sdj = o.sdj as Record<string, unknown>;
  return (
    typeof sdj.save === "string" &&
    typeof sdj.delete === "string" &&
    typeof sdj.join === "string"
  );
}

export async function GET(_request: NextRequest) {
  const all = await listWins();
  return Response.json(all);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { answers, playbook, questions, answerTitles } =
    (body ?? {}) as Partial<CreateWinRequest>;
  if (!isValidAnswers(answers)) {
    return Response.json(
      { error: "Body must include valid answers (winName + 5 sections)" },
      { status: 400 },
    );
  }
  if (playbook !== undefined && !isValidPlaybook(playbook)) {
    return Response.json(
      { error: "playbook (when provided) must include name, summaries, sdj, ..." },
      { status: 400 },
    );
  }

  const id = await nextWinId();
  const description = playbook?.summaries.strategy?.[0] ?? "";
  const now = new Date().toISOString();
  const win: StoredWin = {
    id,
    name: answers.winName.trim() || playbook?.name || `Untitled (${id})`,
    createdAt: now,
    updatedAt: now,
    author: "Lin",
    tags: [],
    description,
    featured: false,
    answers,
    ...(questions ? { questions: questions as StoredWin["questions"] } : {}),
    ...(answerTitles
      ? { answerTitles: answerTitles as StoredWin["answerTitles"] }
      : {}),
    ...(playbook ? { playbook } : {}),
  };

  await saveWin(win);
  return Response.json(win, { status: 201 });
}
