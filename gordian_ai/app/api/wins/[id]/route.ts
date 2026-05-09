import {
  getWin,
  isValidWinId,
  saveWin,
  type SectionId,
  type StoredWin,
  type WinAnswers,
} from "../../../_lib/wins";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECTION_IDS = [
  "strategy",
  "workPlan",
  "people",
  "operations",
  "results",
] as const satisfies readonly SectionId[];

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!isValidWinId(id)) {
    return Response.json({ error: "Invalid win id" }, { status: 400 });
  }
  const win = await getWin(id);
  if (!win) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(win);
}

type Patch = Partial<
  Pick<
    StoredWin,
    | "name"
    | "description"
    | "tags"
    | "featured"
    | "answers"
    | "questions"
    | "answerTitles"
    | "playbook"
    | "aiSummary"
  >
>;

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isSectionRecord(v: unknown): v is Record<SectionId, string[]> {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return SECTION_IDS.every((k) => isStringArray(o[k]));
}

function isPartialAnswers(v: unknown): v is WinAnswers {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  if (typeof o.winName !== "string") return false;
  return SECTION_IDS.every((k) => isStringArray(o[k]));
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!isValidWinId(id)) {
    return Response.json({ error: "Invalid win id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const existing = await getWin(id);
  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const patch = (body ?? {}) as Patch;
  const merged: StoredWin = { ...existing };

  if (patch.name !== undefined) {
    if (typeof patch.name !== "string") {
      return Response.json({ error: "name must be a string" }, { status: 400 });
    }
    merged.name = patch.name;
  }
  if (patch.description !== undefined) {
    if (typeof patch.description !== "string") {
      return Response.json(
        { error: "description must be a string" },
        { status: 400 },
      );
    }
    merged.description = patch.description;
  }
  if (patch.tags !== undefined) {
    if (!isStringArray(patch.tags)) {
      return Response.json({ error: "tags must be string[]" }, { status: 400 });
    }
    merged.tags = patch.tags;
  }
  if (patch.featured !== undefined) {
    if (typeof patch.featured !== "boolean") {
      return Response.json(
        { error: "featured must be boolean" },
        { status: 400 },
      );
    }
    merged.featured = patch.featured;
  }
  if (patch.answers !== undefined) {
    if (!isPartialAnswers(patch.answers)) {
      return Response.json({ error: "answers shape invalid" }, { status: 400 });
    }
    merged.answers = patch.answers;
  }
  if (patch.questions !== undefined) {
    if (!isSectionRecord(patch.questions)) {
      return Response.json(
        { error: "questions must map every section id to string[]" },
        { status: 400 },
      );
    }
    merged.questions = patch.questions;
  }
  if (patch.answerTitles !== undefined) {
    if (!isSectionRecord(patch.answerTitles)) {
      return Response.json(
        { error: "answerTitles must map every section id to string[]" },
        { status: 400 },
      );
    }
    merged.answerTitles = patch.answerTitles;
  }
  if (patch.playbook !== undefined) {
    if (
      patch.playbook === null ||
      typeof patch.playbook !== "object" ||
      typeof (patch.playbook as { name?: unknown }).name !== "string"
    ) {
      return Response.json({ error: "playbook shape invalid" }, { status: 400 });
    }
    merged.playbook = patch.playbook;
    if (!merged.description && patch.playbook.summaries?.strategy?.[0]) {
      merged.description = patch.playbook.summaries.strategy[0];
    }
  }
  if (patch.aiSummary !== undefined) {
    merged.aiSummary = patch.aiSummary;
  }

  merged.updatedAt = new Date().toISOString();
  await saveWin(merged);
  return Response.json(merged);
}
