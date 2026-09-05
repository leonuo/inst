import { useEffect, useRef, useState } from "react";
import { consoleLines } from "../data/dossier";
import { useReducedMotion } from "./ui";

const LEVEL_TONE: Record<string, string> = {
  NET: "#4cc3e8",
  CASE: "#f2b64c",
  RULE: "#f0685f",
  PLAN: "#46d98d",
  GATE: "#f2b64c",
  SYS: "#94a6c2",
};

export default function ConsoleFeed() {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? consoleLines.length : 0);
  const [started, setStarted] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reduced) return;
    if (count >= consoleLines.length) return;
    const t = window.setTimeout(() => setCount((c) => c + 1), count === 0 ? 350 : 430);
    return () => window.clearTimeout(t);
  }, [started, count, reduced]);

  useEffect(() => {
    const box = boxRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [count]);

  const done = count >= consoleLines.length;

  return (
    <div ref={wrapRef} className="panel corner-frame scanlines relative flex flex-col h-full min-h-[380px]">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red/80" />
          <span className="w-2 h-2 rounded-full bg-amb/80" />
          <span className="w-2 h-2 rounded-full bg-grn/80" />
          <span className="ml-3 font-mono text-[11px] tracking-[0.2em] text-mut">CASE-OPENING · OBSERVATION LOG</span>
        </div>
        <button
          onClick={() => {
            setCount(0);
            setStarted(true);
            if (reduced) setCount(consoleLines.length);
          }}
          className="font-mono text-[10px] tracking-widest text-faint hover:text-cyn transition-colors cursor-pointer"
          aria-label="Replay log"
        >
          ↻ REPLAY
        </button>
      </div>
      <div ref={boxRef} className="flex-1 overflow-hidden px-4 py-3 font-mono text-[11.5px] leading-[1.9]">
        {consoleLines.slice(0, count).map((l, i) => (
          <div key={i} className="flex gap-2 items-baseline">
            <span className="text-faint shrink-0">{l.ts}</span>
            <span
              className="shrink-0 w-11 text-center border px-0.5"
              style={{ color: LEVEL_TONE[l.level] ?? "#94a6c2", borderColor: `${LEVEL_TONE[l.level] ?? "#94a6c2"}55` }}
            >
              {l.level}
            </span>
            <span className="text-ink/90 break-words">{l.msg}</span>
          </div>
        ))}
        <div className="flex gap-2 items-baseline">
          <span className="text-faint">--:--:--</span>
          <span className={`text-cyn ${done ? "blink" : ""}`}>▌</span>
        </div>
      </div>
      <div className="border-t border-line px-4 py-2 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest text-faint">
          {String(Math.min(count, consoleLines.length)).padStart(2, "0")}/{consoleLines.length} EVENTS
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-amb">
          <span className="w-1.5 h-1.5 rounded-full bg-amb pulse-dot" />
          AWAITING MATERIALS
        </span>
      </div>
    </div>
  );
}
