"use client";

import * as React from "react";
import {
  IconKnot,
  IconHome,
  IconGrid,
  IconPlus,
  IconChat,
  IconReplay,
  IconShield,
  IconArrow,
  IconCheck,
  IconSparkle,
  IconBolt,
  IconDoc,
  IconUsers,
  IconTrend,
  IconHelp,
  IconLock,
  IconKey,
  IconEye,
  IconMenu,
  IconClose,
  IconSearch,
  IconSend,
  IconChevR,
  IconStar,
  IconFlag,
} from "./_components/icons";

type View =
  | "home"
  | "dashboard"
  | "capture"
  | "ask"
  | "replay"
  | "wins"
  | "win-summary";
type NavFn = (v: View, winId?: string) => void;

export default function Page() {
  const [view, setView] = React.useState<View>("home");
  const [selectedWinId, setSelectedWinId] = React.useState<string | null>(null);

  const navigate = (v: View, winId?: string) => {
    if (v === "win-summary") {
      if (winId) setSelectedWinId(winId);
    } else if (v !== "wins") {
      setSelectedWinId(null);
    }
    setView(v);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "instant" });
  };

  let body: React.ReactNode = null;
  if (view === "home") body = <Landing navigate={navigate} />;
  if (view === "dashboard") body = <Dashboard navigate={navigate} />;
  if (view === "capture") body = <Capture navigate={navigate} />;
  if (view === "ask") body = <Ask />;
  if (view === "replay") body = <Replay navigate={navigate} />;
  if (view === "wins") body = <AllWins navigate={navigate} />;
  if (view === "win-summary" && selectedWinId)
    body = <WinSummary winId={selectedWinId} navigate={navigate} />;

  return (
    <Shell view={view} navigate={navigate}>
      <div key={view + (selectedWinId ?? "")} className="anim-in">
        {body}
      </div>
    </Shell>
  );
}

// =====================================================================
// Shell
// =====================================================================

function Shell({
  view,
  navigate,
  children,
}: {
  view: View;
  navigate: NavFn;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const items: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <IconHome size={16} /> },
    { id: "dashboard", label: "Dashboard", icon: <IconGrid size={16} /> },
    { id: "wins", label: "Win Jar", icon: <IconStar size={16} /> },
    { id: "capture", label: "Capture a Win", icon: <IconPlus size={16} /> },
    { id: "ask", label: "Ask Gordian", icon: <IconChat size={16} /> },
    { id: "replay", label: "Decision Replay", icon: <IconReplay size={16} /> },
  ];
  const matchView: View = view === "win-summary" ? "wins" : view;
  const activeLabel =
    items.find((i) => i.id === matchView)?.label || "Home";

  return (
    <div className="min-h-screen flex">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`sidebar ${mobileOpen ? "open" : ""} fixed lg:static inset-y-0 left-0 w-64 z-40 bg-navy-900 text-paper flex flex-col`}
      >
        <div className="px-5 pt-5 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-400 text-navy-900 flex items-center justify-center">
              <IconKnot size={20} />
            </div>
            <div>
              <div className="font-serif text-lg leading-none">Gordian AI</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-gold-300/80 mt-0.5">
                Decision Intelligence
              </div>
            </div>
          </div>
          <button
            className="lg:hidden text-paper/70"
            onClick={() => setMobileOpen(false)}
          >
            <IconClose size={18} />
          </button>
        </div>

        <div className="px-3 mb-3">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
            <span className="w-6 h-6 rounded bg-gold-400 text-navy-900 flex items-center justify-center text-[10px] font-bold">
              A
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-paper truncate">Aurora Systems</div>
              <div className="text-[10px] text-paper/50">
                Workspace · 47 members
              </div>
            </div>
            <IconChevR size={12} className="text-paper/50" />
          </button>
        </div>

        <nav className="px-3 space-y-0.5">
          {items.map((it) => (
            <button
              key={it.id}
              className={`nav-item ${matchView === it.id ? "active" : ""}`}
              onClick={() => {
                navigate(it.id);
                setMobileOpen(false);
              }}
            >
              <span className="nav-dot" />
              <span className="text-paper/80">{it.icon}</span>
              <span className="flex-1">{it.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto px-3 pb-4">
          <div className="rounded-xl border border-white/10 p-4 bg-white/5">
            <div className="flex items-center gap-2 mb-2">
              <IconShield size={14} className="text-gold-300" />
              <span className="text-xs text-paper">Private to your org</span>
            </div>
            <p className="text-[11px] text-paper/60 leading-relaxed">
              Wins are encrypted at rest and never leave Aurora Systems.
            </p>
          </div>
          <div className="mt-3 px-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate2-200 text-navy-900 flex items-center justify-center text-[11px] font-medium">
              LR
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-paper truncate">Lin Rivera</div>
              <div className="text-[10px] text-paper/50 truncate">
                VP, Customer Success
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-paper/85 backdrop-blur border-b border-slate2-100">
          <div className="h-14 px-4 sm:px-6 flex items-center gap-3 max-w-[1280px] mx-auto w-full">
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setMobileOpen(true)}
            >
              <IconMenu size={18} />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate2-400">Aurora Systems</span>
              <span className="text-slate2-300">/</span>
              <span className="text-navy-900 font-medium">{activeLabel}</span>
            </div>
            <div className="flex-1" />
            <div className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-lg bg-white border border-slate2-100 w-72 max-w-full text-sm text-slate2-400">
              <IconSearch size={14} />
              <span className="flex-1">Search</span>
              <span className="kbd">⌘K</span>
            </div>
            <button className="btn-ghost h-9 px-3">
              <IconHelp size={14} />
            </button>
            <button
              className="btn-gold h-9 hidden sm:inline-flex"
              onClick={() => navigate("capture")}
            >
              <IconPlus size={14} /> Capture
            </button>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <FooterCTA navigate={navigate} />
      </main>
    </div>
  );
}

function FooterCTA({ navigate }: { navigate: NavFn }) {
  return (
    <>
      <section className="border-t border-slate2-100 bg-ivory">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-12 grid md:grid-cols-4 gap-6">
          {[
            {
              icon: <IconLock size={16} />,
              t: "Private organizational knowledge base",
              d: "Wins live inside your tenant. No cross-org sharing, ever.",
            },
            {
              icon: <IconKey size={16} />,
              t: "Role-based access",
              d: "Different views for leaders, managers, and ICs.",
            },
            {
              icon: <IconEye size={16} />,
              t: "No public sharing of sensitive wins",
              d: "Sources stay redacted in coaching responses by default.",
            },
            {
              icon: <IconShield size={16} />,
              t: "Designed for secure internal learning",
              d: "SOC 2 ready · audit logs · SSO + SCIM.",
            },
          ].map((b) => (
            <div key={b.t} className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate2-100 text-navy-900 flex items-center justify-center shrink-0">
                {b.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-navy-900">{b.t}</div>
                <p className="text-xs text-slate2-500 mt-1 leading-relaxed">
                  {b.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy-900 text-paper relative overflow-hidden">
        <div className="absolute inset-0 knot-bg opacity-60 pointer-events-none" />
        <div className="relative max-w-[1100px] mx-auto px-6 sm:px-10 py-16 text-center">
          <span className="chip chip-gold inline-flex">
            <IconSparkle size={12} /> Ready when you are
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl mt-5 leading-tight">
            From one leader&apos;s win
            <br />
            to an organization-wide playbook.
          </h2>
          <p className="text-paper/70 mt-4 max-w-xl mx-auto">
            Capture another win and watch Gordian extend the playbook your team
            relies on.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <button className="btn-gold" onClick={() => navigate("capture")}>
              <IconPlus size={14} /> Generate Another Win
            </button>
            <button
              className="btn-ghost"
              style={{
                color: "#FAFAF7",
                borderColor: "rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.04)",
              }}
              onClick={() => navigate("replay")}
            >
              <IconReplay size={14} /> Try a Replay
            </button>
          </div>
        </div>
        <div className="relative max-w-[1100px] mx-auto px-6 sm:px-10 py-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-paper/50">
          <div className="flex items-center gap-2">
            <IconKnot size={14} /> Gordian AI · Demo prototype
          </div>
          <div className="flex items-center gap-4">
            <span>SOC 2 Type II ready</span>
            <span>·</span>
            <span>Encrypted at rest</span>
            <span>·</span>
            <span>Built for executives, managers and teams</span>
          </div>
        </div>
      </section>
    </>
  );
}

// =====================================================================
// Landing
// =====================================================================

function Landing({ navigate }: { navigate: NavFn }) {
  return (
    <div className="hero-glow min-h-full">
      <section className="px-6 sm:px-10 lg:px-16 pt-14 pb-16 lg:pt-20 lg:pb-24 max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 anim-in">
            <div className="flex items-center gap-2 mb-6">
              <span className="chip chip-gold">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                Decision Intelligence · v1.0 preview
              </span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-navy-900 leading-[1.02]">
              Untangle decisions.
              <br />
              <span className="italic text-gold-600">Repeat wins.</span>
            </h1>
            <p className="mt-6 text-lg text-slate2-600 max-w-xl leading-relaxed">
              Capture leadership wins, generate{" "}
              <span className="text-navy-900 font-medium">Decision DNA</span>,
              and guide teams through repeatable decision-making — without
              losing the senior judgement behind every outcome.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="btn-gold" onClick={() => navigate("capture")}>
                <IconBolt size={16} /> Capture a Win
              </button>
              <button className="btn-ghost" onClick={() => navigate("replay")}>
                <IconReplay size={16} /> Try Decision Replay
              </button>
              <button
                className="btn-ghost"
                onClick={() => navigate("dashboard")}
              >
                Live demo dashboard <IconArrow size={14} />
              </button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs text-slate2-500">
              <div className="flex items-center gap-2">
                <IconLock size={14} /> SOC 2 ready
              </div>
              <div className="flex items-center gap-2">
                <IconShield size={14} /> Private to your org
              </div>
              <div className="flex items-center gap-2">
                <IconKey size={14} /> Role-based access
              </div>
            </div>
          </div>

          <div
            className="lg:col-span-5 anim-in"
            style={{ animationDelay: ".08s" }}
          >
            <DecisionDNAPreview />
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-10 lg:px-16 pb-20 max-w-[1200px] mx-auto">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-2xl text-navy-900">
            How Gordian works
          </h2>
          <span className="text-xs font-mono text-slate2-400 uppercase tracking-wider">
            3 steps · ~5 min
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              n: "01",
              t: "Capture hidden leadership knowledge",
              d: "A short, guided form turns a senior leader's real win into structured signal — situation, decision, reasoning, outcome.",
              icon: <IconDoc size={22} />,
            },
            {
              n: "02",
              t: "Turn wins into repeatable playbooks",
              d: "Gordian distills each win into Decision DNA: the core rule, the sequence of moves, the conditions where it applies.",
              icon: <IconSparkle size={22} />,
            },
            {
              n: "03",
              t: "Coach employees through similar decisions",
              d: "Teams ask Gordian for guidance in the moment, or rehearse with Decision Replay — backed by your own playbooks.",
              icon: <IconUsers size={22} />,
            },
          ].map((c, i) => (
            <div
              key={c.n}
              className="card p-6 hover:shadow-card transition-shadow anim-in"
              style={{ animationDelay: `${0.1 + i * 0.06}s` }}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-xs text-slate2-400">{c.n}</span>
                <div className="w-10 h-10 rounded-lg bg-ivory text-navy-800 flex items-center justify-center">
                  {c.icon}
                </div>
              </div>
              <h3 className="text-base font-medium text-navy-900 mb-2">
                {c.t}
              </h3>
              <p className="text-sm text-slate2-500 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 sm:px-10 lg:px-16 pb-24 max-w-[1200px] mx-auto">
        <div className="card p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute inset-0 hero-glow opacity-40 pointer-events-none" />
          <div className="relative">
            <div className="text-xs font-mono text-slate2-400 uppercase tracking-wider mb-3">
              The flow
            </div>
            <div className="grid md:grid-cols-4 gap-4 items-stretch">
              {[
                ["Capture a Win", "A leader logs a real outcome"],
                ["Generate DNA", "Gordian structures the reasoning"],
                ["Ask Gordian", "Teammates query in the moment"],
                ["Decision Replay", "Rehearse before high-stakes calls"],
              ].map(([t, d], i) => (
                <div
                  key={t}
                  className="flex md:block items-center gap-4 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-7 h-7 rounded-full bg-navy-900 text-paper text-xs font-mono flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-medium text-navy-900">{t}</span>
                  </div>
                  <div className="text-sm text-slate2-500 md:pl-10">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DecisionDNAPreview() {
  return (
    <div className="card p-5 shadow-lift relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-400 pulse-dot" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate2-500">
            Decision DNA
          </span>
        </div>
        <span className="text-xs text-slate2-400 font-mono">#WIN-012</span>
      </div>
      <h4 className="font-serif text-2xl text-navy-900 leading-tight mb-1">
        Client Recovery
        <br />
        Through Fast Alignment
      </h4>
      <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
        <span className="chip">Client Success</span>
        <span className="chip">Leadership</span>
      </div>
      <div className="space-y-3">
        {[
          ["Core Decision", "Align internally before external promises"],
          ["Repeatable Rule", "When trust is at risk, align internally first"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="bg-ivory rounded-lg p-3 border border-slate2-100"
          >
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate2-400 mb-1">
              {k}
            </div>
            <div className="text-sm text-navy-900 leading-snug">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-slate2-100 flex items-center justify-between text-xs text-slate2-500">
        <span>9-step playbook</span>
        <span className="flex items-center gap-1.5">
          <IconCheck size={12} /> Verified by 4 leaders
        </span>
      </div>
    </div>
  );
}

// =====================================================================
// Dashboard
// =====================================================================

function Dashboard({ navigate }: { navigate: NavFn }) {
  const { wins, loading } = useWinsList();
  const recentWins = wins.slice(0, 3);
  const stats = [
    {
      k: "Total Wins Captured",
      v: String(wins.length),
      d: wins.length === 0 ? "Capture your first" : "Stored locally",
      icon: <IconStar size={16} />,
      trend: wins.length > 0 ? `+${wins.length}` : "—",
    },
    { k: "Repeatable Playbooks", v: "8", d: "Across 4 teams", icon: <IconDoc size={16} />, trend: "+2" },
    { k: "Team Questions Answered", v: "47", d: "Past 30 days", icon: <IconChat size={16} />, trend: "+18" },
    { k: "Decision Confidence Increase", v: "32%", d: "Self-reported", icon: <IconTrend size={16} />, trend: "↑" },
  ];

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate2-400 mb-1">
            Workspace · Aurora Systems
          </div>
          <h1 className="font-serif text-4xl text-navy-900 leading-tight">
            Good morning, Lin.
          </h1>
          <p className="text-slate2-500 mt-1 text-sm">
            Three new questions reference last quarter&apos;s wins. Here&apos;s
            where Gordian is making impact.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            className="btn-ghost"
            style={{ padding: "13px 22px", fontSize: 15 }}
            onClick={() => navigate("replay")}
          >
            <IconReplay size={16} /> Practice replay
          </button>
          <button
            className="btn-gold"
            style={{ padding: "13px 22px", fontSize: 15 }}
            onClick={() => navigate("capture")}
          >
            <IconPlus size={16} /> Capture a Win
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div
            key={s.k}
            className="card p-5 anim-in"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 rounded-lg bg-ivory text-navy-800 flex items-center justify-center">
                {s.icon}
              </div>
              <span className="text-[11px] font-mono text-gold-700 bg-gold-50 px-2 py-0.5 rounded-md border border-gold-100">
                {s.trend}
              </span>
            </div>
            <div className="font-serif text-4xl text-navy-900 leading-none">
              {s.v}
            </div>
            <div className="text-sm text-slate2-700 mt-2">{s.k}</div>
            <div className="text-xs text-slate2-400 mt-0.5">{s.d}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate2-100">
            <div>
              <h2 className="font-medium text-navy-900">Recent Wins</h2>
              <p className="text-xs text-slate2-400 mt-0.5">
                Captured by leaders across the org
              </p>
            </div>
            <button
              className="text-xs text-slate2-500 hover:text-navy-900 flex items-center gap-1"
              onClick={() => navigate("wins")}
            >
              View all <IconChevR size={12} />
            </button>
          </div>
          <WinList
            wins={recentWins}
            loading={loading}
            onSelect={(id) => navigate("win-summary", id)}
            emptyMessage="No wins captured yet — capture your first win to see it here."
          />
        </div>

        <div className="space-y-4">
          <div className="card p-5 knot-bg text-paper">
            <div className="text-[11px] font-mono uppercase tracking-wider text-gold-300 mb-2">
              This week
            </div>
            <h3 className="font-serif text-2xl leading-tight">
              Ask Gordian is being used{" "}
              <span className="text-gold-300">2.4×</span> more by new managers.
            </h3>
            <p className="text-sm text-slate2-200/80 mt-3">
              Your recovery playbook is the most-cited source.
            </p>
            <button className="btn-gold mt-4" onClick={() => navigate("ask")}>
              Open Ask Gordian <IconArrow size={14} />
            </button>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-navy-900">Top Playbooks</h3>
              <span className="text-[11px] font-mono text-slate2-400">
                CITED · 30D
              </span>
            </div>
            <ul className="space-y-3">
              {(
                [
                  ["Client Recovery", 14],
                  ["Stakeholder Alignment", 9],
                  ["Partnership Reframing", 6],
                  ["Cross-team Handoff", 5],
                ] as [string, number][]
              ).map(([n, c], i) => (
                <li key={n} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate2-400 w-4">
                    {i + 1}
                  </span>
                  <span className="text-sm text-navy-900 flex-1">{n}</span>
                  <div className="w-20 h-1.5 rounded-full bg-slate2-100 overflow-hidden">
                    <div
                      className="h-full bg-gold-400"
                      style={{ width: `${(c / 14) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate2-500 w-6 text-right">
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Wins (shared list + AllWins page + WinSummary page)
// =====================================================================

type StoredSdj = { save: string; delete: string; join: string };

type StoredWin = {
  id: string;
  name: string;
  createdAt: string;
  author: string;
  tags: string[];
  description: string;
  featured: boolean;
  answers: { winName: string } & Record<SectionId, string[]>;
  answerTitles?: Record<SectionId, string[]>;
  playbook: {
    name: string;
    summaries: Record<SectionId, string[]>;
    repeatableRule: string;
    suggestedNextWin: string;
    sdj: StoredSdj;
  };
  aiSummary?: { sdj: StoredSdj; generatedAt: string; model?: string };
};

function deriveTitle(body: string, max = 6): string {
  const clean = (body || "").replace(/\s+/g, " ").trim();
  if (!clean) return "Untitled";
  const words = clean.split(" ");
  if (words.length <= max) return clean.replace(/[.!?,;:]+$/, "");
  return words.slice(0, max).join(" ").replace(/[.!?,;:]+$/, "") + "…";
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const diffMs = Date.now() - then;
  const sec = Math.max(1, Math.round(diffMs / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.round(day / 7);
  if (wk < 5) return `${wk}w ago`;
  const mo = Math.round(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.round(day / 365)}y ago`;
}

function useWinsList() {
  const [wins, setWins] = React.useState<StoredWin[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/wins", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const data = (await res.json()) as StoredWin[];
        if (alive) setWins(data);
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : "Failed");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { wins, loading, error };
}

function WinList({
  wins,
  loading,
  onSelect,
  emptyMessage,
}: {
  wins: StoredWin[];
  loading: boolean;
  onSelect: (id: string) => void;
  emptyMessage: string;
}) {
  if (loading) {
    return (
      <ul>
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="px-5 py-4 border-t border-slate2-100 first:border-t-0"
          >
            <div className="flex items-start gap-4 animate-pulse">
              <div className="w-9 h-9 rounded-lg bg-slate2-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 bg-slate2-100 rounded" />
                <div className="h-4 w-2/3 bg-slate2-100 rounded" />
                <div className="h-3 w-full bg-slate2-100 rounded" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (wins.length === 0) {
    return (
      <div className="px-5 py-10 text-center text-sm text-slate2-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul>
      {wins.map((w) => (
        <li
          key={w.id}
          className="px-5 py-4 border-t border-slate2-100 first:border-t-0 hover:bg-ivory/60 transition-colors cursor-pointer group"
          onClick={() => onSelect(w.id)}
        >
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-lg bg-navy-900 text-paper flex items-center justify-center shrink-0 mt-0.5">
              <IconKnot size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] text-slate2-400">
                  {w.id}
                </span>
                {w.featured && (
                  <span className="chip chip-gold text-[10px]">
                    <IconStar size={10} /> Featured
                  </span>
                )}
              </div>
              <h3 className="text-navy-900 font-medium mt-1 group-hover:text-gold-700 transition-colors">
                {w.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {(
                  [
                    { id: "strategy", label: "Strategy" },
                    { id: "workPlan", label: "Work Plan" },
                    { id: "people", label: "People" },
                    { id: "operations", label: "Operations" },
                    { id: "results", label: "Results" },
                  ] as { id: keyof typeof w.answers; label: string }[]
                ).map((sec) => {
                  const filled =
                    Array.isArray(w.answers?.[sec.id]) &&
                    (w.answers[sec.id] as string[]).some(Boolean);
                  return (
                    <span
                      key={sec.id}
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${filled
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate2-50 text-slate2-400 border border-slate2-100"
                        }`}
                    >
                      {filled && <IconCheck size={8} className="inline mr-0.5" />}
                      {sec.label}
                    </span>
                  );
                })}
                {w.playbook && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold-50 text-gold-700 border border-gold-200">
                    <IconSparkle size={8} className="inline mr-0.5" />
                    Playbook
                  </span>
                )}
              </div>
              {w.description && (
                <p className="text-sm text-slate2-500 mt-1.5 leading-relaxed">
                  {w.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {w.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
                <span className="text-xs text-slate2-400 ml-auto">
                  {w.author} · {relativeTime(w.createdAt)}
                </span>
              </div>
            </div>
            <IconChevR
              size={16}
              className="text-slate2-300 mt-2 shrink-0 group-hover:text-navy-900 group-hover:translate-x-0.5 transition-all"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function AllWins({ navigate }: { navigate: NavFn }) {
  const { wins, loading } = useWinsList();
  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate2-400 mb-1">
            Workspace · Aurora Systems
          </div>
          <h1 className="font-serif text-4xl text-navy-900 leading-tight">
            Win Jar
          </h1>
          <p className="text-slate2-500 mt-1 text-sm">
            Every win captured through the Executive Winning System.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            className="btn-ghost"
            style={{ padding: "13px 22px", fontSize: 15 }}
            onClick={() => navigate("dashboard")}
          >
            <IconGrid size={16} /> Dashboard
          </button>
          <button
            className="btn-gold"
            style={{ padding: "13px 22px", fontSize: 15 }}
            onClick={() => navigate("capture")}
          >
            <IconPlus size={16} /> Capture a Win
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate2-100">
          <div>
            <h2 className="font-medium text-navy-900">
              {loading ? "Loading…" : `${wins.length} win${wins.length === 1 ? "" : "s"}`}
            </h2>
            <p className="text-xs text-slate2-400 mt-0.5">
              Sorted by most recent
            </p>
          </div>
        </div>
        <WinList
          wins={wins}
          loading={loading}
          onSelect={(id) => navigate("win-summary", id)}
          emptyMessage="No wins captured yet. Capture your first win to populate this list."
        />
      </div>
    </div>
  );
}

function WinSummary({
  winId,
  navigate,
}: {
  winId: string;
  navigate: NavFn;
}) {
  const [win, setWin] = React.useState<StoredWin | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeSdj, setActiveSdj] = React.useState<StoredSdj | null>(null);
  const [sdjSource, setSdjSource] = React.useState<"ai" | "fallback" | "capture">(
    "capture",
  );
  const [sdjGeneratedAt, setSdjGeneratedAt] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const res = await fetch(`/api/wins/${winId}`, { cache: "no-store" });
        if (res.status === 404) {
          if (alive) setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const data = (await res.json()) as StoredWin;
        if (!alive) return;
        setWin(data);
        if (data.aiSummary) {
          setActiveSdj(data.aiSummary.sdj);
          setSdjSource("ai");
          setSdjGeneratedAt(data.aiSummary.generatedAt);
        } else {
          // No AI summary yet — auto-generate on first view.
          if (alive) setRefreshing(true);
          try {
            const sumRes = await fetch(`/api/wins/${data.id}/summary`, {
              method: "POST",
            });
            if (sumRes.ok) {
              const sumData = (await sumRes.json()) as {
                sdj: StoredSdj;
                source: "ai" | "fallback";
                generatedAt: string;
              };
              if (alive) {
                setActiveSdj(sumData.sdj);
                setSdjSource(sumData.source);
                setSdjGeneratedAt(sumData.generatedAt);
              }
            } else if (data.playbook) {
              if (alive) {
                setActiveSdj(data.playbook.sdj);
                setSdjSource("capture");
                setSdjGeneratedAt(data.createdAt);
              }
            }
          } catch {
            if (data.playbook && alive) {
              setActiveSdj(data.playbook.sdj);
              setSdjSource("capture");
              setSdjGeneratedAt(data.createdAt);
            }
          } finally {
            if (alive) setRefreshing(false);
          }
        }
      } catch {
        if (alive) setNotFound(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [winId]);

  const refresh = async () => {
    if (refreshing || !win) return;
    setRefreshing(true);
    try {
      const res = await fetch(`/api/wins/${win.id}/summary`, { method: "POST" });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const data = (await res.json()) as {
        sdj: StoredSdj;
        source: "ai" | "fallback";
        generatedAt: string;
      };
      setActiveSdj(data.sdj);
      setSdjSource(data.source);
      setSdjGeneratedAt(data.generatedAt);
    } catch {
      // No-op: keep current state.
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 sm:px-10 py-8 max-w-[1200px] mx-auto">
        <div className="card p-8 animate-pulse space-y-3">
          <div className="h-3 w-24 bg-slate2-100 rounded" />
          <div className="h-8 w-2/3 bg-slate2-100 rounded" />
          <div className="h-3 w-1/2 bg-slate2-100 rounded" />
        </div>
      </div>
    );
  }

  if (notFound || !win) {
    return (
      <div className="px-6 sm:px-10 py-8 max-w-[1200px] mx-auto">
        <div className="card p-10 text-center">
          <h2 className="font-serif text-2xl text-navy-900">Win not found</h2>
          <p className="text-sm text-slate2-500 mt-2">
            This win may have been removed or never saved.
          </p>
          <button
            className="btn-gold mt-5"
            onClick={() => navigate("wins")}
          >
            Back to Win Jar
          </button>
        </div>
      </div>
    );
  }

  const hasAnyAnswers = Object.values(win.answers).some(
    (v) => Array.isArray(v) && (v as string[]).some(Boolean),
  );
  if (!hasAnyAnswers) {
    return (
      <div className="px-6 sm:px-10 py-8 max-w-[1200px] mx-auto">
        <div className="card p-10 text-center">
          <div className="text-xs font-mono uppercase tracking-wider text-slate2-400 mb-2">
            {win.id} · Draft
          </div>
          <h2 className="font-serif text-2xl text-navy-900">
            {win.name || "Untitled win"}
          </h2>
          <p className="text-sm text-slate2-500 mt-2">
            This win has no answers yet. Resume the guided builder to start
            capturing.
          </p>
          <button
            className="btn-gold mt-5"
            onClick={() => navigate("capture")}
          >
            Resume capture
          </button>
        </div>
      </div>
    );
  }

  const sections: { id: SectionId; label: string }[] = [
    { id: "strategy", label: "Strategy" },
    { id: "workPlan", label: "Work Plan" },
    { id: "people", label: "People" },
    { id: "operations", label: "Operations" },
    { id: "results", label: "Results" },
  ];

  const sourceCaption =
    sdjSource === "ai"
      ? `Generated by Gordian AI · ${sdjGeneratedAt ? relativeTime(sdjGeneratedAt) : "just now"
      }`
      : sdjSource === "fallback"
        ? "AI unavailable — showing capture-time summary"
        : "Showing capture-time summary";

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate2-400 mb-1 flex items-center gap-2">
            <button
              className="hover:text-navy-900 flex items-center gap-1"
              onClick={() => navigate("wins")}
            >
              <IconChevR size={10} className="rotate-180" /> Win Jar
            </button>
            <span className="text-slate2-300">·</span>
            <span>{win.id}</span>
          </div>
          <h1 className="font-serif text-4xl text-navy-900 leading-tight">
            {win.name}
          </h1>
          <p className="text-slate2-500 mt-1 text-sm">
            {win.author} · captured {relativeTime(win.createdAt)}
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            className="btn-ghost"
            onClick={() => navigate("capture")}
          >
            <IconPlus size={14} /> Capture another
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((sec, i) => {
          const items = win.answers[sec.id] ?? [];
          const titles = win.answerTitles?.[sec.id] ?? [];
          const responseCount = items.filter(Boolean).length;
          return (
            <details
              key={sec.id}
              className="group/section card p-0 overflow-hidden"
            >
              <summary className="flex items-center gap-3 px-6 sm:px-7 py-4 cursor-pointer list-none select-none hover:bg-ivory/60 transition-colors">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-gold-700 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-medium text-navy-900">{sec.label}</span>
                <span className="h-px flex-1 bg-gold-100" />
                <span className="text-[10px] font-mono text-slate2-400">
                  {responseCount} response{responseCount === 1 ? "" : "s"}
                </span>
                <IconChevR
                  size={14}
                  className="text-slate2-400 group-open/section:rotate-90 transition-transform"
                />
              </summary>

              <div className="px-6 sm:px-7 pb-6 pt-1">
                {responseCount === 0 ? (
                  <div className="text-sm text-slate2-400 italic">
                    — not captured —
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {items.map((body, j) => {
                      if (!body) return null;
                      const title = titles[j]?.trim() || deriveTitle(body);
                      return (
                        <li key={j}>
                          <details className="group/item rounded-lg border border-slate2-100 bg-ivory/40 open:bg-white open:border-slate2-200 transition-colors">
                            <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer list-none select-none">
                              <span className="font-mono text-[10px] text-slate2-400 w-4">
                                {String(j + 1).padStart(2, "0")}
                              </span>
                              <span className="flex-1 text-sm font-medium text-navy-900">
                                {title}
                              </span>
                              <IconChevR
                                size={14}
                                className="text-slate2-400 group-open/item:rotate-90 transition-transform"
                              />
                            </summary>
                            <div className="px-4 pb-4 pt-1 pl-11 text-sm text-slate2-700 leading-relaxed whitespace-pre-line">
                              {body}
                            </div>
                          </details>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </details>
          );
        })}

        <div className="card p-6 sm:p-7">
          <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-slate2-500 mb-2">
            Repeatable Rule
          </div>
          <p className="font-serif italic text-xl text-navy-900 leading-snug">
            &quot;{win.playbook.repeatableRule}&quot;
          </p>
        </div>

        <div className="card p-6 sm:p-8 bg-ivory/50">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-slate2-500 mb-1">
                Feedback / Recommendations
              </div>
              <h2 className="font-serif text-2xl text-navy-900 leading-tight">
                What to learn from this win
              </h2>
              <p className="text-xs text-slate2-500 mt-1">
                {sourceCaption}
              </p>
            </div>
            <button
              className="btn-ghost"
              onClick={refresh}
              disabled={refreshing}
            >
              <IconSparkle size={14} />{" "}
              {refreshing ? "Refreshing…" : "Refresh summary"}
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate2-100 bg-white">
            <WsdjRow
              letter="W"
              label="Win"
              tone="navy"
              text={win.name}
              hint="Name the win"
            />
            <WsdjRow
              letter="S"
              label="Save"
              tone="emerald"
              text={activeSdj.save}
              hint="What the business should keep and repeat going forward"
            />
            <WsdjRow
              letter="D"
              label="Delete"
              tone="red"
              text={activeSdj.delete}
              hint="What should not be repeated in a similar strategy"
            />
            <WsdjRow
              letter="J"
              label="Join"
              tone="gold"
              text={activeSdj.join}
              hint="What to combine with this approach to improve results"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function WsdjRow({
  letter,
  label,
  tone,
  text,
  hint,
}: {
  letter: string;
  label: string;
  tone: "navy" | "emerald" | "red" | "gold";
  text: string;
  hint: string;
}) {
  const toneCls = {
    navy: "bg-navy-900 text-paper border-navy-900",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    red: "bg-red-100 text-red-700 border-red-200",
    gold: "bg-gold-100 text-gold-700 border-gold-200",
  }[tone];
  return (
    <div className="grid grid-cols-[auto_140px_1fr] gap-4 px-4 sm:px-5 py-4 border-t border-slate2-100 first:border-t-0 items-start">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-mono font-medium border ${toneCls} shrink-0`}
      >
        {letter}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-navy-900">{label}</div>
        <div className="text-[11px] text-slate2-400 leading-snug">{hint}</div>
      </div>
      <div className="text-sm text-slate2-700 leading-relaxed">{text}</div>
    </div>
  );
}

// =====================================================================
// Ask Gordian
// =====================================================================

type ChatSource = { title: string; type: string };
type ChatMsg = {
  role: "user" | "assistant";
  text: string;
  sources?: boolean;
  sourceList?: ChatSource[];
};

function Ask() {
  const [messages, setMessages] = React.useState<ChatMsg[]>([
    {
      role: "assistant",
      text: "Hi! I'm Gordian — your org's decision intelligence coach. I'm grounded in your team's captured wins and playbooks. Ask me about a stakeholder situation, a stalled deal, a cross-team challenge, or how past decisions were made.",
    },
  ]);
  const [typing, setTyping] = React.useState(false);
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const send = async (text?: string) => {
    const t = (text ?? input).trim();
    if (!t || typing) return;

    const nextMessages: ChatMsg[] = [
      ...messages,
      { role: "user", text: t },
    ];
    setMessages(nextMessages);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/gordian-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ??
          `Request failed with status ${res.status}`,
        );
      }

      const data = (await res.json()) as {
        answer: string;
        sources?: ChatSource[];
      };

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: data.answer,
          sources: Boolean(data.sources && data.sources.length),
          sourceList: data.sources,
        },
      ]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "I couldn't reach the local Gordian model. Make sure the local-llm server is running on port 8001.";
      setMessages((m) => [
        ...m,
        { role: "assistant", text: message },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const suggestions = [
    "How do I reset trust with a frustrated stakeholder?",
    "What's the playbook for a stalled partnership?",
    "How should we run a cross-team handoff?",
  ];

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1100px] mx-auto h-full">
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate2-400 mb-1">
            Coach
          </div>
          <h1 className="font-serif text-4xl text-navy-900 leading-tight">
            Ask Gordian
          </h1>
          <p className="text-slate2-500 mt-1 text-sm">
            Grounded in your org&apos;s captured wins. Every answer cites the
            playbook behind it.
          </p>
        </div>
        <span className="chip">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
          to 12 wins · 8 playbooks
        </span>
      </div>

      <div
        className="card overflow-hidden flex flex-col"
        style={{ height: "min(78vh, 720px)" }}
      >
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6"
        >
          {messages.map((m, i) => (
            <AskMessage key={i} m={m} />
          ))}
          {typing && <AskTyping />}
        </div>

        <div className="border-t border-slate2-100 p-4 bg-ivory">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button
                key={s}
                className="chip hover:bg-white transition-colors"
                onClick={() => send(s)}
              >
                <IconSparkle size={12} /> {s}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <div className="flex-1 relative">
              <input
                className="input pr-10"
                placeholder="Ask about a decision, stakeholder, or scenario…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button
              className="btn-primary"
              type="submit"
              disabled={!input.trim()}
            >
              <IconSend size={14} /> Send
            </button>
          </form>
          <div className="text-[11px] text-slate2-400 mt-2 flex items-center gap-2">
            <IconLock size={11} /> Answers stay inside Aurora Systems.{" "}
            <span className="hairline w-px h-3 inline-block" /> Press{" "}
            <span className="kbd">↵</span> to send.
          </div>
        </div>
      </div>
    </div>
  );
}

function AskMessage({ m }: { m: ChatMsg }) {
  if (m.role === "user") {
    return (
      <div className="flex gap-3 justify-end">
        <div className="max-w-[80%]">
          <div className="bg-navy-900 text-paper rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed">
            {m.text}
          </div>
          <div className="text-[11px] text-slate2-400 mt-1 text-right">
            You · just now
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate2-200 text-navy-900 flex items-center justify-center text-xs font-medium shrink-0">
          L
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3 anim-in">
      <div className="w-8 h-8 rounded-full bg-navy-900 text-paper flex items-center justify-center shrink-0">
        <IconKnot size={16} />
      </div>
      <div className="max-w-[88%]">
        <div className="bg-white border border-slate2-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-navy-900">
          {m.text}
        </div>
        {m.sources && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(m.sourceList ?? []).map((s, idx) => (
              <span key={idx} className="chip chip-gold">
                <IconDoc size={11} /> {s.title}
                {s.type ? ` · ${s.type}` : ""}
              </span>
            ))}
          </div>
        )}
        <div className="text-[11px] text-slate2-400 mt-1.5">
          Gordian · grounded in 1 win
        </div>
      </div>
    </div>
  );
}

function AskTyping() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-navy-900 text-paper flex items-center justify-center shrink-0">
        <IconKnot size={16} />
      </div>
      <div className="bg-white border border-slate2-100 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          <span
            className="w-1.5 h-1.5 rounded-full bg-slate2-400 pulse-dot"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-slate2-400 pulse-dot"
            style={{ animationDelay: ".15s" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-slate2-400 pulse-dot"
            style={{ animationDelay: ".3s" }}
          />
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Replay
// =====================================================================

type ReplayOptionId = "A" | "B" | "C" | "D";
type ReplayOption = {
  id: ReplayOptionId;
  text: string;
  isCorrect: boolean;
  why: string;
};
type ReplayScenario = {
  id: string;
  sourceWinId: string;
  sourceWinName: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prompt: string;
  question: string;
  options: ReplayOption[];
  repeatableRule: string;
};
type ReplayScenariosResponse = { scenarios: ReplayScenario[] };

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function Replay({ navigate }: { navigate: NavFn }) {
  const [scenarios, setScenarios] = React.useState<ReplayScenario[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [picked, setPicked] = React.useState<string | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  const [reloadToken, setReloadToken] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setCurrentIndex(0);
    setPicked(null);
    setShowFeedback(false);
    setCompleted(false);
    fetch("/api/replay-scenarios", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as ReplayScenariosResponse;
      })
      .then((data) => {
        if (cancelled) return;
        setScenarios(Array.isArray(data?.scenarios) ? data.scenarios : []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not load Decision Replay scenarios.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const scenario = scenarios[currentIndex];
  const correctOption = scenario?.options.find((o) => o.isCorrect) ?? null;
  const pickedOption = scenario?.options.find((o) => o.id === picked) ?? null;
  const correct = Boolean(pickedOption?.isCorrect);
  const total = scenarios.length;
  const isLast = total > 0 && currentIndex >= total - 1;

  const submit = () => {
    if (!picked) return;
    setShowFeedback(true);
  };
  const goNext = () => {
    if (isLast) {
      setCompleted(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setPicked(null);
    setShowFeedback(false);
  };
  const practiceAgain = () => setReloadToken((t) => t + 1);

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate2-400 mb-1">
          Practice mode
        </div>
        <h1 className="font-serif text-4xl text-navy-900 leading-tight">
          Decision Replay
        </h1>
        <p className="text-slate2-500 mt-1 text-sm max-w-xl">
          Rehearse a real decision before you have to make it for real.
          Scenarios are generated from your org&apos;s wins.
        </p>
      </div>
      {scenario && !completed && (
        <div className="flex gap-2">
          <span className="chip">
            Difficulty:{" "}
            <span className="text-navy-900 font-medium ml-1">
              {scenario.difficulty}
            </span>
          </span>
          <span className="chip">
            <IconBolt size={12} className="text-gold-500" /> Based on{" "}
            {scenario.sourceWinId}
          </span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="px-6 sm:px-10 py-8 max-w-[1100px] mx-auto">
        {header}
        <div className="card p-8 text-center text-slate2-500">
          Generating scenarios from your captured wins…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 sm:px-10 py-8 max-w-[1100px] mx-auto">
        {header}
        <div className="card p-8 text-center">
          <h3 className="font-medium text-navy-900">{error}</h3>
          <p className="text-sm text-slate2-500 mt-2">
            Something went wrong reaching the scenario generator.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <button className="btn-primary" onClick={practiceAgain}>
              Retry <IconArrow size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="px-6 sm:px-10 py-8 max-w-[1100px] mx-auto">
        {header}
        <div className="card p-8 text-center">
          <h3 className="font-medium text-navy-900">
            No wins found yet.
          </h3>
          <p className="text-sm text-slate2-500 mt-2">
            Capture a win first to generate Decision Replay scenarios.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <button className="btn-primary" onClick={() => navigate("capture")}>
              Capture a win <IconArrow size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="px-6 sm:px-10 py-8 max-w-[1100px] mx-auto">
        {header}
        <div className="card p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white mx-auto flex items-center justify-center">
            <IconCheck size={22} />
          </div>
          <h3 className="font-medium text-navy-900 mt-4">Replay complete.</h3>
          <p className="text-sm text-slate2-500 mt-2">
            You practiced {total} decision{" "}
            {total === 1 ? "scenario" : "scenarios"} generated from your
            captured wins.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button className="btn-primary" onClick={practiceAgain}>
              Practice again <IconArrow size={14} />
            </button>
            <button className="btn-ghost" onClick={() => navigate("capture")}>
              Capture another win
            </button>
            <button className="btn-gold" onClick={() => navigate("ask")}>
              Ask Gordian to coach me <IconArrow size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Scenario is guaranteed defined here.
  if (!scenario) return null;
  const upcoming = scenarios.slice(currentIndex + 1);

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1100px] mx-auto">
      {header}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-slate2-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-navy-900 text-paper flex items-center justify-center">
                <IconReplay size={16} />
              </span>
              <div>
                <h2 className="font-medium text-navy-900">
                  Scenario {pad2(currentIndex + 1)} of {pad2(total)}
                </h2>
                <p className="text-xs text-slate2-400">
                  {scenario.category} · {scenario.sourceWinName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {scenarios.map((_, i) => (
                <span
                  key={i}
                  className={`w-6 h-1 rounded-full ${i === currentIndex ? "bg-gold-400" : "bg-slate2-200"
                    }`}
                />
              ))}
            </div>
          </div>

          <div className="px-6 sm:px-8 py-7">
            <p className="font-serif text-2xl text-navy-900 leading-snug">
              &quot;{scenario.prompt}
              <br />
              <span className="text-gold-700">{scenario.question}</span>
              &quot;
            </p>

            <div className="mt-7 space-y-2.5">
              {scenario.options.map((opt) => {
                const isPicked = picked === opt.id;
                const isCorrect = showFeedback && opt.isCorrect;
                const isWrong = showFeedback && isPicked && !opt.isCorrect;
                return (
                  <button
                    key={opt.id}
                    onClick={() => !showFeedback && setPicked(opt.id)}
                    disabled={showFeedback}
                    className={`w-full text-left rounded-xl border p-4 flex items-start gap-3 transition-all
                      ${isCorrect
                        ? "border-emerald-300 bg-emerald-50/50"
                        : isWrong
                          ? "border-red-200 bg-red-50/50"
                          : isPicked
                            ? "border-gold-300 bg-gold-50/50 shadow-soft"
                            : "border-slate2-100 bg-white hover:border-slate2-300 hover:bg-ivory/60"
                      }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-medium shrink-0
                      ${isCorrect
                          ? "bg-emerald-600 text-white"
                          : isWrong
                            ? "bg-red-500 text-white"
                            : isPicked
                              ? "bg-navy-900 text-paper"
                              : "bg-slate2-100 text-slate2-700"
                        }`}
                    >
                      {isCorrect ? (
                        <IconCheck size={14} />
                      ) : isWrong ? (
                        <IconClose size={14} />
                      ) : (
                        opt.id
                      )}
                    </span>
                    <div className="flex-1">
                      <div className="text-navy-900 leading-snug">
                        {opt.text}
                      </div>
                      {showFeedback && (isCorrect || isWrong) && (
                        <div
                          className={`text-xs mt-2 ${isCorrect ? "text-emerald-700" : "text-red-700"}`}
                        >
                          {opt.why}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
              <div className="text-xs text-slate2-400 flex items-center gap-2">
                <IconHelp size={12} /> Choose the action that best repeats the
                successful pattern.
              </div>
              {!showFeedback ? (
                <button
                  className="btn-primary"
                  onClick={submit}
                  disabled={!picked}
                >
                  Submit answer <IconArrow size={14} />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button className="btn-ghost" onClick={() => navigate("ask")}>
                    Ask Gordian to coach me
                  </button>
                  <button className="btn-gold" onClick={goNext}>
                    {isLast ? "Finish replay" : "Next scenario"}{" "}
                    <IconArrow size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {showFeedback && (
            <div
              className={`px-6 sm:px-8 py-6 border-t anim-in ${correct ? "bg-emerald-50/40 border-emerald-100" : "bg-gold-50/40 border-gold-100"}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${correct ? "bg-emerald-600 text-white" : "bg-gold-500 text-navy-900"}`}
                >
                  {correct ? <IconCheck size={18} /> : <IconSparkle size={18} />}
                </div>
                <div>
                  <h3 className="font-medium text-navy-900">
                    {correct ? "Correct." : "Worth a re-read."}
                  </h3>
                  {pickedOption && !correct && (
                    <p className="text-sm text-navy-900/80 mt-1.5 leading-relaxed">
                      <span className="font-medium">Your pick:</span>{" "}
                      {pickedOption.why}
                    </p>
                  )}
                  {correctOption && (
                    <p className="text-sm text-navy-900/80 mt-1.5 leading-relaxed">
                      <span className="font-medium">Best action:</span>{" "}
                      {correctOption.why}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="chip chip-gold">
                      <IconDoc size={11} /> Source: {scenario.sourceWinId} ·{" "}
                      {scenario.sourceWinName}
                    </span>
                    <span className="chip">Repeatable Rule applied</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate2-400 mb-3">
              Why this matters
            </div>
            <p className="text-sm text-navy-900 leading-relaxed">
              Replay rehearses high-stakes decisions in a low-stakes setting.
              Teams that practice 2× per quarter ship with measurably more
              confidence.
            </p>
          </div>
          <div className="card p-5">
            <h4 className="font-medium text-navy-900 flex items-center gap-2">
              <IconFlag size={14} /> Up next
            </h4>
            {upcoming.length === 0 ? (
              <p className="mt-3 text-sm text-slate2-400">
                No more scenarios in this replay.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {upcoming.map((s, i) => (
                  <li key={s.id} className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate2-400">
                      {pad2(currentIndex + 2 + i)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-navy-900 truncate">
                        {s.title}
                      </div>
                      <div className="text-xs text-slate2-400 truncate">
                        {s.category} · {s.sourceWinId}
                      </div>
                    </div>
                    <IconChevR size={14} className="text-slate2-300" />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="card p-5 knot-bg text-paper">
            <div className="text-[11px] font-mono uppercase tracking-wider text-gold-300 mb-2">
              Your progress
            </div>
            <div className="font-serif text-4xl">
              {currentIndex + (showFeedback ? 1 : 0)}/{total}
            </div>
            <p className="text-sm text-slate2-200/80 mt-2">
              Scenarios answered in this replay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Capture (Guided Win Builder)
// =====================================================================

const EWS_SECTIONS = [
  {
    id: "strategy",
    label: "Strategy",
    blurb: "The why behind the win",
    questions: [
      "What was the main goal or strategic purpose behind this win?",
      "Which vision, mission, values, or priorities did this win support?",
      "What problem or opportunity were you trying to address?",
      "Why did this win matter to the organization?",
    ],
    summaryLead: "Great. Here's what I captured for Strategy.",
    transition: "Now let's move to Work Plan.",
  },
  {
    id: "workPlan",
    label: "Work Plan",
    blurb: "The practical path forward",
    questions: [
      "What was the practical plan that helped make this win happen?",
      "What were the key milestones or events on the timeline?",
      "What tasks had to be completed?",
      "What resources, time, budget, or approvals were needed?",
    ],
    summaryLead: "Here's the Work Plan as I'm hearing it.",
    transition: "Next up — the People who made it real.",
  },
  {
    id: "people",
    label: "People",
    blurb: "Who made it happen",
    questions: [
      "Who helped make this win happen?",
      "What roles or responsibilities mattered most?",
      "What skills, attitudes, or communication strengths helped the team succeed?",
      "Who needed to be Accountable, Consulted, or Told?",
    ],
    summaryLead: "Captured. Here's the People view.",
    transition: "Let's pivot to Operations.",
  },
  {
    id: "operations",
    label: "Operations",
    blurb: "Systems that supported the win",
    questions: [
      "What systems, processes, tools, or policies supported this win?",
      "What operational barriers had to be solved?",
      "What departments or functions were involved?",
      "What would need to be in place to repeat this win again?",
    ],
    summaryLead: "Logged. Operations summary coming together.",
    transition: "Final stretch — Results.",
  },
  {
    id: "results",
    label: "Results",
    blurb: "The proof and the lesson",
    questions: [
      "What measurable results showed this was a win?",
      "What quantitative results can be captured, such as revenue, time saved, cost reduced, or completion rate?",
      "What qualitative results can be captured, such as trust, morale, customer feedback, or community impact?",
      "What is the repeatable lesson from this win?",
    ],
    summaryLead: "All five sections captured.",
    transition:
      "When you're ready, generate the Executive Winning System Playbook below.",
  },
] as const;

type SectionId = (typeof EWS_SECTIONS)[number]["id"];
type Answers = { winName: string } & Record<SectionId, string[]>;

type BotKind =
  | "welcome"
  | "question"
  | "context"
  | "summary"
  | "transition"
  | "cta";

type ChatBubbleMsg =
  | { role: "user"; text: string }
  | {
    role: "bot";
    text: string;
    kind?: BotKind;
    sectionId?: SectionId;
    sectionLabel?: string;
  };

function shorten(s: string, n = 140) {
  s = (s || "").replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

type Playbook = {
  name: string;
  summaries: Record<SectionId, string[]>;
  repeatableRule: string;
  suggestedNextWin: string;
  sdj: { save: string; delete: string; join: string };
};

type CaptureChatMode =
  | "pick_next_question"
  | "process_user_message"
  | "summarize_section"
  | "generate_playbook";

type CaptureProcessResult =
  | { kind: "answer"; assistantMessage: string; capturedAnswer: string }
  | { kind: "side_question"; reply: string };

type CaptureChatRequest = {
  winName: string;
  sectionId: SectionId;
  sectionLabel: string;
  questionIndex: number;
  questionsPerSection: number;
  currentQuestion?: string;
  lastAnswer?: string;
  userMessage?: string;
  answers: Record<SectionId, string[]>;
  priorQuestions?: Partial<Record<SectionId, string[]>>;
  mode: CaptureChatMode;
};

type CaptureChatResponse = {
  assistantMessage: string;
  nextQuestion?: string | null;
  sectionSummary?: string[];
  isSectionComplete: boolean;
  isFlowComplete: boolean;
  playbook: Playbook | null;
  answerTitles?: Record<SectionId, string[]>;
  process?: CaptureProcessResult;
};

const QUESTIONS_PER_SECTION = 3;

async function callCaptureChat(
  req: CaptureChatRequest,
): Promise<CaptureChatResponse> {
  const res = await fetch("/api/capture-win-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(
      data.error ?? `Capture chat failed with status ${res.status}`,
    );
  }
  return (await res.json()) as CaptureChatResponse;
}

const EMPTY_SECTION_RECORD = (): Record<SectionId, string[]> => ({
  strategy: [],
  workPlan: [],
  people: [],
  operations: [],
  results: [],
});

function Capture({ navigate }: { navigate: NavFn }) {
  const [winName, setWinName] = React.useState("");
  const [sectionIdx, setSectionIdx] = React.useState(-1);
  const [qIdx, setQIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({
    winName: "",
    strategy: [],
    workPlan: [],
    people: [],
    operations: [],
    results: [],
  });
  const [questionsAsked, setQuestionsAsked] = React.useState<
    Record<SectionId, string[]>
  >(EMPTY_SECTION_RECORD);
  const [currentQuestion, setCurrentQuestion] = React.useState<string>("");
  const [messages, setMessages] = React.useState<ChatBubbleMsg[]>([]);
  const [typing, setTyping] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [complete, setComplete] = React.useState(false);
  const [playbookStarted, setPlaybookStarted] = React.useState(false);
  const [savedWinId, setSavedWinId] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const initRef = React.useRef(false);

  const patchWin = React.useCallback(
    async (id: string, body: Record<string, unknown>) => {
      try {
        const res = await fetch(`/api/wins/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`PATCH failed (${res.status})`);
      } catch (err) {
        setSaveError(
          err instanceof Error ? err.message : "Could not save progress",
        );
      }
    },
    [],
  );

  const pushBot = React.useCallback(
    async (texts: string[] | string, kind?: BotKind) => {
      setTyping(true);
      await new Promise((r) => setTimeout(r, 420));
      const items = Array.isArray(texts) ? texts : [texts];
      for (let i = 0; i < items.length; i++) {
        const t = items[i];
        const k: BotKind =
          kind || (i === items.length - 1 ? "question" : "context");
        setMessages((m) => [...m, { role: "bot", text: t, kind: k }]);
        if (i < items.length - 1)
          await new Promise((r) => setTimeout(r, 420));
      }
      setTyping(false);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    },
    [],
  );

  React.useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    pushBot(
      [
        "Welcome to the Guided Win Builder. I'll help you turn one successful outcome into a repeatable playbook using the Executive Winning System.",
        "I adapt my questions to your win, and you can ask me a quick business question any time — those won't be saved with the win.",
        "First, what would you like to call this win?",
      ],
      "welcome",
    );
  }, [pushBot]);

  React.useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const handleApiError = React.useCallback((message: string) => {
    setMessages((m) => [
      ...m,
      {
        role: "bot",
        text:
          message ||
          "I couldn't reach the Gordian model right now. Make sure the local LLM server is running, then try again.",
        kind: "context",
      },
    ]);
    setTyping(false);
  }, []);

  const askNextQuestion = React.useCallback(
    async (
      sec: (typeof EWS_SECTIONS)[number],
      qSlot: number,
      sectionAnswers: Record<SectionId, string[]>,
      askedAcrossSections: Record<SectionId, string[]>,
      latestWinName: string,
    ): Promise<string> => {
      try {
        const res = await callCaptureChat({
          winName: latestWinName,
          sectionId: sec.id,
          sectionLabel: sec.label,
          questionIndex: qSlot,
          questionsPerSection: QUESTIONS_PER_SECTION,
          answers: sectionAnswers,
          priorQuestions: askedAcrossSections,
          mode: "pick_next_question",
        });
        const q =
          res.nextQuestion ??
          res.assistantMessage ??
          sec.questions[Math.min(qSlot, sec.questions.length - 1)];
        return q;
      } catch {
        return sec.questions[Math.min(qSlot, sec.questions.length - 1)];
      }
    },
    [],
  );

  const submit = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing || complete) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);

    // Phase 1: capture the win name and start a draft on disk.
    if (sectionIdx === -1) {
      setWinName(text);
      const seededAnswers: Answers = { ...answers, winName: text };
      setAnswers(seededAnswers);

      setTyping(true);
      // Create a draft so we can PATCH iteratively from here on.
      try {
        const res = await fetch("/api/wins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: seededAnswers }),
        });
        if (!res.ok) throw new Error(`Draft create failed (${res.status})`);
        const created = (await res.json()) as { id: string };
        setSavedWinId(created.id);
        setSaveError(null);
      } catch (err) {
        setSaveError(
          err instanceof Error ? err.message : "Could not start a draft win",
        );
      }

      const firstSection = EWS_SECTIONS[0];
      const firstQ = await askNextQuestion(
        firstSection,
        0,
        EMPTY_SECTION_RECORD(),
        EMPTY_SECTION_RECORD(),
        text,
      );
      setCurrentQuestion(firstQ);

      await pushBot(
        [
          `"${text}" — got it. Let's start with **Strategy**.`,
          firstQ,
        ],
        "question",
      );
      setSectionIdx(0);
      setQIdx(0);
      return;
    }

    const section = EWS_SECTIONS[sectionIdx];
    const sectionAnswersBefore: Record<SectionId, string[]> = {
      strategy: answers.strategy,
      workPlan: answers.workPlan,
      people: answers.people,
      operations: answers.operations,
      results: answers.results,
    };

    setTyping(true);

    // Phase 2: classify whether the input is an answer or a side question.
    let processed: CaptureProcessResult | null = null;
    try {
      const res = await callCaptureChat({
        winName: answers.winName,
        sectionId: section.id,
        sectionLabel: section.label,
        questionIndex: qIdx,
        questionsPerSection: QUESTIONS_PER_SECTION,
        currentQuestion,
        userMessage: text,
        answers: sectionAnswersBefore,
        mode: "process_user_message",
      });
      processed = res.process ?? null;
    } catch (err) {
      handleApiError(err instanceof Error ? err.message : "");
      return;
    }

    // Side question — reply, do not store, leave the active question pending.
    if (processed?.kind === "side_question") {
      setMessages((m) => [
        ...m,
        { role: "bot", text: processed!.reply, kind: "context" },
        {
          role: "bot",
          text: `To recap: ${currentQuestion}`,
          kind: "question",
        },
      ]);
      setTyping(false);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
      return;
    }

    // Treat as an answer.
    const captured =
      processed?.kind === "answer" && processed.capturedAnswer
        ? processed.capturedAnswer
        : text;
    const ack =
      processed?.kind === "answer" ? processed.assistantMessage : "Captured.";

    const newAnswers: Answers = {
      ...answers,
      [section.id]: [...(answers[section.id] || [])],
    };
    newAnswers[section.id][qIdx] = captured;
    setAnswers(newAnswers);

    const newQuestionsAsked: Record<SectionId, string[]> = {
      ...questionsAsked,
      [section.id]: [...(questionsAsked[section.id] || [])],
    };
    newQuestionsAsked[section.id][qIdx] = currentQuestion;
    setQuestionsAsked(newQuestionsAsked);

    const sectionAnswersAfter: Record<SectionId, string[]> = {
      strategy: newAnswers.strategy,
      workPlan: newAnswers.workPlan,
      people: newAnswers.people,
      operations: newAnswers.operations,
      results: newAnswers.results,
    };

    if (savedWinId) {
      void patchWin(savedWinId, {
        answers: newAnswers,
        questions: newQuestionsAsked,
      });
    }

    const isLast = qIdx >= QUESTIONS_PER_SECTION - 1;

    if (!isLast) {
      const nextQ = await askNextQuestion(
        section,
        qIdx + 1,
        sectionAnswersAfter,
        newQuestionsAsked,
        newAnswers.winName,
      );
      setCurrentQuestion(nextQ);
      setMessages((m) => [
        ...m,
        { role: "bot", text: ack, kind: "context" },
        { role: "bot", text: nextQ, kind: "question" },
      ]);
      setQIdx(qIdx + 1);
      setTyping(false);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
      return;
    }

    // End of section — summarize, then either advance to the next section
    // or surface the playbook CTA.
    const isFinalSection = sectionIdx >= EWS_SECTIONS.length - 1;
    try {
      const summaryRes = await callCaptureChat({
        winName: newAnswers.winName,
        sectionId: section.id,
        sectionLabel: section.label,
        questionIndex: qIdx,
        questionsPerSection: QUESTIONS_PER_SECTION,
        currentQuestion,
        lastAnswer: captured,
        answers: sectionAnswersAfter,
        mode: "summarize_section",
      });

      const bullets = summaryRes.sectionSummary ?? [];
      const summaryBubble = bullets.map((c) => `• ${shorten(c)}`).join("\n");

      setMessages((m) => [
        ...m,
        { role: "bot", text: ack, kind: "context" },
        {
          role: "bot",
          text: summaryRes.assistantMessage || section.summaryLead,
          kind: "context",
        },
        {
          role: "bot",
          text: summaryBubble,
          kind: "summary",
          sectionId: section.id,
          sectionLabel: section.label,
        },
      ]);

      if (!isFinalSection) {
        const next = EWS_SECTIONS[sectionIdx + 1];
        const firstQ = await askNextQuestion(
          next,
          0,
          sectionAnswersAfter,
          newQuestionsAsked,
          newAnswers.winName,
        );
        setCurrentQuestion(firstQ);
        setMessages((m) => [
          ...m,
          { role: "bot", text: section.transition, kind: "transition" },
          { role: "bot", text: firstQ, kind: "question" },
        ]);
        setSectionIdx(sectionIdx + 1);
        setQIdx(0);
      } else {
        setMessages((m) => [
          ...m,
          { role: "bot", text: section.transition, kind: "cta" },
        ]);
        setComplete(true);
      }
    } catch (err) {
      handleApiError(err instanceof Error ? err.message : "");
      return;
    }
    setTyping(false);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  };

  const reset = () => {
    setWinName("");
    setSectionIdx(-1);
    setQIdx(0);
    setAnswers({
      winName: "",
      strategy: [],
      workPlan: [],
      people: [],
      operations: [],
      results: [],
    });
    setQuestionsAsked(EMPTY_SECTION_RECORD());
    setCurrentQuestion("");
    setMessages([]);
    setComplete(false);
    setPlaybookStarted(false);
    setSavedWinId(null);
    setSaveError(null);
    setInput("");
    setTimeout(() => {
      pushBot(
        [
          "Welcome to the Guided Win Builder. I'll help you turn one successful outcome into a repeatable playbook using the Executive Winning System.",
          "I adapt my questions to your win, and you can ask me a quick business question any time — those won't be saved with the win.",
          "First, what would you like to call this win?",
        ],
        "welcome",
      );
    }, 80);
  };

  const generate = async () => {
    if (typing) return;
    setPlaybookStarted(true);
    setTyping(true);
    try {
      const res = await callCaptureChat({
        winName: answers.winName,
        sectionId: "results",
        sectionLabel: "Results",
        questionIndex: 0,
        questionsPerSection: QUESTIONS_PER_SECTION,
        answers: {
          strategy: answers.strategy,
          workPlan: answers.workPlan,
          people: answers.people,
          operations: answers.operations,
          results: answers.results,
        },
        mode: "generate_playbook",
      });
      if (res.playbook) {
        let winId = savedWinId;
        if (winId) {
          await patchWin(winId, {
            answers,
            questions: questionsAsked,
            answerTitles: res.answerTitles,
            playbook: res.playbook,
            description: res.playbook.summaries.strategy?.[0] ?? "",
          });
        } else {
          try {
            const saveRes = await fetch("/api/wins", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                answers,
                playbook: res.playbook,
                questions: questionsAsked,
                answerTitles: res.answerTitles,
              }),
            });
            if (!saveRes.ok) throw new Error(`Save failed (${saveRes.status})`);
            const saved = (await saveRes.json()) as { id: string };
            winId = saved.id;
            setSavedWinId(winId);
            setSaveError(null);
          } catch (err) {
            setSaveError(
              err instanceof Error ? err.message : "Could not save this win",
            );
          }
        }
        setTyping(false);
        if (winId) navigate("win-summary", winId);
      } else {
        handleApiError("");
      }
    } catch (err) {
      handleApiError(err instanceof Error ? err.message : "");
    } finally {
      setTyping(false);
    }
  };

  const currentSection = sectionIdx >= 0 ? EWS_SECTIONS[sectionIdx] : null;
  const stepperState = EWS_SECTIONS.map((_, i) => {
    if (complete) return "done" as const;
    if (sectionIdx > i) return "done" as const;
    if (sectionIdx === i) return "active" as const;
    return "upcoming" as const;
  });

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1280px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate2-400 mb-1">
            Executive Winning System
          </div>
          <h1 className="font-serif text-4xl text-navy-900 leading-tight">
            Guided Win Builder
          </h1>
          <p className="text-slate2-500 mt-1 text-sm max-w-xl">
            Turn a leadership win into a repeatable Executive Winning System
            playbook.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="chip chip-gold">
            Strategy <IconChevR size={10} /> Work Plan <IconChevR size={10} />{" "}
            People <IconChevR size={10} /> Operations <IconChevR size={10} />{" "}
            Results
          </span>
          <button className="btn-ghost" onClick={reset}>
            <IconReplay size={14} /> Reset
          </button>
        </div>
      </div>

      <ProgressStepper
        states={stepperState}
        qIdx={qIdx}
        complete={complete}
        questionsPerSection={QUESTIONS_PER_SECTION}
      />

      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2">
          <ChatPanel
            messages={messages}
            typing={typing}
            input={input}
            setInput={setInput}
            inputRef={inputRef}
            scrollRef={scrollRef}
            onSubmit={() => submit()}
            placeholder={inputPlaceholder(sectionIdx, complete)}
            currentSection={currentSection}
            complete={complete}
            onGenerate={generate}
            playbookOpen={playbookStarted}
            winName={winName}
          />
        </div>
        <div className="lg:col-span-1">
          <CapturedSoFarPanel
            answers={answers}
            sectionIdx={sectionIdx}
            complete={complete}
            questionsPerSection={QUESTIONS_PER_SECTION}
          />
        </div>
      </div>

    </div>
  );
}

function inputPlaceholder(sectionIdx: number, complete: boolean) {
  if (complete) return "All sections captured — generate your playbook above ↑";
  if (sectionIdx === -1)
    return 'Name this win… e.g. "Client Recovery Through Fast Alignment"';
  return "Type your answer…";
}

function ProgressStepper({
  states,
  qIdx,
  complete,
  questionsPerSection,
}: {
  states: ("done" | "active" | "upcoming")[];
  qIdx: number;
  complete: boolean;
  questionsPerSection: number;
}) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center gap-1 sm:gap-3 overflow-x-auto">
        {EWS_SECTIONS.map((s, i) => {
          const state = states[i];
          const isActive = state === "active";
          const isDone = state === "done";
          return (
            <React.Fragment key={s.id}>
              <div
                className={`flex items-center gap-3 px-2.5 py-2 rounded-xl shrink-0 transition-colors
                  ${isActive
                    ? "bg-gold-50 border border-gold-200"
                    : isDone
                      ? "bg-emerald-50/60 border border-emerald-100"
                      : "bg-transparent border border-transparent"
                  }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-medium shrink-0
                    ${isActive
                      ? "bg-gold-400 text-navy-900"
                      : isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-slate2-100 text-slate2-500"
                    }`}
                >
                  {isDone ? <IconCheck size={14} /> : String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div
                    className={`text-sm font-medium leading-tight whitespace-nowrap
                      ${isActive
                        ? "text-gold-700"
                        : isDone
                          ? "text-emerald-700"
                          : "text-slate2-500"
                      }`}
                  >
                    {s.label}
                  </div>
                  <div className="text-[11px] text-slate2-400 hidden sm:block">
                    {s.blurb}
                  </div>
                </div>
                {isActive && !complete && (
                  <span className="hidden md:flex items-center gap-1.5 ml-2 text-[11px] font-mono text-gold-700">
                    <span className="w-1 h-1 rounded-full bg-gold-500 pulse-dot" />
                    Q{qIdx + 1}/{questionsPerSection}
                  </span>
                )}
              </div>
              {i < EWS_SECTIONS.length - 1 && (
                <div
                  className={`hidden sm:block h-px flex-1 min-w-[16px] ${states[i] === "done" ? "bg-emerald-200" : "bg-slate2-100"
                    }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function ChatPanel({
  messages,
  typing,
  input,
  setInput,
  inputRef,
  scrollRef,
  onSubmit,
  placeholder,
  currentSection,
  complete,
  onGenerate,
  playbookOpen,
  winName,
}: {
  messages: ChatBubbleMsg[];
  typing: boolean;
  input: string;
  setInput: (v: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onSubmit: () => void;
  placeholder: string;
  currentSection: (typeof EWS_SECTIONS)[number] | null;
  complete: boolean;
  onGenerate: () => void;
  playbookOpen: boolean;
  winName: string;
}) {
  return (
    <div
      className="card overflow-hidden flex flex-col"
      style={{ height: "min(74vh, 720px)" }}
    >
      <div className="px-5 py-3.5 border-b border-slate2-100 bg-white flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-navy-900 text-paper flex items-center justify-center">
          <IconKnot size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-navy-900 whitespace-nowrap truncate">
              Gordian · Win Coach
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[11px] text-slate2-400 shrink-0">live</span>
          </div>
          <div className="text-[11px] text-slate2-400 truncate">
            {complete
              ? "All sections captured · ready to generate"
              : currentSection
                ? `Currently capturing — ${currentSection.label}`
                : winName
                  ? `Building "${winName}"`
                  : "Ready when you are"}
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-ivory/40"
      >
        {messages.map((m, i) => (
          <ChatBubble key={i} m={m} />
        ))}
        {typing && <ChatTyping />}
        {complete && !playbookOpen && (
          <div className="anim-in">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-navy-900 text-paper flex items-center justify-center shrink-0">
                <IconKnot size={16} />
              </div>
              <div className="bg-white border border-gold-200 rounded-2xl rounded-bl-md px-4 py-4 max-w-[88%]">
                <div className="text-sm text-navy-900 leading-relaxed">
                  All five Executive Winning System sections are captured.
                  Ready to compile your playbook?
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn-gold" onClick={onGenerate}>
                    <IconSparkle size={14} /> Generate Playbook
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate2-100 p-4 bg-white">
        <form
          className="flex gap-2 items-end"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              className="textarea pr-12"
              style={{ minHeight: 56 }}
              rows={2}
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              disabled={complete && !input}
            />
          </div>
          <button
            className="btn-primary h-[56px]"
            type="submit"
            disabled={!input.trim() || typing}
          >
            <IconSend size={14} /> Send
          </button>
        </form>
        <div className="text-[11px] text-slate2-400 mt-2 flex items-center gap-2">
          <IconLock size={11} /> Your answers stay inside Aurora Systems.
          <span className="hairline w-px h-3 inline-block" />
          <span className="kbd">↵</span> send · <span className="kbd">⇧↵</span>{" "}
          new line
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ m }: { m: ChatBubbleMsg }) {
  if (m.role === "user") {
    return (
      <div className="flex gap-3 justify-end anim-in">
        <div className="max-w-[80%]">
          <div className="bg-navy-900 text-paper rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
            {m.text}
          </div>
          <div className="text-[11px] text-slate2-400 mt-1 text-right">You</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate2-200 text-navy-900 flex items-center justify-center text-xs font-medium shrink-0">
          L
        </div>
      </div>
    );
  }

  if (m.kind === "summary") {
    return (
      <div className="flex gap-3 anim-in">
        <div className="w-8 h-8 rounded-full bg-navy-900 text-paper flex items-center justify-center shrink-0">
          <IconKnot size={16} />
        </div>
        <div className="max-w-[88%] bg-gold-50/70 border border-gold-200 rounded-2xl rounded-bl-md px-4 py-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-gold-700 mb-1.5 flex items-center gap-1.5">
            <IconCheck size={11} /> {m.sectionLabel} captured
          </div>
          <div className="text-sm text-navy-900 leading-relaxed whitespace-pre-wrap">
            {m.text}
          </div>
        </div>
      </div>
    );
  }

  if (m.kind === "transition") {
    return (
      <div className="flex gap-3 anim-in">
        <div className="w-8 h-8 rounded-full bg-navy-900 text-paper flex items-center justify-center shrink-0">
          <IconArrow size={14} />
        </div>
        <div className="max-w-[88%] bg-navy-900 text-paper rounded-2xl rounded-bl-md px-4 py-3">
          <div className="text-sm leading-relaxed">{m.text}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 anim-in">
      <div className="w-8 h-8 rounded-full bg-navy-900 text-paper flex items-center justify-center shrink-0">
        <IconKnot size={16} />
      </div>
      <div className="max-w-[88%] bg-white border border-slate2-100 rounded-2xl rounded-bl-md px-4 py-3">
        <div
          className={`text-sm leading-relaxed text-navy-900 whitespace-pre-wrap ${m.kind === "question" ? "font-medium" : ""}`}
        >
          {renderRich(m.text)}
        </div>
      </div>
    </div>
  );
}

function renderRich(text: string) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="text-gold-700">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

function ChatTyping() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-navy-900 text-paper flex items-center justify-center shrink-0">
        <IconKnot size={16} />
      </div>
      <div className="bg-white border border-slate2-100 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          <span className="w-1.5 h-1.5 rounded-full bg-slate2-400 pulse-dot" />
          <span
            className="w-1.5 h-1.5 rounded-full bg-slate2-400 pulse-dot"
            style={{ animationDelay: ".15s" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-slate2-400 pulse-dot"
            style={{ animationDelay: ".3s" }}
          />
        </div>
      </div>
    </div>
  );
}

function CapturedSoFarPanel({
  answers,
  sectionIdx,
  complete,
  questionsPerSection,
}: {
  answers: Answers;
  sectionIdx: number;
  complete: boolean;
  questionsPerSection: number;
}) {
  return (
    <div className="card p-5 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-navy-900">Captured So Far</h3>
        <span className="text-[10px] font-mono text-slate2-400 uppercase tracking-wider">
          Live
        </span>
      </div>

      {answers.winName && (
        <div className="mb-4 pb-4 border-b border-slate2-100">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate2-400 mb-1">
            Win Name
          </div>
          <div className="text-sm font-medium text-navy-900 leading-snug">
            {answers.winName}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {EWS_SECTIONS.map((s, i) => {
          const arr = answers[s.id] || [];
          const filled = arr.filter(Boolean).length;
          const total = questionsPerSection;
          const isActive = !complete && sectionIdx === i;
          const isDone = complete || sectionIdx > i;

          return (
            <div
              key={s.id}
              className={`rounded-lg p-3 -mx-1 ${isActive ? "bg-gold-50/60 border border-gold-200" : "border border-transparent"}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-mono font-medium
                    ${isDone
                      ? "bg-emerald-600 text-white"
                      : isActive
                        ? "bg-gold-400 text-navy-900"
                        : "bg-slate2-100 text-slate2-500"
                    }`}
                >
                  {isDone ? <IconCheck size={9} /> : i + 1}
                </span>
                <div
                  className={`text-xs font-medium uppercase tracking-wider
                    ${isActive ? "text-gold-700" : isDone ? "text-emerald-700" : "text-slate2-500"}`}
                >
                  {s.label}
                </div>
                <span className="ml-auto text-[10px] font-mono text-slate2-400">
                  {filled}/{total}
                </span>
              </div>
              {filled === 0 ? (
                <div className="text-xs text-slate2-400 italic pl-6">
                  No answers yet
                </div>
              ) : (
                <ul className="pl-6 space-y-1">
                  {arr.map(
                    (a, idx) =>
                      a && (
                        <li
                          key={idx}
                          className="text-xs text-slate2-700 leading-snug"
                        >
                          <span className="text-slate2-300 font-mono">·</span>{" "}
                          {shorten(a, 64)}
                        </li>
                      ),
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

