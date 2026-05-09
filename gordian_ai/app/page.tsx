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

type View = "home" | "dashboard" | "capture" | "ask" | "replay";
type NavFn = (v: View) => void;

export default function Page() {
  const [view, setView] = React.useState<View>("home");

  const navigate = (v: View) => {
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

  return (
    <Shell view={view} navigate={navigate}>
      <div key={view} className="anim-in">
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
    { id: "capture", label: "Capture a Win", icon: <IconPlus size={16} /> },
    { id: "ask", label: "Ask Gordian", icon: <IconChat size={16} /> },
    { id: "replay", label: "Decision Replay", icon: <IconReplay size={16} /> },
  ];
  const activeLabel = items.find((i) => i.id === view)?.label || "Home";

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
              className={`nav-item ${view === it.id ? "active" : ""}`}
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
              <span className="flex-1">Search wins, playbooks, people…</span>
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
          <div className="md:col-span-1">
            <div className="text-xs font-mono uppercase tracking-wider text-slate2-400 mb-2">
              Privacy & Security
            </div>
            <h3 className="font-serif text-2xl text-navy-900 leading-tight">
              Built for sensitive leadership knowledge.
            </h3>
          </div>
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
            <div key={b.t} className="flex gap-3">
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
  const stats = [
    { k: "Total Wins Captured", v: "12", d: "+3 this month", icon: <IconStar size={16} />, trend: "+33%" },
    { k: "Repeatable Playbooks", v: "8", d: "Across 4 teams", icon: <IconDoc size={16} />, trend: "+2" },
    { k: "Team Questions Answered", v: "47", d: "Past 30 days", icon: <IconChat size={16} />, trend: "+18" },
    { k: "Decision Confidence Increase", v: "32%", d: "Self-reported", icon: <IconTrend size={16} />, trend: "↑" },
  ];

  const wins = [
    {
      id: "WIN-012",
      t: "Client Recovery Through Fast Alignment",
      desc: "Aligned the internal team before responding externally to recover a major at-risk account.",
      tags: ["Client Success", "Leadership"],
      author: "Maya Okafor",
      ago: "2d ago",
      featured: true,
    },
    {
      id: "WIN-011",
      t: "Improving Team Handoff Process",
      desc: "Designed a 3-step handoff ritual that cut dropped tasks across engineering and ops.",
      tags: ["Operations"],
      author: "Daniel Reyes",
      ago: "5d ago",
    },
    {
      id: "WIN-010",
      t: "Closing a High-Value Partnership",
      desc: "Reframed a stalled partnership conversation around mutual upside and closed in 2 weeks.",
      tags: ["Sales", "Leadership"],
      author: "Priya Anand",
      ago: "1w ago",
    },
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
            <button className="text-xs text-slate2-500 hover:text-navy-900 flex items-center gap-1">
              View all <IconChevR size={12} />
            </button>
          </div>
          <ul>
            {wins.map((w) => (
              <li
                key={w.id}
                className="px-5 py-4 border-t border-slate2-100 first:border-t-0 hover:bg-ivory/60 transition-colors cursor-pointer group"
                onClick={() => navigate("capture")}
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
                      {w.t}
                    </h3>
                    <p className="text-sm text-slate2-500 mt-1 leading-relaxed">
                      {w.desc}
                    </p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {w.tags.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                      <span className="text-xs text-slate2-400 ml-auto">
                        {w.author} · {w.ago}
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
// Ask Gordian
// =====================================================================

type ChatMsg = { role: "user" | "assistant"; text: string; sources?: boolean };

function Ask() {
  const aiAnswer =
    "Based on a similar client recovery win, start by identifying whether the issue is truly the delay, or whether it is a communication and trust problem. Before responding externally, align the internal team, assign clear owners, and create a short recovery plan. The repeatable rule is: when trust is at risk, align internally before promising externally.";

  const [messages, setMessages] = React.useState<ChatMsg[]>([
    {
      role: "user",
      text: "How should I handle a client who is frustrated with project delays?",
    },
  ]);
  const [typing, setTyping] = React.useState(true);
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: aiAnswer, sources: true },
      ]);
      setTyping(false);
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const send = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: 'Gordian found two related wins. The closest match is "Client Recovery Through Fast Alignment." The same pattern applies — diagnose the underlying concern, align internally, then communicate one clear message.',
          sources: true,
        },
      ]);
      setTyping(false);
    }, 1100);
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
            <span className="chip chip-gold">
              <IconDoc size={11} /> Source: Client Recovery Through Fast
              Alignment
            </span>
            <span className="chip">
              <IconCheck size={11} className="text-emerald-600" /> Confidence:
              High
            </span>
            <span className="chip">
              <IconReplay size={11} /> Related playbook: Client Recovery
            </span>
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

function Replay({ navigate }: { navigate: NavFn }) {
  const options = [
    {
      id: "A",
      text: "Apologize and immediately promise a new deadline",
      why: "Promising before alignment risks repeating the same trust break.",
    },
    {
      id: "B",
      text: "Meet internally to clarify the issue, assign owners, and confirm a realistic plan",
      best: true,
      why: "Matches the original win — alignment first, then external promises.",
    },
    {
      id: "C",
      text: "Offer a discount before discussing the root problem",
      why: "Discounts treat the symptom, not the trust gap.",
    },
    {
      id: "D",
      text: "Wait until the client follows up again",
      why: "Silence often deepens churn risk in this pattern.",
    },
  ] as const;

  const [picked, setPicked] = React.useState<string | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);

  const submit = () => {
    if (!picked) return;
    setShowFeedback(true);
  };
  const reset = () => {
    setPicked(null);
    setShowFeedback(false);
  };
  const correct = picked === "B";

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1100px] mx-auto">
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
        <div className="flex gap-2">
          <span className="chip">
            Difficulty:{" "}
            <span className="text-navy-900 font-medium ml-1">Medium</span>
          </span>
          <span className="chip">
            <IconBolt size={12} className="text-gold-500" /> Based on WIN-012
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-slate2-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-navy-900 text-paper flex items-center justify-center">
                <IconReplay size={16} />
              </span>
              <div>
                <h2 className="font-medium text-navy-900">Scenario 01 of 03</h2>
                <p className="text-xs text-slate2-400">
                  Client Success · Account at risk
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`w-6 h-1 rounded-full ${i === 0 ? "bg-gold-400" : "bg-slate2-200"}`}
                />
              ))}
            </div>
          </div>

          <div className="px-6 sm:px-8 py-7">
            <p className="font-serif text-2xl text-navy-900 leading-snug">
              &quot;A client is frustrated because your team missed a milestone.
              The account lead wants to quickly promise a new deadline, but the
              operations team is unsure if that deadline is realistic.
              <br />
              <span className="text-gold-700">What should you do first?</span>
              &quot;
            </p>

            <div className="mt-7 space-y-2.5">
              {options.map((opt) => {
                const isPicked = picked === opt.id;
                const isCorrect = showFeedback && "best" in opt && opt.best;
                const isWrong =
                  showFeedback && isPicked && !("best" in opt && opt.best);
                return (
                  <button
                    key={opt.id}
                    onClick={() => !showFeedback && setPicked(opt.id)}
                    disabled={showFeedback}
                    className={`w-full text-left rounded-xl border p-4 flex items-start gap-3 transition-all
                      ${
                        isCorrect
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
                      ${
                        isCorrect
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
                <IconHelp size={12} /> Choose the action that protects trust
                first.
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
                  <button className="btn-ghost" onClick={reset}>
                    Try again
                  </button>
                  <button
                    className="btn-gold"
                    onClick={() => navigate("ask")}
                  >
                    Ask Gordian to coach me <IconArrow size={14} />
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
                  <p className="text-sm text-navy-900/80 mt-1.5 leading-relaxed">
                    In the original win, the successful leader first aligned the
                    internal team before making external promises. This
                    protected trust, reduced confusion, and created a clear
                    recovery plan.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="chip chip-gold">
                      <IconDoc size={11} /> Source: WIN-012
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
            <ul className="mt-3 space-y-3">
              {(
                [
                  ["02", "Reframing a stalled partnership", "Sales · Leadership"],
                  ["03", "Recovering after a missed handoff", "Operations"],
                ] as [string, string, string][]
              ).map(([n, t, m]) => (
                <li key={n} className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate2-400">
                    {n}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-navy-900 truncate">{t}</div>
                    <div className="text-xs text-slate2-400">{m}</div>
                  </div>
                  <IconChevR size={14} className="text-slate2-300" />
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5 knot-bg text-paper">
            <div className="text-[11px] font-mono uppercase tracking-wider text-gold-300 mb-2">
              Your streak
            </div>
            <div className="font-serif text-4xl">7 days</div>
            <p className="text-sm text-slate2-200/80 mt-2">
              5 scenarios completed · avg confidence +24%
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

function pickAck(text: string) {
  const t = (text || "").trim();
  if (!t) return "Got it.";
  const word = t.split(/\s+/)[0];
  const acks = [
    "Captured.",
    "Got it — thanks for the detail.",
    "Useful signal.",
    "Noted.",
    `"${word}…" — that's a strong starting point.`,
    "Clear.",
  ];
  return acks[Math.floor(Math.random() * acks.length)];
}

function shorten(s: string, n = 140) {
  s = (s || "").replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function makeSectionSummary(sectionIdx: number, answers: Answers) {
  const s = EWS_SECTIONS[sectionIdx];
  const arr = answers[s.id] || [];
  return arr.map((a) => (a || "").trim()).filter(Boolean);
}

type Playbook = {
  name: string;
  summaries: Record<SectionId, string[]>;
  repeatableRule: string;
  suggestedNextWin: string;
  sdj: { save: string; delete: string; join: string };
};

function buildPlaybook(answers: Answers): Playbook {
  const summaries = {
    strategy: [],
    workPlan: [],
    people: [],
    operations: [],
    results: [],
  } as Record<SectionId, string[]>;
  EWS_SECTIONS.forEach((s, i) => {
    summaries[s.id] = makeSectionSummary(i, answers);
  });
  const lastResult = (answers.results && answers.results[3]) || "";
  const repeatableRule =
    lastResult ||
    "Align the right people around a clear plan, then measure honestly.";
  return {
    name: answers.winName || "Untitled Win",
    summaries,
    repeatableRule,
    suggestedNextWin:
      "Pilot the same playbook on a parallel team or account in the next quarter.",
    sdj: {
      save: "Pre-decision alignment ritual and the named owners model.",
      delete: "Reactive external promises before the team is aligned.",
      join: "Combine with the Cross-team Handoff playbook to compound the impact.",
    },
  };
}

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
  const [messages, setMessages] = React.useState<ChatBubbleMsg[]>([]);
  const [typing, setTyping] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [complete, setComplete] = React.useState(false);
  const [playbook, setPlaybook] = React.useState<Playbook | null>(null);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const initRef = React.useRef(false);

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
        "First, what would you like to call this win?",
      ],
      "welcome",
    );
  }, [pushBot]);

  React.useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const submit = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing || complete) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);

    if (sectionIdx === -1) {
      setWinName(text);
      setAnswers((a) => ({ ...a, winName: text }));
      await pushBot(
        [
          `"${text}" — got it. Let's start with **Strategy**.`,
          EWS_SECTIONS[0].questions[0],
        ],
        "question",
      );
      setSectionIdx(0);
      setQIdx(0);
      return;
    }

    const section = EWS_SECTIONS[sectionIdx];
    const newAnswers: Answers = {
      ...answers,
      [section.id]: [...(answers[section.id] || [])],
    };
    newAnswers[section.id][qIdx] = text;
    setAnswers(newAnswers);

    const isLast = qIdx >= section.questions.length - 1;
    await new Promise((r) => setTimeout(r, 480 + Math.random() * 220));
    const ack = pickAck(text);

    if (!isLast) {
      await pushBot([ack, section.questions[qIdx + 1]], "question");
      setQIdx(qIdx + 1);
      return;
    }

    const captured = makeSectionSummary(sectionIdx, newAnswers);
    const summaryBubble = captured.map((c) => `• ${shorten(c)}`).join("\n");
    const isFinalSection = sectionIdx >= EWS_SECTIONS.length - 1;

    setTyping(true);
    await new Promise((r) => setTimeout(r, 420));
    setMessages((m) => [...m, { role: "bot", text: ack, kind: "context" }]);
    await new Promise((r) => setTimeout(r, 360));
    setMessages((m) => [
      ...m,
      {
        role: "bot",
        text: summaryBubble,
        kind: "summary",
        sectionId: section.id,
        sectionLabel: section.label,
      },
    ]);
    await new Promise((r) => setTimeout(r, 360));
    setMessages((m) => [
      ...m,
      { role: "bot", text: section.summaryLead, kind: "context" },
    ]);
    await new Promise((r) => setTimeout(r, 320));

    if (!isFinalSection) {
      const next = EWS_SECTIONS[sectionIdx + 1];
      setMessages((m) => [
        ...m,
        { role: "bot", text: section.transition, kind: "transition" },
      ]);
      await new Promise((r) => setTimeout(r, 420));
      setMessages((m) => [
        ...m,
        { role: "bot", text: next.questions[0], kind: "question" },
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
    setMessages([]);
    setComplete(false);
    setPlaybook(null);
    setInput("");
    setTimeout(() => {
      pushBot(
        [
          "Welcome to the Guided Win Builder. I'll help you turn one successful outcome into a repeatable playbook using the Executive Winning System.",
          "First, what would you like to call this win?",
        ],
        "welcome",
      );
    }, 80);
  };

  const generate = () => {
    setPlaybook(buildPlaybook(answers));
    setTimeout(() => {
      const el = document.getElementById("playbook-card");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
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
            playbookOpen={!!playbook}
            winName={winName}
          />
        </div>
        <div className="lg:col-span-1">
          <CapturedSoFarPanel
            answers={answers}
            sectionIdx={sectionIdx}
            complete={complete}
          />
        </div>
      </div>

      {playbook && (
        <div id="playbook-card" className="mt-10 anim-in">
          <PlaybookSummaryCard
            playbook={playbook}
            navigate={navigate}
            onReset={reset}
          />
        </div>
      )}
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
}: {
  states: ("done" | "active" | "upcoming")[];
  qIdx: number;
  complete: boolean;
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
                  ${
                    isActive
                      ? "bg-gold-50 border border-gold-200"
                      : isDone
                      ? "bg-emerald-50/60 border border-emerald-100"
                      : "bg-transparent border border-transparent"
                  }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-medium shrink-0
                    ${
                      isActive
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
                      ${
                        isActive
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
                    Q{qIdx + 1}/{s.questions.length}
                  </span>
                )}
              </div>
              {i < EWS_SECTIONS.length - 1 && (
                <div
                  className={`hidden sm:block h-px flex-1 min-w-[16px] ${
                    states[i] === "done" ? "bg-emerald-200" : "bg-slate2-100"
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
}: {
  answers: Answers;
  sectionIdx: number;
  complete: boolean;
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
          const total = s.questions.length;
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
                    ${
                      isDone
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

function PlaybookSummaryCard({
  playbook,
  navigate,
  onReset,
}: {
  playbook: Playbook;
  navigate: NavFn;
  onReset: () => void;
}) {
  const sections: { id: SectionId; label: string }[] = [
    { id: "strategy", label: "Strategy Summary" },
    { id: "workPlan", label: "Work Plan Summary" },
    { id: "people", label: "People Summary" },
    { id: "operations", label: "Operations Summary" },
    { id: "results", label: "Results Summary" },
  ];
  return (
    <div className="card overflow-hidden">
      <div className="p-6 sm:p-8 knot-bg text-paper">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-gold-400 pulse-dot" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-gold-300">
            Executive Winning System Playbook
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl leading-tight">
          {playbook.name}
        </h2>
        <p className="text-paper/70 text-sm mt-2">
          Compiled from your Strategy, Work Plan, People, Operations, and
          Results.
        </p>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate2-100">
        <div className="p-6 sm:p-8 space-y-5">
          {sections.map((sec, i) => (
            <div key={sec.id}>
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-gold-700 mb-2 flex items-center gap-2">
                {String(i + 1).padStart(2, "0")} · {sec.label}
                <span className="h-px flex-1 bg-gold-100" />
              </div>
              {playbook.summaries[sec.id] && playbook.summaries[sec.id].length ? (
                <ul className="space-y-1.5">
                  {playbook.summaries[sec.id].map((line, j) => (
                    <li
                      key={j}
                      className="text-navy-900 text-sm leading-relaxed flex gap-2"
                    >
                      <span className="text-gold-500 mt-1">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-slate2-400 italic">
                  — not captured —
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 sm:p-8 space-y-6 bg-ivory/50">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-gold-700 mb-2">
              Repeatable Rule
            </div>
            <p className="font-serif italic text-2xl text-navy-900 leading-snug">
              &quot;{playbook.repeatableRule}&quot;
            </p>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-slate2-500 mb-2">
              Suggested Next Win
            </div>
            <p className="text-navy-900 text-sm leading-relaxed">
              {playbook.suggestedNextWin}
            </p>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-slate2-500 mb-3">
              Save / Delete / Join Reflection
            </div>
            <div className="space-y-2.5">
              <SDJItem
                letter="S"
                label="Save"
                tone="emerald"
                text={playbook.sdj.save}
                hint="What should the organization keep from this win?"
              />
              <SDJItem
                letter="D"
                label="Delete"
                tone="red"
                text={playbook.sdj.delete}
                hint="What should the organization avoid next time?"
              />
              <SDJItem
                letter="J"
                label="Join"
                tone="gold"
                text={playbook.sdj.join}
                hint="What could be combined with another win to create future success?"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-5 bg-white border-t border-slate2-100 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate2-500 flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5">
            <IconShield size={12} /> Visible to your role group
          </span>
          <span className="hairline w-px h-3" />
          <span className="flex items-center gap-1.5">
            <IconCheck size={12} className="text-emerald-600" /> Ready to share
          </span>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={onReset}>
            <IconReplay size={14} /> Build another
          </button>
          <button className="btn-ghost" onClick={() => navigate("replay")}>
            <IconReplay size={14} /> Replay this
          </button>
          <button className="btn-gold" onClick={() => navigate("ask")}>
            Coach a teammate <IconArrow size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SDJItem({
  letter,
  label,
  tone,
  text,
  hint,
}: {
  letter: string;
  label: string;
  tone: "emerald" | "red" | "gold";
  text: string;
  hint: string;
}) {
  const toneCls = {
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    red: "bg-red-100 text-red-700 border-red-200",
    gold: "bg-gold-100 text-gold-700 border-gold-200",
  }[tone];
  return (
    <div className="flex gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono font-medium border ${toneCls} shrink-0`}
      >
        {letter}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-navy-900">
          {label} <span className="text-slate2-400 font-normal">— {hint}</span>
        </div>
        <div className="text-sm text-slate2-700 leading-relaxed mt-0.5">
          {text}
        </div>
      </div>
    </div>
  );
}
