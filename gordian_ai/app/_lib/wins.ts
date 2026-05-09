import { promises as fs } from "node:fs";
import path from "node:path";

export type SectionId =
  | "strategy"
  | "workPlan"
  | "people"
  | "operations"
  | "results";

export type WinAnswers = { winName: string } & Record<SectionId, string[]>;

export type Sdj = { save: string; delete: string; join: string };

export type WinPlaybook = {
  name: string;
  summaries: Record<SectionId, string[]>;
  repeatableRule: string;
  suggestedNextWin: string;
  sdj: Sdj;
};

export type StoredWin = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  description: string;
  featured: boolean;
  answers: WinAnswers;
  /** Question text actually asked per slot — same length as answers[sectionId]. */
  questions?: Record<SectionId, string[]>;
  /** Optional 1–6 word headline per answer; eventually filled by the AI. */
  answerTitles?: Record<SectionId, string[]>;
  /** Absent while the win is still being captured (a "draft"). */
  playbook?: WinPlaybook;
  aiSummary?: {
    sdj: Sdj;
    generatedAt: string;
    model?: string;
  };
};

export function isFinalized(win: StoredWin): boolean {
  return Boolean(win.playbook && win.playbook.name && win.playbook.sdj);
}

export const WINS_DIR = path.join(process.cwd(), "data", "wins");

const ID_PATTERN = /^WIN-\d{3,}$/;

export function isValidWinId(id: string): boolean {
  return ID_PATTERN.test(id);
}

export async function ensureWinsDir(): Promise<void> {
  await fs.mkdir(WINS_DIR, { recursive: true });
}

export async function listWins(): Promise<StoredWin[]> {
  await ensureWinsDir();
  const entries = await fs.readdir(WINS_DIR);
  const wins: StoredWin[] = [];
  for (const entry of entries) {
    if (!entry.endsWith(".json")) continue;
    const id = entry.slice(0, -5);
    if (!isValidWinId(id)) continue;
    try {
      const raw = await fs.readFile(path.join(WINS_DIR, entry), "utf8");
      wins.push(JSON.parse(raw) as StoredWin);
    } catch {
      // Skip malformed files rather than failing the whole list.
    }
  }
  wins.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return wins;
}

export async function getWin(id: string): Promise<StoredWin | null> {
  if (!isValidWinId(id)) return null;
  try {
    const raw = await fs.readFile(path.join(WINS_DIR, `${id}.json`), "utf8");
    return JSON.parse(raw) as StoredWin;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function saveWin(win: StoredWin): Promise<void> {
  if (!isValidWinId(win.id)) {
    throw new Error(`Invalid win id: ${win.id}`);
  }
  await ensureWinsDir();
  const final = path.join(WINS_DIR, `${win.id}.json`);
  const tmp = `${final}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(win, null, 2), "utf8");
  await fs.rename(tmp, final);
}

export async function nextWinId(): Promise<string> {
  await ensureWinsDir();
  const entries = await fs.readdir(WINS_DIR);
  let max = 0;
  for (const entry of entries) {
    const m = entry.match(/^WIN-(\d+)\.json$/);
    if (!m) continue;
    const n = Number.parseInt(m[1], 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return `WIN-${String(max + 1).padStart(3, "0")}`;
}
