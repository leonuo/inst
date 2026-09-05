import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { StampKind } from "../data/dossier";

/* ---------------- motion preference ---------------- */

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

/* ---------------- scroll reveal ---------------- */

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("rv-in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ "--rv-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

/* ---------------- scramble / decode title ---------------- */

const GLYPHS = "▓▒░<>/#%&@=+*01";

export function Scramble({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(reduced ? text : "");
  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    let frame = 0;
    let raf = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      frame += 1;
      const reveal = Math.floor(frame / 2);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " ") {
          s += " ";
        } else if (i < reveal) {
          s += ch;
        } else {
          s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setOut(s);
      if (reveal <= text.length) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    const t = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [text, reduced, delay]);
  return (
    <span className={className} aria-label={text}>
      {out || "\u00A0"}
    </span>
  );
}

/* ---------------- confidence / status stamps ---------------- */

const STAMP_TONES: Record<StampKind, string> = {
  CONFIRMED: "#46d98d",
  HYPOTHESIS: "#f2b64c",
  REFERENCE: "#4cc3e8",
  UNKNOWN: "#94a6c2",
  BLOCKED: "#f0685f",
  "TO MAP": "#4cc3e8",
  LOCAL: "#46d98d",
  SERVER: "#f2b64c",
  HYBRID: "#4cc3e8",
  "APP-LEVEL": "#e8c58a",
  P1: "#f0685f",
  P2: "#f2b64c",
  P3: "#4cc3e8",
};

export function Stamp({ kind, dim = false }: { kind: StampKind; dim?: boolean }) {
  const c = STAMP_TONES[kind];
  return (
    <span
      className="stamp"
      style={{
        color: c,
        borderColor: dim ? "rgba(49,68,99,0.7)" : `${c}66`,
        background: dim ? "transparent" : `${c}14`,
        opacity: dim ? 0.5 : 1,
      }}
    >
      {kind}
    </span>
  );
}

/* ---------------- count-up stat ---------------- */

export function StatTile({
  label,
  value,
  text,
  accent = "#4cc3e8",
  delay = 0,
}: {
  label: string;
  value: number;
  text?: string;
  accent?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(reduced ? value : 0);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setGo(true);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!go || reduced || text) return;
    let raf = 0;
    const t0 = performance.now() + delay;
    const dur = 850;
    const step = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / dur));
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [go, reduced, value, delay, text]);
  return (
    <div ref={ref} className="panel corner-frame px-5 py-4 group hover:border-line2 transition-colors duration-300">
      <div className="tick-label mb-2">{label}</div>
      <div className="font-display text-4xl font-semibold tabular-nums" style={{ color: accent }}>
        {text ?? (
          <>
            {String(n).padStart(2, "0")}
          </>
        )}
      </div>
      <div className="mt-2 h-px w-full bg-line transition-all duration-500 group-hover:bg-line2" />
    </div>
  );
}

/* ---------------- section header ---------------- */

export function SectionHead({
  index,
  kicker,
  title,
  stamp,
  note,
}: {
  index: string;
  kicker: string;
  title: string;
  stamp?: StampKind;
  note?: string;
}) {
  return (
    <Reveal className="mb-8">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[11px] tracking-[0.28em] text-cyn">SEC {index}</span>
            <span className="h-px w-10 bg-line2" />
            <span className="tick-label">{kicker}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold leading-tight tracking-tight">
            {title}
          </h2>
          {note && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mut">{note}</p>}
        </div>
        {stamp && (
          <div className="pb-1">
            <Stamp kind={stamp} />
          </div>
        )}
      </div>
    </Reveal>
  );
}

/* ---------------- small bits ---------------- */

export function ArtifactChip({ label }: { label: string }) {
  return (
    <span className="font-mono text-[10px] tracking-wider px-1.5 py-0.5 border border-line2 text-mut bg-bg0/60">
      {label}
    </span>
  );
}

export function CouplingMeter({ level }: { level: 1 | 2 | 3 }) {
  const colors = ["#46d98d", "#f2b64c", "#f0685f"];
  const c = colors[level - 1];
  return (
    <span className="inline-flex items-center gap-1" title={`Failure coupling ${level}/3`}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: i <= level ? c : "rgba(49,68,99,0.8)" }}
        />
      ))}
    </span>
  );
}
