import { useEffect, useMemo, useState } from "react";
import {
  adjudicationChecks,
  authDomains,
  confidenceLegend,
  debugPlan,
  evidenceLedger,
  featureMatrix,
  matrixFilters,
  openQuestions,
  rootCauses,
  situationStats,
  topologies,
  decisions,
  type Decision,
  type MatrixRow,
  type TopologyId,
} from "./data/dossier";
import {
  ArtifactChip,
  CouplingMeter,
  Reveal,
  Scramble,
  SectionHead,
  Stamp,
  StatTile,
} from "./components/ui";
import ConsoleFeed from "./components/ConsoleFeed";
import FlowDiagram from "./components/FlowDiagram";

const NAV = [
  { id: "sec-00", n: "00", label: "SITUATION" },
  { id: "sec-01", n: "01", label: "ARCHITECTURE" },
  { id: "sec-02", n: "02", label: "MATRIX" },
  { id: "sec-03", n: "03", label: "AUTH × LICENSING" },
  { id: "sec-04", n: "04", label: "ROOT CAUSES" },
  { id: "sec-05", n: "05", label: "DEBUG PLAN" },
  { id: "sec-06", n: "06", label: "QUESTIONS" },
];

const TONE: Record<string, string> = {
  cyn: "#4cc3e8",
  grn: "#46d98d",
  amb: "#f2b64c",
  red: "#f0685f",
  warm: "#e8c58a",
};

const today = new Date().toISOString().slice(0, 10);
const totalSteps = debugPlan.reduce((a, p) => a + p.steps.length, 0);

function DecisionCard({ d }: { d: Decision }) {
  const accent = d.id === "D-02" ? TONE.red : TONE.warm;
  return (
    <div className="panel corner-frame p-6 h-full border-l-2" style={{ borderLeftColor: accent }}>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div>
          <div className="tick-label" style={{ color: accent }}>
            {d.id} · DECISION RECORD
          </div>
          <div className="font-display font-semibold text-lg mt-1 leading-snug">{d.title}</div>
        </div>
        <Stamp kind="DECISION" />
      </div>
      <p className="text-[13px] leading-relaxed text-ink/90">{d.basis}</p>
      <div className="mt-4 flex items-center gap-2 flex-wrap font-mono text-[10.5px]">
        <span className="text-faint tracking-[0.18em]">CLOSED:</span>
        {d.closed.map((c) => (
          <span key={c} className="px-2 py-0.5 border border-line2 text-mut line-through decoration-red/70">
            {c}
          </span>
        ))}
      </div>
      <div className="mt-4 space-y-1.5">
        {d.guardrails.map((g) => (
          <div key={g} className="flex gap-2.5 text-[12px] leading-relaxed text-mut">
            <span className="font-mono text-grn shrink-0">■</span>
            <span>{g}</span>
          </div>
        ))}
      </div>
      <div className="tick-label mt-5 mb-3">DECOMMISSION CHECKLIST</div>
      <ol className="space-y-3">
        {d.checklist.map((c) => (
          <li key={c.id} className="flex items-start gap-3">
            <span className="font-mono text-[11px] w-7 shrink-0 mt-0.5" style={{ color: accent }}>
              {c.id}
            </span>
            <div className="flex-1">
              <p className="text-[12.5px] leading-relaxed text-ink/85">{c.text}</p>
              <div className="mt-1.5 flex gap-1.5 flex-wrap">
                {c.artifacts.map((a) => (
                  <ArtifactChip key={a} label={a} />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function App() {
  const [topo, setTopo] = useState<TopologyId>("A");
  const [filter, setFilter] = useState<(typeof matrixFilters)[number]>("ALL");
  const [openRC, setOpenRC] = useState<string | null>("RC-1");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [active, setActive] = useState("sec-00");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, y / h) : 0);
      let cur = "sec-00";
      for (const s of NAV) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop - 180 <= y) cur = s.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rows = useMemo<MatrixRow[]>(
    () => (filter === "ALL" ? featureMatrix : featureMatrix.filter((r) => r.exec === filter)),
    [filter]
  );

  const toggleStep = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="min-h-screen font-body text-ink">
      <div className="dossier-bg" />
      <div className="dossier-grid" />
      <div className="noise-layer" />

      {/* classification strip */}
      <div className="border-b border-line bg-bg1/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-2 flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.28em] text-faint">
          <span className="text-amb/90">▲ AUTHORIZED ANALYSIS · READ-ONLY PRESERVATION</span>
          <span className="hidden sm:block">CASE IAX-04 · SUBJECT: leonuo/InstAccountsManager</span>
          <span>REV 0.3 · D-01 + D-02 APPLIED · {today}</span>
        </div>
      </div>

      {/* sticky nav */}
      <nav className="sticky top-0 z-50 border-b border-line bg-bg0/92 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-12 flex items-center gap-5 overflow-x-auto">
          <a href="#sec-00" className="font-display font-bold text-sm tracking-[0.2em] text-cyn shrink-0">
            IAX<span className="text-faint">-</span>04
          </a>
          <span className="h-4 w-px bg-line shrink-0" />
          <div className="flex items-center gap-4 sm:gap-5 shrink-0">
            {NAV.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`nav-link font-mono text-[10.5px] tracking-[0.18em] whitespace-nowrap transition-colors ${
                  active === s.id ? "nav-active text-cyn" : "text-mut hover:text-ink"
                }`}
              >
                <span className="text-faint">{s.n}</span> {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-px bg-cyn/70" style={{ width: `${progress * 100}%` }} />
      </nav>

      <main className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* ================= SEC 00 · SITUATION ================= */}
        <section id="sec-00" className="pt-12 sm:pt-16 pb-16 scroll-mt-20">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex items-center gap-3 flex-wrap mb-6">
                  <Stamp kind="BLOCKED" />
                  <span className="font-mono text-[11px] text-mut tracking-wider">SOURCE NOT ACCESSIBLE — GITHUB 404</span>
                </div>
                <h1 className="font-display font-bold leading-[1.02] tracking-tight">
                  <span className="block text-4xl sm:text-5xl xl:text-6xl">
                    <Scramble text="InstAccounts" delay={150} />
                  </span>
                  <span className="block text-4xl sm:text-5xl xl:text-6xl text-cyn">
                    <Scramble text="Manager" delay={650} />
                  </span>
                  <span className="block mt-4 text-lg sm:text-xl font-medium text-mut tracking-normal">
                    failure investigation dossier · licensing × account operations · D-01 + D-02 applied
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-6 grid sm:grid-cols-3 gap-px bg-line border border-line font-mono text-[11px]">
                  {[
                    ["SUBJECT", "leonuo/InstAccountsManager"],
                    ["SYMPTOMS", "crash · freeze · stop · broken"],
                    ["STATUS", "D-02 applied · field data in"],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-panel px-4 py-3">
                      <div className="tick-label mb-1">{k}</div>
                      <div className={k === "STATUS" ? "text-amb" : "text-ink/90"}>{v}</div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={200}>
                <p className="mt-7 text-[15px] leading-relaxed text-mut max-w-2xl">
                  The brief asks where each Instagram operation executes, how licensing interacts with
                  running work, and why accounts stop. The first duty of this investigation is honesty about evidence:
                  the supplied repository URL resolves to a <span className="text-ink">GitHub 404</span> — the source is
                  private, renamed, deleted, or mistyped. Nothing below is invented to fill that gap.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-mut max-w-2xl">
                  What a senior pass <em className="text-ink not-italic">can</em> establish right now: the three
                  candidate execution topologies for this software class, the three-way separation of authentication
                  domains where failures leak into Instagram sessions, and a ranked register of four active
                  root-cause hypotheses — the update-driven causes are closed by D-01, the startup-banner cause by
                  D-02 — each with the exact observation that would confirm or reject it, plus a seventeen-step
                  evidence plan.
                </p>
              </Reveal>

              <Reveal delay={260}>
                <div className="mt-10">
                  <div className="tick-label mb-4 flex items-center gap-3">
                    WHAT CAN ALREADY BE ESTABLISHED <span className="h-px flex-1 bg-line" />
                  </div>
                  <div className="space-y-3">
                    {evidenceLedger.map((e) => (
                      <div
                        key={e.id}
                        className="panel corner-frame px-5 py-4 border-l-2 hover:border-line2 transition-colors group"
                        style={{ borderLeftColor: e.stamp === "CONFIRMED" ? TONE.grn : TONE.cyn }}
                      >
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-xs text-faint">{e.id}</span>
                          <Stamp kind={e.stamp} />
                          <span className="font-display font-semibold text-[15px]">{e.title}</span>
                        </div>
                        <p className="mt-2 text-[13px] leading-relaxed text-mut">{e.detail}</p>
                        <p className="mt-2 font-mono text-[10.5px] tracking-wide text-faint">↳ {e.citation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <Reveal delay={150}>
                <ConsoleFeed />
              </Reveal>
              <Reveal delay={250}>
                <div className="grid grid-cols-2 gap-4">
                  <StatTile label={situationStats[0].label} value={situationStats[0].value} accent={TONE.red} />
                  <StatTile label={situationStats[1].label} value={situationStats[1].value} accent={TONE.amb} delay={120} />
                  <StatTile label={situationStats[2].label} value={situationStats[2].value} accent={TONE.cyn} delay={240} />
                  <StatTile label={situationStats[3].label} value={0} text="LOW" accent={TONE.red} delay={360} />
                </div>
              </Reveal>
              <Reveal delay={320}>
                <div className="panel px-5 py-4 border-l-2" style={{ borderLeftColor: TONE.amb }}>
                  <div className="tick-label mb-2 text-amb/90">NEXT MOST USEFUL DIAGNOSTIC STEP</div>
                  <p className="text-[13.5px] leading-relaxed text-ink/90">
                    Obtain the source archive — or at minimum the installer plus one known-good and one known-bad
                    build — and capture client-side DNS/connection metadata during a single task. Everything else in
                    this dossier is sequenced behind those two artifacts.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================= SEC 01 · ARCHITECTURE ================= */}
        <section id="sec-01" className="py-16 border-t border-line/70 scroll-mt-20">
          <SectionHead
            index="01"
            kicker="ARCHITECTURE & REQUEST FLOW"
            title="Three candidate topologies — the evidence picks one"
            stamp="REFERENCE"
            note="Instagram account-managers converge on local automation, vendor-hosted execution, or a hybrid split. Each implies a different custody of credentials, a different failure surface, and a different fix path. Toggle a topology to re-route the flow map."
          />
          <Reveal>
            <div className="panel corner-frame p-5 sm:p-7">
              <div className="flex gap-2 flex-wrap mb-6">
                {(Object.keys(topologies) as TopologyId[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setTopo(k)}
                    className={`font-mono text-[11px] tracking-[0.16em] px-4 py-2 border transition-all duration-200 cursor-pointer ${
                      topo === k
                        ? "border-cyn text-cyn bg-cyn/10 shadow-[0_0_18px_-6px_rgba(76,195,232,0.5)]"
                        : "border-line text-mut hover:border-line2 hover:text-ink"
                    }`}
                  >
                    {topologies[k].tag} · {topologies[k].name.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="grid lg:grid-cols-[1.35fr_1fr] gap-7 items-start">
                <div>
                  <FlowDiagram topo={topo} />
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10.5px] text-mut">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-6 h-0 border-t-2 border-cyn" /> verified-candidate data path
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-6 h-0 border-t border-dashed border-amb" /> config / sync
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-6 h-0 border-t-2 border-grn" /> login & warm-up phase
                    </span>
                    <span className="flex items-center gap-2 text-red">
                      <span className="font-bold">✕</span> asserted-absent — requires proof
                    </span>
                  </div>
                </div>
                <div key={topo} className="reveal rv-in">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[11px] tracking-[0.24em] text-cyn">{topologies[topo].tag}</span>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold">{topologies[topo].name}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-mut">{topologies[topo].desc}</p>
                  <ul className="mt-4 space-y-2.5">
                    {topologies[topo].points.map((p, i) => (
                      <li key={i} className="flex gap-3 text-[13px] leading-relaxed text-ink/85">
                        <span className="text-cyn font-mono shrink-0">▸</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 border border-cyn/40 bg-cyn/5 px-4 py-3">
                    <div className="tick-label mb-1 text-cyn">ADJUDICATION RULE</div>
                    <p className="font-mono text-[11.5px] leading-relaxed text-ink/90">{topologies[topo].verdict}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-8">
              <div className="tick-label mb-4 flex items-center gap-3">
                FIVE OBSERVATIONS THAT DECIDE THE TOPOLOGY <span className="h-px flex-1 bg-line" />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {adjudicationChecks.map((c) => (
                  <div key={c.id} className="panel row-sweep px-5 py-4 flex items-start gap-4 hover:border-line2 transition-colors">
                    <span className="font-mono text-xs text-cyn shrink-0 mt-0.5">{c.id}</span>
                    <div className="flex-1">
                      <p className="text-[13px] leading-relaxed text-ink/90">{c.text}</p>
                      <div className="mt-2.5">
                        <ArtifactChip label={c.artifact} />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border border-dashed border-line2 px-5 py-4 flex items-center">
                  <p className="font-mono text-[11px] leading-relaxed text-faint">
                    Note: client→vendor traffic alone never proves vendor→Instagram traffic. Server-side execution is
                    confirmed only by absence of client egress plus task progress — or by vendor admission/docs.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ================= SEC 02 · FEATURE MATRIX ================= */}
        <section id="sec-02" className="py-16 border-t border-line/70 scroll-mt-20">
          <SectionHead
            index="02"
            kicker="FEATURE → EXECUTION MATRIX"
            title="Every feature gets a home: local, server, or hybrid"
            stamp="TO MAP"
            note="Reference scoring for this software class. Each row carries the observation that re-scores it with capture evidence — after PH-1 triage this table becomes the verified map."
          />
          <Reveal>
            <div className="flex items-center gap-2 flex-wrap mb-5">
              <span className="tick-label mr-2">FILTER · EXECUTION</span>
              {matrixFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`font-mono text-[10.5px] tracking-[0.14em] px-3 py-1.5 border transition-all cursor-pointer ${
                    filter === f
                      ? "border-cyn text-cyn bg-cyn/10"
                      : "border-line text-mut hover:border-line2 hover:text-ink"
                  }`}
                >
                  {f}
                </button>
              ))}
              <span className="ml-auto font-mono text-[10.5px] text-faint">
                {rows.length}/{featureMatrix.length} FEATURES
              </span>
            </div>
            <div className="panel corner-frame overflow-x-auto">
              <table className="w-full min-w-[980px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-line">
                    {["FEATURE", "EXECUTION", "PROTOCOL / ENDPOINTS (CANDIDATE)", "AUTH DEP", "FAILURE COUPLING", "CPL", "ADJUDICATE WITH"].map(
                      (h) => (
                        <th key={h} className="tick-label px-4 py-3.5 whitespace-nowrap">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.feature} className="row-sweep border-b border-line/60 last:border-0 hover:bg-panel2/50 transition-colors align-top">
                      <td className="px-4 py-3.5 font-display font-semibold text-[13.5px] whitespace-nowrap">{r.feature}</td>
                      <td className="px-4 py-3.5">
                        <Stamp kind={r.exec} />
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-mut max-w-[260px]">{r.protocol}</td>
                      <td className="px-4 py-3.5 text-[12px] text-mut max-w-[180px]">{r.authDep}</td>
                      <td className="px-4 py-3.5 text-[12px] text-ink/85 max-w-[240px] leading-relaxed">{r.failCoupling}</td>
                      <td className="px-4 py-3.5">
                        <CouplingMeter level={r.coupling} />
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[10.5px] text-cyn/90 max-w-[200px]">{r.adjudicate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center gap-5 flex-wrap font-mono text-[10.5px] text-faint">
              <span>CPL = failure coupling:</span>
              <span className="flex items-center gap-1.5"><CouplingMeter level={1} /> contained</span>
              <span className="flex items-center gap-1.5"><CouplingMeter level={2} /> degrades sessions</span>
              <span className="flex items-center gap-1.5"><CouplingMeter level={3} /> corrupts state / blocks app</span>
            </div>
          </Reveal>
        </section>

        {/* ================= SEC 03 · AUTH × LICENSING × SESSIONS ================= */}
        <section id="sec-03" className="py-16 border-t border-line/70 scroll-mt-20">
          <SectionHead
            index="03"
            kicker="AUTH × LICENSING × INSTAGRAM SESSIONS"
            title="Three auth domains — and the cascades that couple them"
            stamp="HYPOTHESIS"
            note="Instagram sessions are independent by design. Crashes 'after errors' almost always mean the client is coupling them: a failure killing workers that own IG session state."
          />

          <div className="space-y-4">
            {authDomains.map((d, i) => (
              <Reveal key={d.name} delay={i * 90}>
                <div className="panel corner-frame grid md:grid-cols-[260px_1fr] border-l-2" style={{ borderLeftColor: TONE[d.color] }}>
                  <div className="px-6 py-5 border-b md:border-b-0 md:border-r border-line">
                    <div className="font-mono text-[10px] tracking-[0.24em]" style={{ color: TONE[d.color] }}>
                      DOMAIN {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-display text-xl font-semibold mt-1.5">{d.name}</h3>
                    <div className="font-mono text-[11px] text-faint mt-1.5">{d.role}</div>
                  </div>
                  <div className="px-6 py-5">
                    <ul className="space-y-2">
                      {d.facts.map((f, j) => (
                        <li key={j} className="flex gap-3 text-[13px] leading-relaxed text-ink/85">
                          <span className="font-mono shrink-0" style={{ color: TONE[d.color] }}>▸</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex gap-3 items-start border border-red/30 bg-red/5 px-4 py-3">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-red shrink-0 mt-0.5">FAILURE MODE</span>
                      <p className="text-[12.5px] leading-relaxed text-ink/85">{d.failure}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8">
            <Reveal delay={110}>
              <DecisionCard d={decisions[0]} />
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <Reveal delay={140}>
              <DecisionCard d={decisions[1]} />
            </Reveal>
            <Reveal delay={170}>
              <div className="panel corner-frame px-6 py-5 border-l-2 h-full" style={{ borderLeftColor: TONE.red }}>
              <div className="tick-label mb-3 text-red/90">THE SIGNATURE CASCADE — HOW A LICENSING BUG BECOMES AN INSTAGRAM PROBLEM</div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11.5px] text-ink/90">
                {[
                  "worker heartbeat fails",
                  "worker killed mid-task",
                  "session store torn write",
                  "account appears logged out",
                  "forced re-login from new state",
                  "checkpoint storm on IG side",
                ].map((s, i, arr) => (
                  <span key={s} className="flex items-center gap-3">
                    <span className="px-2.5 py-1.5 border border-line2 bg-bg0/60">{s}</span>
                    {i < arr.length - 1 && <span className="text-red">→</span>}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[12.5px] text-mut leading-relaxed max-w-3xl">
                Users report the last step and blame Instagram. The defect lives in steps two and three — RC-1 below
                targets exactly that boundary, and the repro in the debug plan isolates it within an hour once
                materials arrive. The update-driven variants (RC-2/6/7) no longer apply: the update subsystem is
                removed by D-01.
              </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= SEC 04 · ROOT CAUSES ================= */}
        <section id="sec-04" className="py-16 border-t border-line/70 scroll-mt-20">
          <SectionHead
            index="04"
            kicker="ROOT-CAUSE REGISTRY"
            title="Four active hypotheses — each falsifiable by design"
            stamp="HYPOTHESIS"
            note="Ranked by prevalence in this software class and fit to the reported symptom cluster (crash · freeze · unexpected stop · broken feature after licensing events). Update-driven RC-2/6/7 are closed by D-01; the startup-banner cause RC-8 is closed by D-02. A hypothesis is only useful if it states what would kill it."
          />
          <div className="space-y-3">
            {rootCauses.map((rc, i) => {
              const open = openRC === rc.id;
              const pTone = rc.priority === "P1" ? TONE.red : rc.priority === "P2" ? TONE.amb : TONE.cyn;
              return (
                <Reveal key={rc.id} delay={i * 60}>
                  <div className={`panel corner-frame transition-colors ${open ? "border-line2" : "hover:border-line2"}`}>
                    <button
                      onClick={() => setOpenRC(open ? null : rc.id)}
                      className="w-full flex items-center gap-4 px-5 sm:px-6 py-4 text-left cursor-pointer group"
                      aria-expanded={open}
                    >
                      <span className="font-mono text-xs shrink-0" style={{ color: pTone }}>
                        {rc.id}
                      </span>
                      <Stamp kind={rc.priority} />
                      <span className="font-display font-semibold text-[15px] sm:text-base flex-1 leading-snug">
                        {rc.title}
                      </span>
                      <span
                        className={`font-mono text-cyn transition-transform duration-300 shrink-0 ${open ? "rotate-45" : ""}`}
                      >
                        +
                      </span>
                    </button>
                    <div className={`acc-body ${open ? "open" : ""}`}>
                      <div className="acc-inner">
                        <div className="px-5 sm:px-6 pb-6 pt-1 grid md:grid-cols-2 gap-x-8 gap-y-5 border-t border-line/70">
                          {[
                            ["REPORTED SYMPTOM", rc.symptom, TONE.warm],
                            ["SUSPECTED MECHANISM", rc.mechanism, TONE.cyn],
                            ["EVIDENCE THAT CONFIRMS", rc.confirm, TONE.grn],
                            ["EVIDENCE THAT REJECTS", rc.reject, TONE.red],
                            ["REPRODUCIBLE TEST", rc.repro, TONE.amb],
                            ["LEGITIMATE FIX DIRECTION", rc.fix, TONE.grn],
                          ].map(([label, body, tone]) => (
                            <div key={label as string}>
                              <div className="tick-label mb-1.5" style={{ color: tone as string }}>
                                {label as string}
                              </div>
                              <p className="text-[13px] leading-relaxed text-ink/85">{body as string}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={140}>
            <div
              className="mt-5 panel px-5 py-4 flex flex-col gap-3 border-l-2"
              style={{ borderLeftColor: TONE.warm }}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <Stamp kind="DECISION" />
                <span className="font-mono text-[11px] text-mut leading-relaxed">
                  <span className="text-faint tracking-[0.18em]">RETIRED BY D-01 · </span>
                  {["RC-2 update resets session store", "RC-6 post-update proxy regression", "RC-7 update alters HWID"].map(
                    (c) => (
                      <span key={c} className="line-through decoration-red/70 text-mut/80 mr-4">
                        {c}
                      </span>
                    )
                  )}
                </span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <Stamp kind="DECISION" />
                <span className="font-mono text-[11px] text-mut leading-relaxed">
                  <span className="text-faint tracking-[0.18em]">RETIRED BY D-02 · </span>
                  <span className="line-through decoration-red/70 text-mut/80 mr-4">
                    RC-8 startup banner blocks initialization
                  </span>
                  <span className="text-mut">— triggers removed, IDs kept for traceability</span>
                </span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ================= SEC 05 · DEBUG PLAN ================= */}
        <section id="sec-05" className="py-16 border-t border-line/70 scroll-mt-20">
          <SectionHead
            index="05"
            kicker="DEBUGGING PLAN — EVIDENCE FIRST"
            title="Seventeen steps that convert hypotheses into verdicts"
            stamp="CONFIRMED"
            note="The plan is valid today, with or without source. Tick artifacts off as they land; phase gates keep the investigation honest — no fix before a verdict."
          />
          <Reveal>
            <div className="panel px-6 py-4 mb-6 flex items-center gap-5 flex-wrap">
              <div className="flex-1 min-w-[220px]">
                <div className="flex justify-between mb-2 font-mono text-[10.5px] tracking-[0.18em] text-mut">
                  <span>EVIDENCE STAGED</span>
                  <span className="text-cyn">
                    {done.size} / {totalSteps} STEPS
                  </span>
                </div>
                <div className="h-1.5 bg-bg0 border border-line overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyn to-grn transition-all duration-500"
                    style={{ width: `${(done.size / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => setDone(new Set())}
                className="font-mono text-[10px] tracking-widest text-faint hover:text-red transition-colors cursor-pointer"
              >
                ✕ RESET
              </button>
            </div>
          </Reveal>
          <div className="space-y-5">
            {debugPlan.map((ph, pi) => (
              <Reveal key={ph.id} delay={pi * 70}>
                <div className="panel corner-frame p-6">
                  <div className="flex items-baseline gap-4 flex-wrap mb-1">
                    <span className="font-mono text-xs text-cyn">{ph.id}</span>
                    <h3 className="font-display text-lg font-semibold tracking-wide">{ph.name}</h3>
                    <span className="font-mono text-[10px] text-faint ml-auto">
                      {ph.steps.filter((s) => done.has(s.id)).length}/{ph.steps.length} DONE
                    </span>
                  </div>
                  <p className="text-[12.5px] text-mut mb-5">{ph.goal}</p>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                    {ph.steps.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-start gap-3.5 py-2 px-3 -mx-3 hover:bg-panel2/50 transition-colors cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          className="dbg-check mt-0.5"
                          checked={done.has(s.id)}
                          onChange={() => toggleStep(s.id)}
                        />
                        <span className="flex-1">
                          <span className={`block text-[13px] leading-relaxed transition-colors ${done.has(s.id) ? "check-done" : "text-ink/90"}`}>
                            <span className="font-mono text-[10.5px] text-faint mr-2">{s.id}</span>
                            {s.text}
                          </span>
                          <span className="mt-1.5 flex gap-1.5 flex-wrap">
                            {s.artifacts.map((a) => (
                              <ArtifactChip key={a} label={a} />
                            ))}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= SEC 06 · QUESTIONS ================= */}
        <section id="sec-06" className="py-16 border-t border-line/70 scroll-mt-20">
          <SectionHead
            index="06"
            kicker="OPEN QUESTIONS → REQUESTER"
            title="Eight questions that unblock the case"
            stamp="UNKNOWN"
            note="Asked only because the missing information prevents meaningful progress — each maps to a phase gate in SEC 05."
          />
          <div className="space-y-3">
            {openQuestions.map((q, i) => (
              <Reveal key={i} delay={i * 55}>
                <div
                  className={`panel px-6 py-4 flex gap-5 items-start transition-all duration-300 hover:translate-x-1 ${
                    i === 0 ? "border-amb/50 border-l-2" : "border-l-2 border-l-line2 hover:border-l-cyn"
                  }`}
                  style={i === 0 ? { borderLeftColor: TONE.amb } : undefined}
                >
                  <span className={`font-display font-bold text-xl shrink-0 ${i === 0 ? "text-amb" : "text-faint"}`}>
                    Q{String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    {i === 0 && (
                      <div className="font-mono text-[10px] tracking-[0.24em] text-amb mb-1.5">THE SINGLE HIGHEST-VALUE UNBLOCK</div>
                    )}
                    <p className={`text-[13.5px] leading-relaxed ${i === 0 ? "text-ink" : "text-mut"}`}>{q}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-line mt-8 bg-bg1/60">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid md:grid-cols-3 gap-10">
          <div>
            <div className="tick-label mb-4">CONFIDENCE VOCABULARY</div>
            <div className="space-y-3">
              {confidenceLegend.map((l) => (
                <div key={l.kind} className="flex items-center gap-3">
                  <Stamp kind={l.kind} />
                  <span className="text-[12px] text-mut">{l.meaning}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="tick-label mb-4">METHOD</div>
            <ul className="space-y-2.5">
              {[
                "Read-only inspection first; originals preserved and hashed",
                "Sanitized network metadata only — no passwords, cookies, tokens or keys in this report",
                "Test accounts and sandbox copies for every reproduction",
                "Every claim cites a file, capture, log line — or is labeled",
                "Confirmed · likely · unknown are never mixed in one sentence",
              ].map((m) => (
                <li key={m} className="flex gap-3 text-[12.5px] text-mut leading-relaxed">
                  <span className="text-cyn font-mono shrink-0">▸</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="tick-label mb-4">SCOPE & ETHICS</div>
            <p className="text-[12.5px] text-mut leading-relaxed">
              This dossier supports authorized debugging of a product. It proposes no bypass of
              authentication or licensing controls — fixes target transactional state handling, migrations, backoff
              and observability. Instagram-side testing uses test accounts only, and class-level references are never
              presented as findings from the subject codebase.
            </p>
            <div className="mt-5 flex items-center gap-2 font-mono text-[10.5px] text-faint">
              <span className="w-1.5 h-1.5 rounded-full bg-grn pulse-dot" />
              CASE OPEN · GATED ON PH-0 MATERIALS
            </div>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.22em] text-faint">
            <span>IAX-04 · COMPILED {today}</span>
            <span className="hidden sm:block">EVERY CODE-LEVEL CLAIM REMAINS LABELED UNTIL SOURCE IS PROVIDED</span>
            <span>▚ END OF DOSSIER</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
