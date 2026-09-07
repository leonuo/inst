/* ============================================================
   CASE IAX-04 · InstAccountsManager — investigation dossier data
   Confidence vocabulary: CONFIRMED · HYPOTHESIS · REFERENCE · UNKNOWN
   ============================================================ */

export type StampKind =
  | "CONFIRMED"
  | "HYPOTHESIS"
  | "REFERENCE"
  | "UNKNOWN"
  | "BLOCKED"
  | "TO MAP"
  | "LOCAL"
  | "SERVER"
  | "HYBRID"
  | "APP-LEVEL"
  | "P1"
  | "P2"
  | "P3"
  | "DECISION";

/* ---------- Section 00 · situation / evidence ledger ---------- */

export const evidenceLedger = [
  {
    id: "C-01",
    stamp: "CONFIRMED" as StampKind,
    title: "Public source does not exist at the supplied URL",
    detail:
      "GET github.com/leonuo/InstAccountsManager returned GitHub's 404 page (\"Page not found\"); the REST API returned {\"message\":\"Not Found\"}. The repository is private, renamed, deleted, or the URL is incorrect.",
    citation: "Observed live · HTML 404 + API 404 · case opening",
  },
  {
    id: "C-02",
    stamp: "CONFIRMED" as StampKind,
    title: "Zero code-level facts can be cited from this codebase today",
    detail:
      "No README, source tree, releases, issues or commit history are reachable. Any statement about this application's specific endpoints, storage format or workers is therefore a hypothesis until materials are provided.",
    citation: "Enumeration attempt · api.github.com tree endpoint · rate-limited/404",
  },
  {
    id: "C-03",
    stamp: "CONFIRMED" as StampKind,
    title: "Failure reports are second-hand and undated",
    detail:
      "The brief reports crashes, freezes, unexpected stops and broken features correlated with updates and licensing — but no logs, stack traces, versions, timestamps or crash dumps accompanied the request.",
    citation: "Request brief · no artifacts attached",
  },
  {
    id: "C-04",
    stamp: "REFERENCE" as StampKind,
    title: "A reference model for this software class is available",
    detail:
      "Instagram account-managers converge on three execution topologies (local automation, vendor-hosted, hybrid). The dossier below maps that model and states exactly what evidence adjudicates each branch.",
    citation: "Class-level knowledge · explicitly not findings from this repo",
  },
  {
    id: "C-05",
    stamp: "CONFIRMED" as StampKind,
    title: "Operator field test: freezes were update-driven; the startup banner now breaks launch",
    detail:
      "Post-D-01 field report: hangs are gone — the freezes correlated with the service update cycle, so D-01 is validated in production. New confirmed symptom: a banner appears at startup and breaks the whole system and build. First direct evidence in this case; the banner subsystem is removed by decision D-02.",
    citation: "Operator field report · post-D-01 test",
  },
];

export const situationStats = [
  { label: "Public files inventoried", value: 0, suffix: "" },
  { label: "Active hypotheses", value: 2, suffix: "" },
  { label: "Root causes closed by decisions", value: 6, suffix: "" },
  { label: "Case confidence", value: 0, suffix: "", text: "RISING" },
];

export const consoleLines = [
  { ts: "09:14:02Z", level: "NET", msg: "GET github.com/leonuo/InstAccountsManager → 404 · HTML \"Page not found\"" },
  { ts: "09:14:03Z", level: "NET", msg: "GET api.github.com/repos/leonuo/InstAccountsManager → 404 {\"message\":\"Not Found\"}" },
  { ts: "09:14:05Z", level: "NET", msg: "GET api.github.com/.../git/trees/main?recursive=1 → unreachable (429 upstream) · branch enumeration blocked" },
  { ts: "09:14:06Z", level: "CASE", msg: "Source availability: NONE at supplied URL → repo is private / renamed / deleted / mistyped" },
  { ts: "09:14:06Z", level: "RULE", msg: "Directive applied: do not invent code-level findings → all internals labeled HYPOTHESIS" },
  { ts: "09:14:07Z", level: "PLAN", msg: "Loading class-level reference model: 3 execution topologies × 3 auth domains" },
  { ts: "09:14:07Z", level: "PLAN", msg: "Registering 7 ranked root-cause hypotheses for symptom cluster [crash · freeze · stop · broken feature]" },
  { ts: "09:41:12Z", level: "CASE", msg: "Operator decision D-01 received: auto-update subsystem broke the system repeatedly → decommission it entirely" },
  { ts: "09:41:12Z", level: "PLAN", msg: "Applying D-01: RC-2 / RC-6 / RC-7 closed · registry reduced to 4 active hypotheses · dossier REV 0.2" },
  { ts: "10:02:47Z", level: "CASE", msg: "Operator field test: hangs gone — freezes correlated with the service update cycle → D-01 validated in production" },
  { ts: "10:02:48Z", level: "CASE", msg: "New confirmed symptom: startup banner breaks the whole system and build at launch → operator decision D-02: remove the banner subsystem" },
  { ts: "10:02:49Z", level: "PLAN", msg: "Applying D-02: RC-8 (banner blocks initialization) registered and closed · startup must land directly on workspace · dossier REV 0.3" },
  { ts: "09:14:08Z", level: "GATE", msg: "Case gated on materials: source archive OR installer+versions, sanitized logs, dated failure samples" },
  { ts: "09:14:08Z", level: "SYS", msg: "Dossier compiled · awaiting operator input ▌" },
];

/* ---------- Section 01 · topologies & adjudication ---------- */

export type TopologyId = "A" | "B" | "C";

export const topologies: Record<
  TopologyId,
  {
    name: string;
    tag: string;
    desc: string;
    points: string[];
    verdict: string;
  }
> = {
  A: {
    name: "Local automation client",
    tag: "TOPOLOGY A",
    desc: "All Instagram operations execute on the operator's machine. The client embeds a browser engine or calls IG private endpoints directly; the vendor server (if any) only serves licensing and config — update distribution removed by D-01.",
    points: [
      "Egress to i.instagram.com / scontent CDNs originates from the client host (via configured proxies)",
      "Typical engines: CEF, WebView2, Electron, Playwright/WebDriver, or raw HTTP with app-signature emulation",
      "Session data (cookies, device state) persisted locally — sqlite / leveldb / JSON under AppData",
      "Vendor compromise exposes billing, not sessions — unless the client also phones home with cookies",
    ],
    verdict: "Falsify by capture: if the client host never resolves i.instagram.com during a task, A is dead.",
  },
  B: {
    name: "Vendor-hosted execution",
    tag: "TOPOLOGY B",
    desc: "The desktop app is a control panel. Credentials or cookies are uploaded and vendor-side workers perform actions from vendor infrastructure; the app never touches IG edge directly.",
    points: [
      "Only vendor API hosts appear in client DNS/connections during task execution",
      "Credentials or session cookies transit to vendor → custodial risk; check TLS pinning & payload fields",
      "\"Account stopped\" reports often map to vendor queue backlogs rather than local bugs",
    ],
    verdict: "Confirm by capture: zero client→IG traffic plus task progress continuing → execution is server-side.",
  },
  C: {
    name: "Hybrid split",
    tag: "TOPOLOGY C",
    desc: "Login, warm-up and challenge solving run locally (where a real browser fingerprint helps); bulk or scheduled actions execute vendor-side. State syncs both directions.",
    points: [
      "Client→IG bursts at login/challenge; vendor→IG steady traffic during bulk windows",
      "Cookie/session sync endpoint is the highest-value target for the evidence capture",
      "Inconsistent state bugs cluster at the sync boundary",
      "With the updater removed (D-01), client↔server contract skew must be managed via the out-of-band config feed",
    ],
    verdict: "Adjudicate by phase: tag every connection with the app phase active when it fired.",
  },
};

export const adjudicationChecks = [
  { id: "AJ-1", text: "Capture DNS + connection metadata on the client host while a task runs. Which of {vendor API, i.instagram.com, graph.facebook.com, CDN scontent} appear?", artifact: "PCAP / DNSLOG" },
  { id: "AJ-2", text: "Inventory the install directory for engine artifacts: cef*.dll, electron.asar, chromedriver, WebView2 loader, or HTTP-only binaries.", artifact: "FILELIST" },
  { id: "AJ-3", text: "Watch the app-data directory during login: where do sessionid / ds_user_id cookies land (local file/DB vs. request body to vendor)?", artifact: "FSMON" },
  { id: "AJ-4", text: "Run strings/resource inspection of the binary for endpoint literals, app-id constants, user-agent pins and vendor hosts.", artifact: "STRINGS" },
  { id: "AJ-5", text: "Block the vendor host at the OS level and observe: do IG actions continue (→ A), stop immediately (→ B), or degrade per-phase (→ C)?", artifact: "HOSTBLOCK" },
];

/* ---------- Section 02 · feature matrix (reference model) ---------- */

export type MatrixRow = {
  feature: string;
  exec: "LOCAL" | "SERVER" | "HYBRID" | "APP-LEVEL";
  protocol: string;
  authDep: string;
  failCoupling: string;
  adjudicate: string;
  coupling: 1 | 2 | 3;
};

export const featureMatrix: MatrixRow[] = [
  {
    feature: "Account login & challenges",
    exec: "LOCAL",
    protocol: "i.instagram.com /api/v1/login · launcher · si_fetch_headers (candidate)",
    authDep: "IG credentials · 2FA / checkpoint solving",
    failCoupling: "Stale client fingerprint after IG rollout → mass checkpoints mistaken for app bugs",
    adjudicate: "Client→IG traffic at login? (AJ-1)",
    coupling: 3,
  },
  {
    feature: "Session persistence & renewal",
    exec: "LOCAL",
    protocol: "Cookie jar: sessionid, ds_user_id · device appstate file (candidate)",
    authDep: "Local disk · optional DPAPI/keychain",
    failCoupling: "Unclean worker exit corrupts the store → forced re-login wave (update vector removed by D-01)",
    adjudicate: "FSMON on appdata across restarts (AJ-3)",
    coupling: 3,
  },
  {
    feature: "Bulk follow / unfollow / like",
    exec: "HYBRID",
    protocol: "Private action endpoints, per-account pacing (candidate)",
    authDep: "Valid IG session · proxy per account",
    failCoupling: "Worker interruption mid-batch → partial state",
    adjudicate: "Egress origin during task (AJ-1/AJ-5)",
    coupling: 3,
  },
  {
    feature: "DM automation",
    exec: "HYBRID",
    protocol: "direct_v2 family (candidate) · highest restriction risk",
    authDep: "Warm session · aged account",
    failCoupling: "IG soft-bans surface as silent \"feature stopped working\"",
    adjudicate: "Response codes 429/400 in capture",
    coupling: 2,
  },
  {
    feature: "Post / story upload",
    exec: "LOCAL",
    protocol: "rupload_igphoto / rupload_igvideo (candidate)",
    authDep: "Session + media pipeline",
    failCoupling: "IG-side endpoint drift breaks uploads silently — patch via config feed, not releases (D-01)",
    adjudicate: "Capture during one upload",
    coupling: 2,
  },
  {
    feature: "Analytics / insights",
    exec: "SERVER",
    protocol: "Vendor aggregation API or IG Graph (official) — to determine",
    authDep: "Vendor token (and possibly FB token)",
    failCoupling: "Vendor API version bump → empty charts without errors",
    adjudicate: "graph.facebook.com in capture? (AJ-1)",
    coupling: 1,
  },

  {
    feature: "Proxy & isolation management",
    exec: "LOCAL",
    protocol: "SOCKS5/HTTP per account profile (candidate)",
    authDep: "Per-profile proxy credentials",
    failCoupling: "Rotation leak → cross-contamination → account-level stops",
    adjudicate: "Per-account egress IP log",
    coupling: 2,
  },
];

export const matrixFilters = ["ALL", "LOCAL", "SERVER", "HYBRID", "APP-LEVEL"] as const;

/* ---------- Section 03 · Instagram session, decision D-01 ---------- */

export const authDomains = [
  {
    name: "Instagram session",
    color: "grn" as const,
    role: "Client (or vendor) ↔ IG",
    facts: [
      "Cookie-based (sessionid / ds_user_id), device-bound, challengeable at any time",
      "Persistence target (local store vs vendor vault) is the single most important custody fact — see AJ-3",
      "Challenges (checkpoint, 2FA, email code) require interactive solving; unattended workers must queue them",
    ],
    failure: "Forced app termination during a checkpoint flow can leave the session half-validated — the classic \"account lost\" after a crash.",
  },
];

export type Decision = {
  id: string;
  title: string;
  basis: string;
  closed: string[];
  guardrails: string[];
  checklist: { id: string; text: string; artifacts: string[] }[];
};

export const decisions: Decision[] = [
  {
    id: "D-01",
    title: "Auto-update subsystem — removed",
    basis:
      "Operator decision on REV 0.1: updates proved to be the dominant regression vector (former RC-2, RC-6, RC-7) and the forced-update cycle kept breaking a working system. The subsystem is decommissioned outright: the build is frozen, distribution goes manual, and drift fixes move to a config feed. Field-validated in the post-D-01 test — hangs are gone.",
    closed: ["RC-2", "RC-6", "RC-7"],
    guardrails: [
      "Instagram session handling and per-account proxy isolation are out of scope and unchanged",
      "IG fingerprint / endpoint drift is patched out-of-band via the config feed, never through a full release (RC-3)",
    ],
    checklist: [
      { id: "D1", text: "Freeze the current stable build as the baseline; archive it with SHA-256 next to every prior build for rollback.", artifacts: ["HASHES", "ARCHIVE"] },
      { id: "D2", text: "Remove the update-check loop and patcher/updater module from the build; without source access, block the update-feed host at network level as the interim control.", artifacts: ["BUILD", "HOSTBLOCK"] },
      { id: "D3", text: "Snapshot appdata read-only before the change; verify the session store stays byte-stable across restarts afterward.", artifacts: ["APPDATA", "DIFF"] },
      { id: "D4", text: "24h soak: zero traffic to the update feed after the change.", artifacts: ["PCAP"] },
      { id: "D5", text: "Move IG app-version / user-agent / endpoint pins into a versioned config feed with an N-1 acceptance window.", artifacts: ["PATCH", "TESTS"] },
    ],
  },
  {
    id: "D-02",
    title: "Startup banner subsystem — removed",
    basis:
      "Operator field test on REV 0.2: the banner that appears at launch breaks the whole system and the build — the app is unusable from the first second. The freezes are already resolved by D-01; the remaining launch-time blocker is the banner itself, so it is decommissioned outright: no announcement, changelog or onboarding modal at startup — the app lands directly on the workspace.",
    closed: ["RC-8"],
    guardrails: [
      "2FA / checkpoint dialogs stay — they are functional gates, not banners; only the startup announcement layer is removed",
      "If the banner doubled as the vendor's changelog or legal-notice channel, that content moves out-of-band (docs site or config feed)",
      "IG session handling and proxy isolation are out of scope and unchanged",
    ],
    checklist: [
      { id: "B1", text: "Locate the banner subsystem in the frozen build: strings/resources for the banner host, markup or remote-template loader, and its call site in the startup path.", artifacts: ["STRINGS", "FILELIST"] },
      { id: "B2", text: "Remove the banner module or its startup invocation; without source access, block the banner/announcement host at network level as the interim control.", artifacts: ["BUILD", "HOSTBLOCK"] },
      { id: "B3", text: "Cold-start verification: launch must land on the workspace with no modal, no focus trap, and no blocking network fetch on the UI thread.", artifacts: ["COLDSTART", "THREADDUMP"] },
      { id: "B4", text: "Regression pass: 2FA / checkpoint dialogs and worker startup still function with the banner gone.", artifacts: ["TESTS"] },
      { id: "B5", text: "24h soak across restarts: zero banner-host traffic; startup time before/after is the acceptance metric.", artifacts: ["PCAP"] },
    ],
  },
];

/* ---------- Section 04 · root-cause registry ---------- */

export type RootCause = {
  id: string;
  priority: "P1" | "P2" | "P3";
  title: string;
  symptom: string;
  mechanism: string;
  confirm: string;
  reject: string;
  repro: string;
  fix: string;
};

export const rootCauses: RootCause[] = [
  {
    id: "RC-3",
    priority: "P1",
    title: "Stale Instagram client fingerprint pinned in an old (or new) build",
    symptom: "Everything \"suddenly\" fails across all accounts; looks like an app crash loop but is IG-side rejection.",
    mechanism:
      "The build pins an IG app version / user-agent / app-id. When IG rolls out, pinned values trigger 400s, checkpoint_required, or consent walls. Retry loops then amplify into apparent freezes (feeds RC-5).",
    confirm:
      "Capture shows uniform checkpoint_required / 400 responses tied to a specific user-agent/app-id; identical behavior across unrelated accounts and proxies.",
    reject:
      "Capture shows healthy 200s for the same endpoints; failures correlate with vendor events instead of IG responses.",
    repro:
      "On a test account, replay one failing operation through a capture proxy; compare response bodies to a known-good baseline build.",
    fix:
      "Ship fingerprint updates out-of-band (config feed) rather than full releases; add response-class aware backoff; surface IG challenge states distinctly from app errors.",
  },

  {
    id: "RC-5",
    priority: "P2",
    title: "Unbounded retry loop on vendor API / IG transients",
    symptom: "\"Freeze\" with high CPU or fan noise; progress stuck at N%; sometimes recovers after minutes.",
    mechanism:
      "Transient 5xx from the vendor API (or 429 from IG) meets a retry loop without exponential backoff or jitter — or a while(true) reconnect. The app is not frozen; it is spinning. Memory climbs if each retry allocates.",
    confirm:
      "Capture shows the same request every few hundred ms with identical failure; CPU sampling attributes time to the retry path; heap growth per cycle.",
    reject:
      "Retries show backoff spacing and a cap; stall correlates with a single long-timeout blocking call instead.",
    repro:
      "Rate-limit or 503-inject the vendor endpoint via a local intercepting proxy against a sandbox copy; watch request cadence and CPU.",
    fix:
      "Exponential backoff + jitter + attempt cap + circuit breaker; fail the task loudly instead of silently spinning.",
  },
];

/* RC-2 (update migrates/resets the session store), RC-6 (post-update proxy
   isolation regression) and RC-7 (update alters device fingerprint) were
   closed by decision D-01: the auto-update subsystem is removed, so their
   trigger no longer exists. RC-8 (startup banner blocks initialization —
   remote-fetched announcement modal on the UI thread / focus trap before
   the main loop is ready; symptom confirmed by the operator field test)
   was registered and immediately closed by decision D-02: the banner
   subsystem is removed. Original IDs are kept retired for traceability. */

/* ---------- Section 05 · debugging plan ---------- */

export type PlanStep = { id: string; text: string; artifacts: string[] };
export type PlanPhase = { id: string; name: string; goal: string; steps: PlanStep[] };

export const debugPlan: PlanPhase[] = [
  {
    id: "PH-0",
    name: "Access & preservation",
    goal: "Unblock the case: get authorized materials and preserve originals read-only.",
    steps: [
      { id: "S-01", text: "Obtain authorized access: private-repo read grant or source archive at the exact working and broken commits; record hashes.", artifacts: ["SOURCE", "HASHES"] },
      { id: "S-02", text: "Collect the installer + installed binary of the build being frozen as the baseline, plus the last known-bad build for comparison.", artifacts: ["BIN-GOOD", "BIN-BAD"] },
      { id: "S-03", text: "Snapshot the appdata directory (config, DB, session store) read-only, redacting cookies/tokens/keys before analysis.", artifacts: ["APPDATA", "REDACTED"] },
      { id: "S-04", text: "Gather dated failure samples: app logs, crash dumps, vendor support thread, screenshots with clock visible.", artifacts: ["LOGS", "DUMPS"] },
    ],
  },
  {
    id: "PH-1",
    name: "Passive triage",
    goal: "Establish who talks to whom without changing anything.",
    steps: [
      { id: "S-05", text: "Capture DNS + connection metadata during login and one task; classify hosts: vendor / IG-edge / Graph / CDN (AJ-1).", artifacts: ["PCAP", "DNSLOG"] },
      { id: "S-06", text: "Filesystem monitor on appdata during login/task/restart: locate session persistence files (AJ-3).", artifacts: ["FSMON"] },
      { id: "S-07", text: "At the next freeze, capture thread stacks (ProcDump or platform equivalent) before killing the process.", artifacts: ["THREADDUMP"] },
      { id: "S-08", text: "Static pass on binaries: strings for endpoint literals, app-id/UA pins, engine artifacts (CEF/Electron/WebDriver) (AJ-2/4).", artifacts: ["STRINGS"] },
    ],
  },
  {
    id: "PH-2",
    name: "Controlled reproduction",
    goal: "Recreate each symptom in a sandbox with test accounts only.",
    steps: [

      { id: "S-10", text: "Freeze drill (D-01) + cold-start check (D-02): disable the update and banner hosts on a sandbox copy, run a long task, verify zero traffic to either host, byte-stable appdata across restarts, and launch landing directly on the workspace.", artifacts: ["HOSTBLOCK", "DIFF", "COLDSTART"] },
      { id: "S-11", text: "IG-rejection probe: replay one failing action via intercepting proxy; record response class per build (RC-3).", artifacts: ["MITM-CAPTURE"] },
      { id: "S-12", text: "Isolation probe: two profiles × two proxies, identical actions, compare per-profile egress IPs before/after the freeze (egress audit per D-01).", artifacts: ["EGRESSLOG"] },
    ],
  },
  {
    id: "PH-3",
    name: "Adjudication",
    goal: "Promote or reject every hypothesis with recorded evidence.",
    steps: [
      { id: "S-13", text: "For active RC-3/5: file the confirm/reject evidence, set confidence to CONFIRMED / REJECTED / STILL-UNKNOWN; record RC-2/6/7 as closed by D-01.", artifacts: ["VERDICTS"] },
      { id: "S-14", text: "Produce the final request-flow map with verified edges only; mark residual unknowns explicitly.", artifacts: ["FLOWMAP-V2"] },
    ],
  },
  {
    id: "PH-4",
    name: "Legitimate remediation",
    goal: "Fix defects without touching auth controls.",
    steps: [
      { id: "S-15", text: "Transactional worker stop at task boundaries; WAL/journal recovery; challenge queueing.", artifacts: ["PATCH"] },
      { id: "S-16", text: "Strip the updater and the banner: remove the update-check loop, patcher and startup-banner module from the build, block both hosts; fingerprint values move to the config feed (RC-3 · D-01/D-02).", artifacts: ["BUILD", "PATCH"] },
      { id: "S-17", text: "Backoff/jitter/circuit-breaker on all remote calls; per-action egress audit log (RC-5); regression matrix on the frozen build.", artifacts: ["PATCH", "TESTS"] },
    ],
  },
];

/* ---------- Section 06 · open questions ---------- */

export const openQuestions = [
  "Is the repository private? A read-only grant (or an archive at the exact working and broken commits) is the single highest-value unblock — without it every internal claim stays HYPOTHESIS.",
  "Which build is frozen as the stable baseline (D-01)? Record its SHA-256 and archive every prior build so rollback never depends on the vendor feed.",
  "What platform and framework is the client (Windows/macOS, native vs Electron/CEF/.NET)? This selects the whole toolchain for triage.",
  "Can you supply logs or crash dumps from an actual failure, with timestamps?",
  "Do failures follow IG-side events (checkpoint emails, action blocks)? Any one dated correlation narrows the registry immediately.",
  "Who operates the vendor server, and is vendor status history available (outages, endpoint migrations) around the failure dates?",
  "Confirm authorization: is this analysis performed by or for the rights holder of the software and the accounts involved? The plan proceeds only under explicit authorization.",
  "What exactly was the startup banner (vendor announcement, changelog modal)? A screenshot or its host/markup confirms the D-02 removal has no side effects — e.g., that it was not also serving a legal notice.",
];

export const confidenceLegend: { kind: StampKind; meaning: string }[] = [
  { kind: "CONFIRMED", meaning: "Directly observed and citable" },
  { kind: "REFERENCE", meaning: "Class-level model, not from this codebase" },
  { kind: "HYPOTHESIS", meaning: "Plausible mechanism, evidence required" },
  { kind: "UNKNOWN", meaning: "Cannot be determined without materials" },
];
