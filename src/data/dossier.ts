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
  | "P3";

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
      "No README, source tree, releases, issues or commit history are reachable. Any statement about this application's specific endpoints, license server, storage format or workers is therefore a hypothesis until materials are provided.",
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
      "Instagram account-managers converge on three execution topologies (local automation, vendor-hosted, hybrid) and a three-way auth separation (app-user / license / IG session). The dossier below maps that model and states exactly what evidence adjudicates each branch.",
    citation: "Class-level knowledge · explicitly not findings from this repo",
  },
];

export const situationStats = [
  { label: "Public files inventoried", value: 0, suffix: "" },
  { label: "Working hypotheses registered", value: 7, suffix: "" },
  { label: "Evidence artifacts required", value: 14, suffix: "" },
  { label: "Baseline confidence", value: 0, suffix: "", text: "LOW" },
];

export const consoleLines = [
  { ts: "09:14:02Z", level: "NET", msg: "GET github.com/leonuo/InstAccountsManager → 404 · HTML \"Page not found\"" },
  { ts: "09:14:03Z", level: "NET", msg: "GET api.github.com/repos/leonuo/InstAccountsManager → 404 {\"message\":\"Not Found\"}" },
  { ts: "09:14:05Z", level: "NET", msg: "GET api.github.com/.../git/trees/main?recursive=1 → unreachable (429 upstream) · branch enumeration blocked" },
  { ts: "09:14:06Z", level: "CASE", msg: "Source availability: NONE at supplied URL → repo is private / renamed / deleted / mistyped" },
  { ts: "09:14:06Z", level: "RULE", msg: "Directive applied: do not invent code-level findings → all internals labeled HYPOTHESIS" },
  { ts: "09:14:07Z", level: "PLAN", msg: "Loading class-level reference model: 3 execution topologies × 3 auth domains × update pipeline" },
  { ts: "09:14:07Z", level: "PLAN", msg: "Registering 7 ranked root-cause hypotheses for symptom cluster [crash · freeze · stop · broken feature]" },
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
    desc: "All Instagram operations execute on the operator's machine. The client embeds a browser engine or calls IG private endpoints directly; the vendor server (if any) only serves licensing, config and updates.",
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
      "License server and task server frequently share host/infra — license outage can idle workers",
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
      "Inconsistent state bugs (\"account logged out after license error\") cluster at the sync boundary",
      "Update regressions often hit only one half — e.g. local client version vs server contract",
    ],
    verdict: "Adjudicate by phase: tag every connection with the app phase active when it fired.",
  },
};

export const adjudicationChecks = [
  { id: "AJ-1", text: "Capture DNS + connection metadata on the client host while a task runs. Which of {vendor API, i.instagram.com, graph.facebook.com, CDN scontent} appear?", artifact: "PCAP / DNSLOG" },
  { id: "AJ-2", text: "Inventory the install directory for engine artifacts: cef*.dll, electron.asar, chromedriver, WebView2 loader, or HTTP-only binaries.", artifact: "FILELIST" },
  { id: "AJ-3", text: "Watch the app-data directory during login: where do sessionid / ds_user_id cookies land (local file/DB vs. request body to vendor)?", artifact: "FSMON" },
  { id: "AJ-4", text: "Run strings/resource inspection of the binary for endpoint literals, app-id constants, user-agent pins and license hosts.", artifact: "STRINGS" },
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
    failCoupling: "Update resets/migrates store → forced re-login wave; unclean exit corrupts DB",
    adjudicate: "FSMON on appdata across an update (AJ-3)",
    coupling: 3,
  },
  {
    feature: "Bulk follow / unfollow / like",
    exec: "HYBRID",
    protocol: "Private action endpoints, per-account pacing (candidate)",
    authDep: "Valid IG session · proxy per account",
    failCoupling: "License heartbeat killing workers mid-batch → partial state",
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
    failCoupling: "Upload endpoint drift after update breaks silently",
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
    feature: "License validation & heartbeat",
    exec: "APP-LEVEL",
    protocol: "Vendor license endpoint · periodic call, HWID payload (candidate)",
    authDep: "App-user token + license key",
    failCoupling: "Server unreachable: hard UI block vs grace period — the key behavioral question",
    adjudicate: "Observe UI with license host blocked (AJ-5)",
    coupling: 3,
  },
  {
    feature: "Auto-update",
    exec: "APP-LEVEL",
    protocol: "Vendor update feed · installer / in-app patcher (candidate)",
    authDep: "Usually none, or app token",
    failCoupling: "Unsigned/partial patch, config schema migration, device-ID reset",
    adjudicate: "Sandboxed update run + file DIFF",
    coupling: 3,
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

/* ---------- Section 03 · three auth domains, license lifecycle, update pipeline ---------- */

export const authDomains = [
  {
    name: "App-user authentication",
    color: "cyn" as const,
    role: "Operator ↔ vendor",
    facts: [
      "Email/password (or key) against vendor identity endpoint → short-lived token + refresh (typical)",
      "Token lifecycle to verify: TTL, refresh path, behavior on refresh failure mid-task",
      "Failure should affect vendor features only — never IG cookies — if domains are properly separated",
    ],
    failure: "Expired token → API 401s; a client that treats 401 as fatal can freeze the UI thread waiting on a login prompt it never shows.",
  },
  {
    name: "License validation",
    color: "amb" as const,
    role: "App ↔ license server",
    facts: [
      "Activation binds a machine fingerprint (HWID: SMBIOS UUID, MAC, disk serial — typical)",
      "Periodic heartbeat with offline grace window is the common design; width of grace is decisive",
      "Update can change the fingerprint input set → same machine reads as new device → invalidation",
    ],
    failure: "Heartbeat failing during a task: does the worker flush state and stop, or die mid-write? This is RC-1.",
  },
  {
    name: "Instagram session",
    color: "grn" as const,
    role: "Client (or vendor) ↔ IG",
    facts: [
      "Independent of both above: cookie-based (sessionid / ds_user_id), device-bound, challengeable at any time",
      "Persistence target (local store vs vendor vault) is the single most important custody fact — see AJ-3",
      "Challenges (checkpoint, 2FA, email code) require interactive solving; unattended workers must queue them",
    ],
    failure: "Forced app termination during a checkpoint flow can leave the session half-validated — the classic \"account lost\" after a crash.",
  },
];

export const licenseLifecycle = [
  { state: "VALID", note: "Heartbeat OK · all features unlocked", tone: "grn" },
  { state: "GRACE", note: "Server unreachable · cached verdict used for N hours (N to verify)", tone: "amb" },
  { state: "EXPIRED", note: "Verdict fails closed or open? Determines whether workers stop or continue blind", tone: "amb" },
  { state: "BLOCKED", note: "UI gate / worker kill. If kill is non-transactional → RC-1 corruption", tone: "red" },
];

export const updatePipeline = [
  { stage: "CHECK", risk: "Version feed returns a broken channel build; rollback availability unknown" },
  { stage: "DOWNLOAD", risk: "Partial / resumed download without integrity re-check → corrupted binaries or config" },
  { stage: "VERIFY", risk: "Signature / hash verification present? Unverified patch = prime regression vector" },
  { stage: "INSTALL", risk: "Overwrites settings, resets HWID inputs, replaces local DB without migration" },
  { stage: "MIGRATE", risk: "Config/schema version mismatch: old session store unreadable → mass re-login" },
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
    id: "RC-1",
    priority: "P1",
    title: "License kill-switch terminates workers without state flush",
    symptom: "Unexpected stops + \"broken\" accounts after license errors; tasks vanish mid-run.",
    mechanism:
      "A failed heartbeat (expired key, unreachable server, post-update HWID change) triggers process/worker termination that is not transactional: task DB left mid-write, session checkpoint half-committed, in-memory queues dropped.",
    confirm:
      "Logs showing worker SIGKILL/abort within seconds of a license 4xx/timeout; DB journal/WAL present or torn writes; task state file newer than last commit.",
    reject:
      "Long task completes normally with the license host blocked for the whole run (grace honored, clean stop at boundary).",
    repro:
      "Sandbox copy + test account. Start a long bulk task, block the license host via OS hosts-file, observe worker exit path and reopen the app: is task state coherent?",
    fix:
      "Legitimate: make license verdicts advisory at task boundaries — flush + commit before honoring a stop; queue challenges instead of killing threads; add journal/WAL recovery on start.",
  },
  {
    id: "RC-2",
    priority: "P1",
    title: "Update migrates or resets local session/config store incorrectly",
    symptom: "After updating: accounts \"logged out\", settings reverted, features dead until reinstall.",
    mechanism:
      "New build expects config schema vN+1; migration missing or order-wrong → loader falls back to defaults, or the installer overwrites the appdata directory. Device-fingerprint inputs change, secondarily invalidating the license (feeds RC-1).",
    confirm:
      "Before/after DIFF of the appdata directory shows session store replaced/zeroed or schema_version bumped with data loss; installer log shows an overwrite step.",
    reject:
      "Update in sandbox leaves session store byte-identical (or cleanly migrated) and sessions survive.",
    repro:
      "Snapshot appdata (read-only copy), run the updater on a sandbox copy, diff trees; then launch and check whether sessions load without re-login.",
    fix:
      "Restore migration path or roll forward: versioned schema with tested migrations, atomic rename installs, never delete unknown files in appdata.",
  },
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
      "Capture shows healthy 200s for the same endpoints; failures correlate with license events instead of IG responses.",
    repro:
      "On a test account, replay one failing operation through a capture proxy; compare response bodies to a known-good baseline build.",
    fix:
      "Ship fingerprint updates out-of-band (config feed) rather than full releases; add response-class aware backoff; surface IG challenge states distinctly from app errors.",
  },
  {
    id: "RC-4",
    priority: "P2",
    title: "UI-thread deadlock: license prompt × challenge modal × worker join",
    symptom: "Hard freeze (UI unresponsive) especially when a license warning coincides with a 2FA/checkpoint prompt.",
    mechanism:
      "Worker thread holds a lock and waits for the UI to present a challenge; UI thread is blocked joining the worker or rendering a license dialog on the same dispatcher. Classic two-lock inversion; only a restart releases it.",
    confirm:
      "Thread dump (ProcDump / stack capture) during the freeze shows the circular wait: UI thread in Join/WaitFor, worker blocked on a UI-dispatch call.",
    reject:
      "Dump shows a single blocked thread on network I/O with the UI pump alive → it is a stall, not a deadlock (RC-5).",
    repro:
      "Force a checkpoint on a test account while a license re-validation is due (shorten heartbeat interval in config if exposed); observe freeze; capture dump.",
    fix:
      "Never join worker threads from the UI thread; present challenges via async queue; watchdog that dumps stacks when the dispatcher stalls >5s.",
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
  {
    id: "RC-6",
    priority: "P2",
    title: "Post-update proxy/isolation regression cross-contaminates accounts",
    symptom: "Accounts stop or checkpoint in waves after an update; not all accounts, and it follows proxy groups.",
    mechanism:
      "An update changes how the per-account proxy binding is applied (e.g., connection pooling shared across accounts, DNS leak, or proxy auth dropped). IG sees N accounts from one IP → coordinated restriction.",
    confirm:
      "Egress-IP log shows multiple account profiles exiting from the same address after the update; pre-update capture shows clean separation.",
    reject:
      "Per-account egress IPs remain unique and stable across the update boundary.",
    repro:
      "Two test profiles, two distinct proxies; run identical actions before/after update; compare egress IPs per profile.",
    fix:
      "Bind proxy at socket level per profile; disable shared connection pools across profiles; log egress IP per action for auditability.",
  },
  {
    id: "RC-7",
    priority: "P3",
    title: "Update alters device fingerprint → license re-activation mid-task",
    symptom: "Immediately after updating, the app demands re-activation; running tasks die (interacts with RC-1).",
    mechanism:
      "HWID computation inputs changed (new SDK, new hash of disk/MAC/SMBIOS, or appdata reset from RC-2 removed the stored device token). License server treats the machine as new; activation cap or manual re-activation interrupts work in progress.",
    confirm:
      "License request payload differs only in the device identifier across the update; vendor panel shows a \"new device\" event at the update timestamp.",
    reject:
      "Device identifier stable across the update; license state transitions correlate with key expiry instead.",
    repro:
      "Capture the license request (sanitized structure only) pre- and post-update in sandbox; diff the fingerprint field set.",
    fix:
      "Persist device token outside the paths an installer may reset; version the fingerprint algorithm and accept N-1 during transition.",
  },
];

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
      { id: "S-02", text: "Collect installer + installed binaries for one known-good and one known-bad version.", artifacts: ["BIN-GOOD", "BIN-BAD"] },
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
      { id: "S-06", text: "Filesystem monitor on appdata during login/task/update: locate session persistence and license state files (AJ-3).", artifacts: ["FSMON"] },
      { id: "S-07", text: "At the next freeze, capture thread stacks (ProcDump or platform equivalent) before killing the process (RC-4).", artifacts: ["THREADDUMP"] },
      { id: "S-08", text: "Static pass on binaries: strings for endpoint literals, app-id/UA pins, engine artifacts (CEF/Electron/WebDriver) (AJ-2/4).", artifacts: ["STRINGS"] },
    ],
  },
  {
    id: "PH-2",
    name: "Controlled reproduction",
    goal: "Recreate each symptom in a sandbox with test accounts only.",
    steps: [
      { id: "S-09", text: "License-outage drill: block license host, run a long task, document worker exit path and state coherence (RC-1).", artifacts: ["HOSTBLOCK", "LOGS"] },
      { id: "S-10", text: "Update drill on a sandbox copy: appdata DIFF before/after, session survival check, license request structure diff (RC-2/7).", artifacts: ["DIFF", "LICENSE-REQ"] },
      { id: "S-11", text: "IG-rejection probe: replay one failing action via intercepting proxy; record response class per build (RC-3).", artifacts: ["MITM-CAPTURE"] },
      { id: "S-12", text: "Isolation probe: two profiles × two proxies, identical actions, compare per-profile egress IPs pre/post update (RC-6).", artifacts: ["EGRESSLOG"] },
    ],
  },
  {
    id: "PH-3",
    name: "Adjudication",
    goal: "Promote or reject every hypothesis with recorded evidence.",
    steps: [
      { id: "S-13", text: "For each RC-1…7: file the confirm/reject evidence, set confidence to CONFIRMED / REJECTED / STILL-UNKNOWN.", artifacts: ["VERDICTS"] },
      { id: "S-14", text: "Produce the final request-flow map with verified edges only; mark residual unknowns explicitly.", artifacts: ["FLOWMAP-V2"] },
    ],
  },
  {
    id: "PH-4",
    name: "Legitimate remediation",
    goal: "Fix defects without touching licensing or auth controls.",
    steps: [
      { id: "S-15", text: "Transactional worker stop at task boundaries; WAL/journal recovery; challenge queueing (RC-1/4).", artifacts: ["PATCH"] },
      { id: "S-16", text: "Versioned config migrations + atomic installs; fingerprint algorithm versioning with N-1 acceptance (RC-2/7).", artifacts: ["PATCH"] },
      { id: "S-17", text: "Backoff/jitter/circuit-breaker on all remote calls; per-action egress audit log (RC-5/6); regression matrix on both builds.", artifacts: ["PATCH", "TESTS"] },
    ],
  },
];

/* ---------- Section 06 · open questions ---------- */

export const openQuestions = [
  "Is the repository private? A read-only grant (or an archive at the exact working and broken commits) is the single highest-value unblock — without it every internal claim stays HYPOTHESIS.",
  "Which versions are affected? One known-good and one known-bad build (installer or binaries) plus the update path between them.",
  "What platform and framework is the client (Windows/macOS, native vs Electron/CEF/.NET)? This selects the whole toolchain for triage.",
  "Can you supply logs or crash dumps from an actual failure, with timestamps and (redacted) license state at that moment?",
  "Do failures follow license errors, updates, or IG-side events (checkpoint emails, action blocks)? Any one dated correlation narrows the registry immediately.",
  "Who operates the vendor/license server, and is vendor status history available (outages, endpoint migrations) around the failure dates?",
  "Confirm authorization: is this analysis performed by or for the rights holder of the software and the accounts involved? The plan proceeds only under explicit authorization.",
];

export const confidenceLegend: { kind: StampKind; meaning: string }[] = [
  { kind: "CONFIRMED", meaning: "Directly observed and citable" },
  { kind: "REFERENCE", meaning: "Class-level model, not from this codebase" },
  { kind: "HYPOTHESIS", meaning: "Plausible mechanism, evidence required" },
  { kind: "UNKNOWN", meaning: "Cannot be determined without materials" },
];
