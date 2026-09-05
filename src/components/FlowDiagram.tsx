import type { TopologyId } from "../data/dossier";
import { useReducedMotion } from "./ui";

type EdgeState = "hot" | "warm" | "alt" | "dim" | "deny";

type Edge = {
  id: string;
  d: string;
  label: string;
  lx: number;
  ly: number;
  states: Record<TopologyId, EdgeState>;
  labels?: Partial<Record<TopologyId, string>>;
};

const C = {
  hot: "#4cc3e8",
  warm: "#f2b64c",
  alt: "#46d98d",
  dim: "#26374f",
  deny: "#f0685f",
};

const EDGES: Edge[] = [
  {
    id: "op",
    d: "M 148 260 L 204 260",
    label: "commands",
    lx: 150,
    ly: 248,
    states: { A: "warm", B: "warm", C: "warm" },
  },
  {
    id: "cp",
    d: "M 330 166 C 362 108 428 84 484 84",
    label: "egress via proxy",
    lx: 366,
    ly: 104,
    states: { A: "hot", B: "dim", C: "alt" },
    labels: { C: "login · warm-up" },
  },
  {
    id: "pig",
    d: "M 636 92 C 692 102 728 128 764 152",
    label: "",
    lx: 690,
    ly: 100,
    states: { A: "hot", B: "dim", C: "alt" },
  },
  {
    id: "cig",
    d: "M 416 234 C 540 236 648 220 754 210",
    label: "direct calls",
    lx: 566,
    ly: 222,
    states: { A: "warm", B: "dim", C: "dim" },
  },
  {
    id: "cv",
    d: "M 348 346 C 402 382 432 388 484 386",
    label: "license · config · sync",
    lx: 352,
    ly: 404,
    states: { A: "warm", B: "hot", C: "warm" },
    labels: { B: "credentials + commands" },
  },
  {
    id: "vig",
    d: "M 678 380 C 722 342 742 300 762 274",
    label: "bulk actions",
    lx: 668,
    ly: 340,
    states: { A: "deny", B: "hot", C: "hot" },
    labels: { C: "bulk window" },
  },
];

function Node({
  x,
  y,
  w,
  h,
  title,
  lines,
  tone = "#4cc3e8",
  active,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines: string[];
  tone?: string;
  active: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="rgba(18,28,48,0.92)"
        stroke={active ? tone : "#314463"}
        strokeWidth={active ? 1.6 : 1}
        style={{ transition: "stroke 0.4s" }}
      />
      <rect x={x} y={y} width={w} height={3} fill={active ? tone : "#314463"} opacity={0.8} style={{ transition: "fill 0.4s" }} />
      <text x={x + 12} y={y + 24} fontFamily="Chakra Petch, sans-serif" fontWeight={600} fontSize={13} fill="#e8eef8" letterSpacing="0.06em">
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={i} x={x + 12} y={y + 44 + i * 15} fontFamily="IBM Plex Mono, monospace" fontSize={9.5} fill="#94a6c2">
          {l}
        </text>
      ))}
    </g>
  );
}

export default function FlowDiagram({ topo }: { topo: TopologyId }) {
  const reduced = useReducedMotion();

  const involved = {
    operator: true,
    client: true,
    proxy: topo !== "B",
    vendor: true,
    ig: true,
  };

  return (
    <svg viewBox="0 0 960 470" className="w-full h-auto select-none" role="img" aria-label="Candidate request-flow topology diagram">
      {/* edges */}
      {EDGES.map((e) => {
        const st = e.states[topo];
        const color = C[st];
        const label = (e.labels && e.labels[topo]) || e.label;
        if (st === "deny") {
          const mx = 716;
          const my = 328;
          return (
            <g key={e.id}>
              <path d={e.d} fill="none" stroke={C.deny} strokeWidth={1.2} strokeDasharray="4 6" opacity={0.65} />
              <g stroke={C.deny} strokeWidth={2} opacity={0.9}>
                <line x1={mx - 6} y1={my - 6} x2={mx + 6} y2={my + 6} />
                <line x1={mx - 6} y1={my + 6} x2={mx + 6} y2={my - 6} />
              </g>
              <text x={mx + 14} y={my + 4} fontFamily="IBM Plex Mono, monospace" fontSize={9.5} fill={C.deny}>
                no evidence — must verify
              </text>
            </g>
          );
        }
        return (
          <g key={e.id}>
            <path
              d={e.d}
              fill="none"
              stroke={color}
              strokeWidth={st === "dim" ? 1 : 1.8}
              opacity={st === "dim" ? 0.35 : 0.9}
              className={st === "hot" || st === "alt" ? "flow-dash" : st === "warm" ? "flow-dash-slow" : ""}
              style={{ transition: "stroke 0.4s, opacity 0.4s" }}
            />
            {st !== "dim" && label && (
              <text x={e.lx} y={e.ly} fontFamily="IBM Plex Mono, monospace" fontSize={9.5} fill={color} opacity={0.95}>
                {label}
              </text>
            )}
            {(st === "hot" || st === "alt") && !reduced && (
              <circle r={3.4} fill={color}>
                <animateMotion dur={e.id === "vig" ? "1.9s" : "1.5s"} repeatCount="indefinite" path={e.d} />
              </circle>
            )}
          </g>
        );
      })}

      {/* nodes */}
      <Node x={30} y={222} w={118} h={76} title="OPERATOR" lines={["human in loop", "task config"]} tone="#e8c58a" active={involved.operator} />
      <Node
        x={206}
        y={166}
        w={210}
        h={178}
        title="CLIENT APP"
        lines={["workers · queues", "browser engine ?", "local session store", "license gate"]}
        tone="#4cc3e8"
        active={involved.client}
      />
      <Node x={486} y={52} w={150} h={66} title="PROXY POOL" lines={["per-account bind"]} tone="#46d98d" active={involved.proxy} />
      <Node
        x={486}
        y={330}
        w={192}
        h={120}
        title="VENDOR CLOUD"
        lines={["license server", "api / task queue ?", "update feed"]}
        tone="#f2b64c"
        active={involved.vendor}
      />
      <Node
        x={756}
        y={140}
        w={178}
        h={152}
        title="INSTAGRAM EDGE"
        lines={["i.instagram.com", "graph.facebook.com", "scontent cdn", "checkpoint / 2fa"]}
        tone="#4cc3e8"
        active={involved.ig}
      />
    </svg>
  );
}
