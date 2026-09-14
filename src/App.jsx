import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  ExternalLink, Github, Linkedin, FileText, Menu, X,
  BookOpen, Sun, Moon, Calendar, MapPin, ArrowUpRight,
  Cpu, Database, Cloud, Code2, GraduationCap, Route, Mail, BadgeCheck,
  Copy, Check,
} from "lucide-react";

import { motion, useReducedMotion, useScroll, useMotionValue, useMotionValueEvent, useTransform, useInView } from "framer-motion";

const PROFILE = {
  name: "Nishanth G Palaniswami",
  role: "AI Engineer · LLM Agents & Data Pipelines",
  thesis:
    "I build agentic AI systems and audit-ready data pipelines, and the tests that keep them honest. NYU MSCE '26 · AI Engineer @ got2eat · previously SAIL GTX. Open to full-time roles now.",
  availability: "ON AIR · open to full-time roles",
  // Stated without a year on purpose: STEM-OPT depends on an E-Verify employer and an
  // approved I-983, so the site says what is true today and leaves dates to the forms.
  authorization: "US work-authorized · no sponsorship required · F-1 OPT, STEM-OPT eligible",
};

const LINKS = {
  email: "ng3124@nyu.edu",
  emailCompose: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    "ng3124@nyu.edu"
  )}&su=${encodeURIComponent(
    "Portfolio Reachout - [Company/Individual]"
  )}&body=${encodeURIComponent(
    `Hi Nishanth,

I came across your portfolio and wanted to reach out.

[Add your message here]

Best,
[Name]`
  )}`,
  github: "https://github.com/Nishanth-G-Palaniswami",
  linkedin: "https://www.linkedin.com/in/nishanth-g-palaniswami",
  resume: "https://drive.google.com/file/d/1xSsXeuJOPBaVGLctq1r0azfFToLEzv9L/view",
};

const ABOUT = `I'm Nishanth, an AI engineer who builds systems that have to be right, not just impressive. I like owning the layers that make software trustworthy: data pipelines with versioned ingestion, agentic systems with tested guardrails, and the golden tests and CI that catch regressions before users do. My work sits where engineering meets AI: turning ambiguity into systems that are clear, reproducible, and production-ready.`;

// Photos live in public/photos (longest edge 1024px, JPEG q82, no EXIF).
// Captions state only what the frame shows; the user confirms each one.
const PHOTOS = {
  about: {
    src: "/photos/roosevelt-island.jpg",
    width: 1024,
    height: 768,
    alt: "Nishanth on the Roosevelt Island waterfront with the Queensboro Bridge behind him",
    caption: "Roosevelt Island, New York",
  },
  sail: {
    src: "/photos/sail-team.jpg",
    width: 1024,
    height: 682,
    alt: "Nishanth and two SAIL teammates holding a SAIL sign",
    caption: "With the SAIL team",
  },
  got2eat: {
    src: "/photos/base44-demo-day.jpg",
    width: 768,
    height: 1024,
    alt: "Holding the Base44 accelerator check outside the Demo Day finale",
    caption: "Base44 Demo Day finale",
    position: "50% 72%",
  },
};

// Off the clock: three hobbies, one line each. The lines joke about attitude,
// never about skill or frequency; the user picked every one of them.
const OFF_THE_CLOCK_LINE = "Proof I go outside.";

const HOBBIES = [
  {
    activity: "Hiking",
    place: "Grand Canyon",
    line: "No signal, no CI, no regrets.",
    src: "/photos/grand-canyon.jpg",
    width: 768,
    height: 1024,
    position: "50% 55%",
    alt: "Hiking: standing arms wide on a rock ledge above the Grand Canyon",
  },
  {
    activity: "Kayaking",
    place: "Lake Powell, Arizona",
    line: "The one place I accept latency.",
    src: "/photos/lake-powell.jpg",
    width: 768,
    height: 1024,
    position: "50% 85%",
    alt: "Kayaking: paddling a yellow kayak below sandstone cliffs on Lake Powell",
  },
  {
    activity: "Skiing",
    place: "Hunter Mountain, Catskills",
    line: "Gravity handles the deployment. I handle the braking.",
    src: "/photos/skiing.jpg",
    width: 580,
    height: 1024,
    position: "50% 60%",
    alt: "Skiing: heading down a groomed run at Hunter Mountain in the Catskills",
  },
];

const EDUCATION = [
  {
    degree: "M.S. Computer Engineering",
    school: "New York University",
    logo: "/nyu-logo.png",
    period: "September 2024 – May 2026",
    detail:
      "GPA 3.965/4.0 · NYU Merit Scholarship recipient. VIP Researcher: dynamic NYC mobility map using GIS + community surveys to analyze mobility patterns.",
  },
  {
    degree: "B.E. Computer Science",
    school: "PSG College of Technology",
    logo: "/psg-logo.png",
    period: "August 2020 – June 2024",
    detail: "Published research (IEEE ICCCNT 2024). Creative Director - PSG Radio Hub (Guinness World Records contribution).",
  },
];

// Synced to the resume (FDE version, 2026-09-14). Five resume groups become four
// cards for the 2-column grid: Geospatial and Mobile folds into the frontend card,
// GTFS joins Backend & Data. Names and casing follow the resume.
const SKILLS = [
  {
    group: "AI & ML",
    icon: Cpu,
    items: [
      "PyTorch", "scikit-learn", "pandas", "Hugging Face Transformers", "LoRA / PEFT",
      "RAG", "Agents", "MCP", "Claude Agent SDK",
    ],
  },
  {
    group: "Backend & Data",
    icon: Database,
    items: [
      "FastAPI", "Django", "Node.js", "Deno", "PostgreSQL", "SQLite", "PySpark",
      "Dagster", "dbt", "DuckDB", "Parquet", "GTFS", "REST APIs",
    ],
  },
  {
    group: "Languages, Frontend & Mobile",
    icon: Code2,
    items: [
      "Python", "SQL", "TypeScript", "JavaScript", "React", "Vite", "Next.js", "HTML / CSS",
      "MapLibre GL", "GeoJSON", "Capacitor",
    ],
  },
  {
    group: "Testing, CI & Cloud",
    icon: Cloud,
    items: [
      "pytest", "Golden tests", "Schema validation", "Playwright", "GitHub Actions", "Git",
      "AWS (EC2, S3, CloudWatch)",
    ],
  },
];

const PUBLICATIONS = [
  {
    title: "American Sign Language Alphabet Recognition Using Teachable Machine",
    venue: "IEEE ICCCNT 2024",
    summary:
      "Co-authored published pipeline translating ASL alphabet signs into real-time text and speech, built on Teachable Machine. 99% alphabet-set accuracy reported in the paper.",
    links: {
      ieee: "https://ieeexplore.ieee.org/document/10725877",
      github:
        "https://github.com/Nishanth-G-Palaniswami/American-Sign-Language-Alphabet-Recognition-Using-Teachable-Machine",
    },
  },
];

const EXPERIENCE = [
  {
    role: "AI Engineer",
    company: "Got2eat (Base44 Accelerator Champions)",
    companyHref: "https://got2eat.site",
    period: "August 2026 – Present",
    location: "Remote · New York, NY",
    photo: PHOTOS.got2eat,
    impact: [
      "Built a server-side LLM assistant turning meal and transit requests into validated app filters with fail-closed rate limits",
      "Engineered GTFS-derived subway + PATH routing and MapLibre layers with door-to-door one-transfer ETAs",
      "Shipped React 19/TypeScript and Deno features for a community map of meals under $15, live at got2eat.site and on iOS (TestFlight)",
      "Developed a B2B partner dashboard for listings, deals, and occupancy; launched a loyalty-card pilot from partner feedback",
    ],
    stack: ["React 19", "TypeScript", "Deno", "MapLibre GL", "GTFS", "Capacitor"],
  },
  {
    role: "Software Engineer Intern",
    company: "SAIL GTX",
    period: "September 2025 – May 2026",
    caseStudyHref: "#sail",
  },
  {
    role: "Software Engineer Intern",
    company: "Tagwebs Technologies",
    period: "April 2023 – May 2024",
    location: "Hybrid · Coimbatore, India",
    impact: [
      "Built 15+ full-stack web projects using Python, Django, HTML, CSS, and JavaScript, including Edliy.com, an EdTech platform where I provisioned 500+ schools with teacher and class accounts in its first 90 days",
      "Automated CI/CD pipelines for 15+ Python/Django + REST API web apps, reducing build time by 25%",
      "Managed AWS EC2/S3 backends with CloudWatch monitoring, sustaining 99% uptime",
    ],
    stack: ["Python", "Django", "REST APIs", "JavaScript", "AWS EC2/S3", "CloudWatch", "GitHub Actions"],
  },
  {
    role: "Software Engineer Intern · ML & IoT",
    company: "Vaayusastra Aerospace (IIT Madras RTBI)",
    period: "February 2023 – March 2023",
    location: "Chennai, India",
    impact: [
      "Spearheaded a responsive mobile dashboard and UI using React & JavaScript for an automated irrigation and agricultural drone system",
      "Solved IoT sensor data pipelines using ESP32 microcontrollers and wireless modules",
      "Preprocessed real-time sensor data and streamlined ML pipelines to optimize irrigation schedules",
    ],
    stack: ["React", "JavaScript", "ESP32", "PyTorch", "Scikit-learn"],
  },
  {
    role: "Research Intern",
    company: "GaiT Watch · PSG CARE",
    period: "December 2021 – January 2022",
    location: "Coimbatore, India",
    impact: [
      "Engineered the GaitWatch product website using Python, Django, HTML & CSS; revamped the brand identity and collected real-time data from 450+ participants during early clinical trials",
      "Preprocessed and structured gait data to assist the ML research team in refining fall-risk prediction models",
      "Validated mobile app UX through user trials, contributing to a commercial rollout funded by PSG College of Technology",
    ],
    stack: ["Python", "Django", "HTML", "CSS", "Pandas"],
  },
];

const PROJECTS = [
  {
    title: "Second Brain · Personal Agentic Co-Pilot",
    accolade: { label: "Agentic AI · 2026", tone: "slate" },
    widget: "guardrails",
    summary:
      "Self-built agentic system on top of Claude Code that reads my Gmail, Slack, GitHub, and Calendar, drafts replies into a review folder, and persists context as Markdown in an Obsidian vault. Open-sourced as a starter kit.",
    stackLine: "Python · Claude Agent SDK · MCP · sqlite-vec · fastembed (ONNX)",
    impact: [
      "Heartbeat scheduler runs every 30 min during work hours; diff-based snapshot invokes Claude only on new signal, writes drafts and Windows toast notifications",
      "Multi-source ingest (Gmail · Slack · GitHub · Calendar) via Python CLI wrappers; credentials never enter the LLM context",
      "Local hybrid memory search: sqlite-vec + fastembed ONNX embeddings, incremental mtime+sha reindex over the Markdown vault",
      "Advisor-mode safety: every outbound artifact lands in drafts/active/ for review; pre-tool hooks enforce per-USER.md guardrails before any action",
    ],
    links: {
      github: "https://github.com/Nishanth-G-Palaniswami/second-brain",
    },
  },
  {
    title: "Census Trade Warehouse · Orchestrated ELT",
    accolade: { label: "Data Engineering · 2026", tone: "slate" },
    summary:
      "Scheduled ELT pipeline turning monthly U.S. Census import data into an analytics-ready DuckDB warehouse: Dagster assets feed dbt staging and marts, producing ranked trading-partner and product-category tables.",
    stackLine: "Dagster · dbt · DuckDB · Python · GitHub Actions",
    impact: [
      "12 dbt data tests + pytest run in CI on every push",
      "Idempotent ingestion: re-running a month never duplicates rows",
      "Clones and runs offline via a bundled sample, no API key required",
      "Monthly schedule ingests the latest published Census month automatically",
    ],
    links: {
      github: "https://github.com/Nishanth-G-Palaniswami/census-trade-warehouse",
    },
  },
  {
    title: "voicebot · Local Push-to-Talk Dictation",
    accolade: { label: "Local ML · 2026", tone: "slate" },
    summary:
      "Fully offline dictation tool: hold a key, speak, release, and cleaned text is typed into whatever app has focus. Whisper STT + a local LLM cleanup pass, both on-device; nothing leaves the machine.",
    stackLine: "Python · faster-whisper (int8) · Ollama · CUDA",
    impact: [
      "~2.5s end-to-end within ~2.5 GB VRAM on a 4 GB laptop GPU (GTX 1650 Ti)",
      "int8 over FP16: ~4× faster STT on GTX 16-series",
      "Boot-time CUDA compute-probe with automatic CPU fallback",
      "LLM cleanup fails safe: pastes the raw transcript rather than dropping your words",
    ],
    links: {
      github: "https://github.com/Nishanth-G-Palaniswami/voicebot",
    },
  },
  {
    title: "ASL Alphabet Recognition",
    accolade: { label: "IEEE Published · ICCCNT 2024", tone: "violet" },
    summary:
      "Real-time ASL alphabet → text → speech pipeline built on Teachable Machine. Co-authored, peer-reviewed, and published in IEEE ICCCNT 2024.",
    stackLine: "Python · OpenCV · Teachable Machine",
    impact: [
      "99% alphabet-set accuracy reported in the paper",
      "Published at IEEE ICCCNT 2024 (6-author team)",
    ],
    links: {
      ieee: "https://ieeexplore.ieee.org/document/10725877",
      github:
        "https://github.com/Nishanth-G-Palaniswami/American-Sign-Language-Alphabet-Recognition-Using-Teachable-Machine",
    },
  },
  {
    title: "MetroScan · NYC Subway Analytics",
    accolade: { label: "PySpark · 2024", tone: "slate" },
    summary:
      "PySpark pipeline engineering a 110M-row raw MTA ridership feed (2020–2024) into a 16M-row hourly feature table, built in a 2-person agile team. Modeled delay-like patterns, clustered stations by usage, flagged disruption events with rolling-window anomaly detection.",
    stackLine: "PySpark · Spark MLlib · Parquet",
    impact: [
      "110M raw rows engineered into a 16M-row hourly feature table",
      "GBT RMSE ≈ 104 on delay-proxy prediction",
      "Detected post-COVID ridership recovery + 8 AM / 5 PM peaks",
      "PCA + KMeans clustered stations into usage typologies",
    ],
    links: {
      github:
        "https://github.com/Nishanth-G-Palaniswami/MetroScan-NYC-Subway-Ridership-and-Delay-Detection",
      demo: "https://colab.research.google.com/drive/1VbhLZuXFlg1NgOVsxAKEhIlwHzWL-WXS?usp=sharing",
      ppt: "https://docs.google.com/presentation/d/1o2ho5Qf1a4Axyc0mWregmTxmuISYSep_uROid4kJ_xI/edit?usp=sharing",
    },
  },
  {
    title: "RoBERTa + LoRA · Parameter-Efficient Text Classification",
    accolade: { label: "PEFT · 2025", tone: "slate" },
    summary:
      "Fine-tuned RoBERTa-base for 4-way news topic classification (AG News) using LoRA adapters, matching near-full-fine-tune accuracy while training under 1% of the model's weights. NYU Deep Learning group project.",
    stackLine: "PyTorch · Hugging Face Transformers · PEFT (LoRA)",
    impact: [
      "94.8% test accuracy on the AG News test split",
      "999K of 125.6M parameters trained (0.80%)",
      "~4 MB of adapter weights vs a ~500 MB full checkpoint",
    ],
    links: {
      github: "https://github.com/Nishanth-G-Palaniswami/lora-roberta-agnews",
    },
  },
  {
    title: "Drug–Target Interaction & Side-Effects",
    accolade: { label: "Multi-modal · Multi-task", tone: "slate" },
    summary:
      "Multi-modal, multi-task model jointly predicting drug-target binding affinity and adverse side effects in one pass: Transformer encoder over SMILES strings, CNNs over molecular structure images, shared task heads. 2-person NYU course project on BindingDB + SIDER.",
    stackLine: "PyTorch · RDKit · BindingDB · SIDER",
    impact: [
      "Joint multi-task heads: affinity regression + side-effect classification",
      "Gradient-conflict analysis improved multi-task stability",
    ],
    links: {
      github:
        "https://github.com/Nishanth-G-Palaniswami/Multi-Modal-Deep-Learning-for-Joint-Prediction-of-Drug-Target-Interaction-and-Side-Effects",
      ppt: "https://docs.google.com/presentation/d/1hXOH0fBqxfF33P-VlMnFsEevn2IKBg7NmSnFfXH_Ftc/edit?usp=sharing",
    },
  },
];

// Guardrail playground: a client-side mirror of the five security boundaries in
// the second brain's USER.md. First matching rule wins; no match means the real
// PreToolUse hooks would let the call through.
const GUARDRAILS = [
  {
    boundary: "Boundary 1 · outbound messages",
    verdict: "draft-only",
    test: /\b(send|reply|respond|email|e-mail|message|dm|slack)\b/i,
    then: "Written to drafts/active/ for review. Nothing leaves without a human pressing send.",
  },
  {
    boundary: "Boundary 2 · social posting",
    verdict: "blocked",
    test: /\b(tweet|post|publish|linkedin|twitter|instagram|facebook|social)\b/i,
    then: "Refused before the tool runs. The agent never posts on my behalf.",
  },
  {
    boundary: "Boundary 3 · money",
    verdict: "blocked",
    test: /\b(pay|payment|charge|purchase|buy|stripe|paypal|billing|invoice|wire)\b/i,
    then: "Refused. No financial data, no purchases, no exceptions.",
  },
  {
    boundary: "Boundary 4 · deletion",
    verdict: "blocked",
    test: /\b(rm|del|delete|remove|drop|trash|erase|purge|wipe)\b|--force|-D\b/i,
    then: "Refused. Deletes and force pushes are mine to run.",
  },
  {
    boundary: "Boundary 5 · production",
    verdict: "blocked",
    test: /\b(push|merge|deploy|release|railway up|supabase db push|docker push|vercel)\b/i,
    then: "Refused. The agent prepares the commit; I push.",
  },
  {
    boundary: "Read scope",
    verdict: "allowed",
    test: /\b(read|list|search|find|summarize|summarise|show|check|status|inbox|calendar|what|who|when)\b/i,
    then: "Runs. Reading Gmail, Slack, GitHub, and Calendar is inside the advisor's lane.",
  },
];

const GUARDRAIL_FALLBACK = {
  boundary: "No rule matched",
  verdict: "allowed",
  then: "Runs and is logged. The hooks only block what matches a boundary.",
};

const GUARDRAIL_EXAMPLES = ["git push origin main", "reply to the recruiter", "rm -rf dist", "summarize my inbox"];

const evaluateGuardrail = (text) => {
  const t = text.trim();
  if (!t) return null;
  return GUARDRAILS.find((rule) => rule.test.test(t)) || GUARDRAIL_FALLBACK;
};

// Career route for the hero: lane 0 is school, lane 1 is work, so the 45-degree
// jogs in the line mean something. Facts mirror Education and Experience below.
const ROUTE_STOPS = [
  { label: "PSG College", sub: "B.E. Computer Science", year: "'20", lane: 0 },
  { label: "Tagwebs", sub: "Software Engineer Intern", year: "'23", lane: 1 },
  { label: "NYU", sub: "M.S. Computer Engineering", year: "'24", lane: 0 },
  { label: "SAIL", sub: "Software Engineer Intern", year: "'25", lane: 1 },
  { label: "got2eat", sub: "AI Engineer", year: "now", lane: 1, terminal: true },
];

// -------------------- PRIMITIVES -------------------- //

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900";

const NAV_ITEMS = [
  { href: "#about", label: "About" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
  { href: "#sail", label: "SAIL" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#publications", label: "Publications" },
  { href: "#detours", label: "Detours" },
  { href: "#contact", label: "Contact" },
];

const StationDot = ({ fill = "bg-white dark:bg-slate-900", className = "" }) => (
  <span
    aria-hidden="true"
    className={`inline-block h-3 w-3 flex-shrink-0 rounded-full border-2 border-accent ${fill} ${className}`}
  />
);

// Strip-map geometry: fixed 44px rows keep the SVG line and the HTML stations aligned.
const ROUTE_ROW = 44;
const ROUTE_LANE_X = [8, 16];

const routePath = (stops) =>
  stops
    .map((stop, i) => {
      const x = ROUTE_LANE_X[stop.lane];
      const y = ROUTE_ROW / 2 + ROUTE_ROW * i;
      if (i === 0) return `M${x} ${y}`;
      const prev = stops[i - 1];
      const prevY = ROUTE_ROW / 2 + ROUTE_ROW * (i - 1);
      return prev.lane === stop.lane
        ? `V${y}`
        : `V${prevY + 14} L${x} ${prevY + 22} V${y}`;
    })
    .join(" ");

const RouteDiagram = ({ stops, reduce }) => {
  const height = ROUTE_ROW * stops.length;
  const stagger = stops.length > 1 ? 1.1 / (stops.length - 1) : 0;
  return (
    <div className="relative mt-5">
      <svg
        aria-hidden="true"
        width="24"
        height={height}
        viewBox={`0 0 24 ${height}`}
        className="absolute left-0 top-0 overflow-visible"
      >
        <motion.path
          d={routePath(stops)}
          className="stroke-accent"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
      </svg>
      <ol className="relative">
        {stops.map((stop, i) => (
          <li key={stop.label} className="grid h-11 grid-cols-[24px_1fr] items-center">
            <motion.span
              aria-hidden="true"
              className="relative block h-3 w-3"
              style={{ marginLeft: ROUTE_LANE_X[stop.lane] - 6 }}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 + i * stagger, duration: 0.2 }}
            >
              {stop.terminal ? (
                <>
                  {!reduce && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </>
              ) : (
                <StationDot className="block" />
              )}
            </motion.span>
            <span className="min-w-0 pl-3 leading-tight">
              <span className="block truncate text-sm text-slate-800 dark:text-slate-200">
                <span className="font-semibold">{stop.label}</span>
                <span className="ml-2 font-mono text-[11px] tabular-nums tracking-[0.12em] text-accent">
                  {stop.year}
                </span>
              </span>
              <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{stop.sub}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

const Section = ({ id, title, kicker, children }) => (
  <section id={id} className="scroll-mt-20 py-10 md:py-14">
    <div className="mx-auto max-w-[clamp(20rem,min(92vw,80rem),80rem)]">
      <div className="flex items-center gap-2.5">
        <StationDot />
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono">
          {kicker}
        </p>
      </div>
      <h2 className="mt-2 mb-8 text-2xl md:text-3xl font-semibold tracking-tight font-display">{title}</h2>
      {children}
    </div>
  </section>
);

const accoladeClasses = (tone) =>
  tone === "blue"
    ? "bg-accent/10 text-accent border border-accent/20"
    : tone === "violet"
      ? "bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20"
      : "bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700";

// Strip-map rail (1600px and wider). The active station is the last section whose
// top has crossed the activation line (header height + 32px); the last station wins
// at the end of the page so short closing sections still light up. The fill is a
// piecewise-linear map of scrollY onto the evenly spaced stations.
const SectionRail = ({ items }) => {
  const { scrollY } = useScroll();
  const fill = useMotionValue(0);
  const [active, setActive] = useState(-1);
  const activation = useRef([]);

  const update = (y) => {
    const act = activation.current;
    const n = act.length;
    if (n === 0) return;
    const doc = document.documentElement;
    const atEnd = y + window.innerHeight >= doc.scrollHeight - 2;
    let idx = -1;
    act.forEach((a, i) => { if (y >= a) idx = i; });
    if (atEnd) idx = n - 1;
    let fraction = 0;
    if (atEnd || y >= act[n - 1]) fraction = 1;
    else if (idx >= 0) fraction = (idx + (y - act[idx]) / (act[idx + 1] - act[idx])) / (n - 1);
    fill.set(Math.min(1, Math.max(0, fraction)));
    setActive((prev) => (prev === idx ? prev : idx));
  };

  useLayoutEffect(() => {
    const measure = () => {
      const header = document.querySelector("header");
      const offset = (header ? header.offsetHeight : 0) + 32;
      const tops = items.map((item) => {
        const el = document.querySelector(item.href);
        return el ? el.getBoundingClientRect().top + window.scrollY - offset : 0;
      });
      const ascending = tops.every((t, i) => i === 0 || t > tops[i - 1]);
      activation.current = ascending ? tops : [];
      update(window.scrollY);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [items]);

  useMotionValueEvent(scrollY, "change", update);

  return (
    <nav aria-label="Section progress" className="hidden rail:block fixed left-4 top-1/2 z-20 -translate-y-1/2">
      <div className="relative">
        <span aria-hidden="true" className="absolute left-[5px] top-[10px] bottom-[10px] w-0.5 bg-slate-200 dark:bg-slate-800" />
        <motion.span
          aria-hidden="true"
          className="absolute left-[5px] top-[10px] bottom-[10px] w-0.5 origin-top bg-accent"
          style={{ scaleY: fill }}
        />
        <ol className="relative space-y-3">
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`group flex items-center gap-3 py-1 rounded ${focusRing}`}
                >
                  <StationDot fill={isActive ? "bg-accent" : undefined} />
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                      isActive
                        ? "text-accent"
                        : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

const PhotoFigure = ({ photo, ratio = "aspect-[3/4]", className = "" }) => (
  <figure className={className}>
    <img
      src={photo.src}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading="lazy"
      decoding="async"
      style={photo.position ? { objectPosition: photo.position } : undefined}
      className={`w-full ${ratio} object-cover rounded-xl border border-slate-200 dark:border-slate-800`}
    />
    <figcaption className="mt-2 text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono">
      {photo.caption}
    </figcaption>
  </figure>
);

// Detours band: a full-bleed dusk scene, mountains in the back, three hobby notes
// in front. The ridges rise, the sun comes up and the trail draws itself once the
// band scrolls into view; the back ridge and sun drift a little with scroll.
// Reduced motion renders the finished scene. viewBox 2400x400, sliced to cover:
// wide enough that no viewport up to 2560px crops the peaks, the sun or the rings.
const RIDGES = [
  { d: "M0 175 L110 130 L190 150 L300 95 L380 135 L470 120 L560 160 L640 105 L720 140 L810 118 L900 170 L980 130 L1080 90 L1160 125 L1240 110 L1320 165 L1400 128 L1480 100 L1560 150 L1640 135 L1720 118 L1800 160 L1880 122 L1960 95 L2040 140 L2120 112 L2200 155 L2280 128 L2360 108 L2400 130 L2400 400 L0 400 Z", cls: "fill-accent/30 dark:fill-accent/25", y: 40, delay: 0 },
  { d: "M0 200 L90 175 L170 195 L260 160 L340 185 L430 170 L520 205 L610 165 L700 190 L790 158 L880 200 L960 172 L1050 150 L1130 185 L1220 168 L1310 205 L1400 176 L1490 155 L1580 195 L1670 170 L1760 160 L1850 200 L1940 165 L2030 152 L2120 190 L2210 168 L2300 205 L2400 178 L2400 400 L0 400 Z", cls: "fill-slate-300 dark:fill-slate-800", y: 28, delay: 0.12 },
  { d: "M0 215 L120 200 L220 212 L340 190 L460 210 L580 195 L700 218 L820 200 L940 188 L1060 214 L1180 198 L1300 216 L1420 192 L1540 210 L1660 196 L1780 219 L1900 200 L2020 188 L2140 212 L2260 198 L2400 208 L2400 400 L0 400 Z", cls: "fill-slate-200 dark:fill-slate-900", y: 16, delay: 0.24 },
];
// The trail traces the back ridge's own silhouette from x=520 (right of the title
// block), rings on its peaks, and lives in the ridge's parallax group so they
// move together. Below xl the scene is scaled up and the trail is hidden.
const TRAIL = "M980 130 L1080 90 L1160 125 L1240 110 L1320 165 L1400 128 L1480 100 L1560 150 L1640 135 L1720 118 L1800 160 L1880 122 L1960 95 L2040 140 L2120 112 L2200 155 L2280 128 L2360 108 L2400 130";
const TRAIL_STOPS = [[1080, 90], [1480, 100], [1960, 95]];
// Night sky only: a few faint stars, kept right of the title block and below the
// 2560px crop line so they show at every desktop width.
const STARS = [[800, 84, 1.2], [1000, 72, 1.5], [1180, 94, 1.0], [1560, 78, 1.1], [1760, 88, 1.3], [1980, 70, 1.5], [2260, 92, 1.2], [2380, 76, 1.0]];

const DetoursBand = ({ notes, reduce, dark }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // clipPath content is never laid out, so whileInView cannot fire on the rect;
  // the band's own in-view state drives the trail reveal instead.
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const backY = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const sunY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const reveal = (delay, y) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.7, delay, ease: "easeOut" },
        };
  return (
    <section
      ref={ref}
      id="detours"
      aria-labelledby="detours-heading"
      className="relative isolate overflow-hidden scroll-mt-24 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_60%_at_72%_100%,rgb(var(--accent)/0.22),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_72%_100%,rgb(var(--accent)/0.45),transparent_70%)]"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 2400 400"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 -z-10 h-full w-full"
      >
        <motion.g style={reduce ? undefined : { y: sunY }}>
          {dark ? (
            <>
              <defs>
                <mask id="detours-moon-mask">
                  <rect x="0" y="0" width="2400" height="400" fill="white" />
                  <circle cx="1334" cy="104" r="27" fill="black" />
                </mask>
              </defs>
              {STARS.map(([cx, cy, r], i) => (
                <motion.circle
                  key={cx}
                  cx={cx}
                  cy={cy}
                  r={r}
                  className="hidden sm:block fill-slate-200/70"
                  {...reveal(0.2 + i * 0.05, 6)}
                />
              ))}
              <motion.circle cx="1320" cy="114" r="54" className="hidden sm:block fill-slate-200/10" {...reveal(0.1, 60)} />
              <motion.circle
                cx="1320"
                cy="114"
                r="31"
                mask="url(#detours-moon-mask)"
                className="hidden sm:block fill-slate-200"
                {...reveal(0.1, 60)}
              />
            </>
          ) : (
            <>
              <motion.circle cx="1320" cy="114" r="54" className="hidden sm:block fill-accent/20" {...reveal(0.1, 60)} />
              <motion.circle cx="1320" cy="114" r="31" className="hidden sm:block fill-accent/80" {...reveal(0.1, 60)} />
            </>
          )}
        </motion.g>
        <motion.g style={reduce ? undefined : { y: backY }}>
          <motion.path d={RIDGES[0].d} className={RIDGES[0].cls} {...reveal(RIDGES[0].delay, RIDGES[0].y)} />
          {/* The trail is revealed by a widening clip so its dashes survive the animation */}
          <defs>
            <clipPath id="detours-trail-clip">
              {reduce ? (
                <rect x="980" y="0" width="1420" height="400" />
              ) : (
                <motion.rect
                  x="980"
                  y="0"
                  height="400"
                  initial={{ width: 0 }}
                  animate={{ width: inView ? 1420 : 0 }}
                  transition={{ duration: 1.4, delay: 0.5, ease: "easeInOut" }}
                />
              )}
            </clipPath>
          </defs>
          <path
            d={TRAIL}
            fill="none"
            className="hidden xl:block stroke-accent"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 8"
            clipPath="url(#detours-trail-clip)"
          />
          {TRAIL_STOPS.map(([cx, cy], i) => (
            <motion.circle
              key={cx}
              cx={cx}
              cy={cy}
              r="7"
              className="hidden xl:block fill-slate-100 dark:fill-slate-950 stroke-accent"
              strokeWidth="3"
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, scale: 0.6 },
                    whileInView: { opacity: 1, scale: 1 },
                    viewport: { once: true, amount: 0.3 },
                    transition: { duration: 0.35, delay: 1.2 + i * 0.25 },
                  })}
            />
          ))}
        </motion.g>
        <motion.path d={RIDGES[1].d} className={RIDGES[1].cls} {...reveal(RIDGES[1].delay, RIDGES[1].y)} />
        <motion.path d={RIDGES[2].d} className={RIDGES[2].cls} {...reveal(RIDGES[2].delay, RIDGES[2].y)} />
      </svg>
      {/* Ground scrim: the ridges fade out under the notes so the text sits on an even dark ground */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-[45%] bg-gradient-to-t from-slate-100/70 dark:from-slate-950/60 to-transparent"
      />

      <div className="mx-auto max-w-[clamp(20rem,min(92vw,80rem),80rem)] px-4 py-14 md:py-16">
        <div className="flex items-center gap-2.5">
          <StationDot fill="bg-slate-100 dark:bg-slate-950" />
          <p className="text-xs uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 font-mono">off the clock</p>
        </div>
        <h2
          id="detours-heading"
          className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight font-display text-slate-900 dark:text-white"
        >
          Detours
        </h2>
        <p className="mt-3 text-base md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed">{OFF_THE_CLOCK_LINE}</p>

        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {notes.map((note) => (
            <li key={note.activity} className="flex items-start gap-4">
              <img
                src={note.src}
                width={note.width}
                height={note.height}
                alt={note.alt}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: note.position }}
                className="h-16 w-16 flex-shrink-0 rounded-full object-cover ring-2 ring-accent/70 ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-950"
              />
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white">{note.activity}</h3>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 font-mono">{note.place}</p>
                <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{note.line}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const verdictClasses = {
  allowed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  blocked: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  "draft-only": "bg-accent/10 text-accent border-accent/20",
};

const GuardrailPlayground = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const run = (value) => {
    setText(value);
    setResult(evaluateGuardrail(value));
  };
  return (
    <div className="mt-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4">
      <label
        htmlFor="guardrail-input"
        className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono"
      >
        Try the guardrails
      </label>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(text);
        }}
      >
        <input
          id="guardrail-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="try: git push origin main"
          autoComplete="off"
          spellCheck="false"
          className={`min-w-0 flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 h-10 text-sm font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${focusRing}`}
        />
        <button
          type="submit"
          className={`inline-flex items-center rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 h-10 text-sm font-medium hover:opacity-90 transition-opacity ${focusRing}`}
        >
          Run
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {GUARDRAIL_EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => run(example)}
            className={`rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-mono text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 transition-colors ${focusRing}`}
          >
            {example}
          </button>
        ))}
      </div>
      <div className="mt-4 min-h-[3.5rem]" aria-live="polite" data-guardrail-result>
        {result && (
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide border font-mono ${verdictClasses[result.verdict]}`}
              >
                {result.verdict}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{result.boundary}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{result.then}</p>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Mirrors the five boundaries in my second brain&rsquo;s USER.md. The real checks are Python
        PreToolUse hooks, regression-tested in CI.{" "}
        <a
          href="https://github.com/Nishanth-G-Palaniswami/second-brain"
          target="_blank"
          rel="noreferrer"
          className={`underline underline-offset-4 hover:text-accent transition-colors rounded ${focusRing}`}
        >
          See the rules
        </a>
      </p>
    </div>
  );
};

// Footer clock: New York time. Re-renders on the minute; no aria-live so it never
// interrupts a screen reader.
const CLOCK_CITIES = [{ city: "New York", zone: "America/New_York" }];

const clockFormat = (zone) =>
  new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

const LocalClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer;
    const schedule = () => {
      timer = setTimeout(() => {
        setNow(new Date());
        schedule();
      }, 60000 - (Date.now() % 60000));
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);
  return (
    <span title="local time" className="tabular-nums">
      {CLOCK_CITIES.map((c, i) => (
        <React.Fragment key={c.city}>
          {i > 0 && " · "}
          {c.city} {clockFormat(c.zone).format(now)}
        </React.Fragment>
      ))}
    </span>
  );
};

// -------------------- MAIN COMPONENT -------------------- //

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Deep links: the browser scrolls to the fragment before React has rendered the
  // target, so a shared /#projects or /#detours link lands at the top. Scroll once
  // after the first render, instantly, so the section arrives without a long glide.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    target.scrollIntoView();
    root.style.scrollBehavior = previous;
  }, []);

  const copyEmailAddresses = async () => {
    const text = LINKS.email;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch { }
      document.body.removeChild(ta);
    }
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 1800);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    } else {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Keep iOS Safari chrome matched to the current theme
    const themeMeta = document.getElementById("theme-color-meta");
    if (themeMeta) {
      themeMeta.setAttribute("content", darkMode ? "#0f172a" : "#f8fafc");
    }
  }, [darkMode]);

  return (
    <div
      id="top"
      className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200"
    >
      {/* Skip link */}
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded-md focus:bg-accent focus:text-white dark:focus:text-slate-950 ${focusRing}`}
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/85 backdrop-blur">
        <div className="mx-auto max-w-[clamp(20rem,min(92vw,80rem),80rem)] px-4 py-3 flex items-center justify-between">
          <a
            href="#top"
            className={`flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity rounded-md ${focusRing}`}
          >
            {/* Route-line N: two stations joined by one line */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="flex-shrink-0"
            >
              <path
                d="M8 25 V7 L24 25 V7"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="25" r="3.5" strokeWidth="2.5" className="stroke-accent fill-white dark:fill-slate-900" />
              <circle cx="24" cy="7" r="3.5" strokeWidth="2.5" className="stroke-accent fill-white dark:fill-slate-900" />
            </svg>
            <span className="font-semibold tracking-tight truncate">
              Nishanth G Palaniswami
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden xl:flex rail:hidden items-center gap-4 text-sm" aria-label="Primary">
            {NAV_ITEMS.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`px-1 py-1 rounded hover:underline underline-offset-4 ${focusRing}`}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`hidden sm:inline-flex items-center justify-center h-11 w-11 md:h-9 md:w-9 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${focusRing}`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={darkMode}
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-amber-500" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" aria-hidden="true" />
              )}
            </button>

            <a
              href={LINKS.resume}
              target="_blank"
              rel="noreferrer"
              aria-label="Resume"
              className={`inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-11 md:h-9 w-11 sm:w-auto sm:px-4 text-sm font-medium hover:opacity-90 transition-opacity ${focusRing}`}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Resume</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className={`xl:hidden inline-flex items-center justify-center h-11 w-11 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${focusRing}`}
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav"
            >
              {mobileNavOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="xl:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          >
            <ul className="mx-auto max-w-[clamp(20rem,min(92vw,80rem),80rem)] px-4 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`block px-3 py-3 rounded-md text-base hover:bg-slate-100 dark:hover:bg-slate-800 ${focusRing}`}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
              <li className="mt-1 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-md text-base hover:bg-slate-100 dark:hover:bg-slate-800 ${focusRing}`}
                  aria-pressed={darkMode}
                >
                  <span className="flex items-center gap-2">
                    {darkMode ? (
                      <Sun className="h-4 w-4 text-amber-500" aria-hidden="true" />
                    ) : (
                      <Moon className="h-4 w-4 text-slate-600" aria-hidden="true" />
                    )}
                    {darkMode ? "Light mode" : "Dark mode"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {darkMode ? "on" : "off"}
                  </span>
                </button>
              </li>
            </ul>
          </nav>
        )}
        {/* Scroll progress where the rail does not fit */}
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-accent rail:hidden"
          style={{ scaleX: scrollYProgress }}
        />
      </header>

      <SectionRail items={NAV_ITEMS} />

      <main id="main" className="mx-auto max-w-[clamp(20rem,min(92vw,80rem),80rem)] px-4 py-12 md:py-20">
        {/* Hero */}
        <section aria-labelledby="hero-name" className="mx-auto max-w-[clamp(20rem,min(92vw,80rem),80rem)] grid md:grid-cols-5 gap-10 items-start">
          <div className="md:col-span-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20 font-mono">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  {!reduce && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {PROFILE.availability}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-medium border border-slate-300/60 dark:border-slate-700 font-mono">
                <BadgeCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                {PROFILE.authorization}
              </span>
            </div>

            <h1
              id="hero-name"
              className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] font-display"
            >
              {PROFILE.name}
            </h1>

            <p className="mt-3 text-xl md:text-2xl text-slate-800 dark:text-slate-200 font-medium">
              {PROFILE.role}
            </p>

            <p className="mt-5 text-base md:text-lg text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
              {PROFILE.thesis}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={LINKS.resume}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 h-11 md:h-10 text-sm font-medium hover:opacity-90 transition-opacity ${focusRing}`}
              >
                <FileText className="h-4 w-4" aria-hidden="true" /> Resume
              </a>
              <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 divide-x divide-slate-300 dark:divide-slate-700">
                <a
                  href={LINKS.emailCompose}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-l-lg px-4 h-11 md:h-10 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" /> Email
                </a>
                <button
                  type="button"
                  onClick={copyEmailAddresses}
                  aria-label={emailCopied ? "Email address copied" : "Copy email address to clipboard"}
                  aria-live="polite"
                  className={`inline-flex items-center justify-center rounded-r-lg h-11 md:h-10 w-11 md:w-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset ${emailCopied
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                  {emailCopied ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              <a
                href={LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-4 h-11 md:h-10 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${focusRing}`}
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn
              </a>
            </div>
          </div>

          {/* Visual anchor: the career route as a transit strip map */}
          <aside
            className="md:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
            aria-label="Career route"
          >
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono">
              <Route className="h-3 w-3" aria-hidden="true" /> Route
            </div>

            <RouteDiagram stops={ROUTE_STOPS} reduce={reduce} />

            <a
              href="#sail"
              className={`mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline underline-offset-4 rounded ${focusRing}`}
            >
              Open the case study <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </aside>
        </section>

        {/* About */}
        <Section
          id="about"
          title="About"
          kicker="background"
        >
          <div className="grid md:grid-cols-5 gap-8 items-start">
            <p className="md:col-span-3 text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
              {ABOUT}
            </p>
            <div className="md:col-span-2">
              <PhotoFigure photo={PHOTOS.about} ratio="aspect-[4/3]" />
              <ul className="mt-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex gap-2">
                  <GraduationCap className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" aria-hidden="true" />
                  <span>M.S. Computer Engineering · NYU · May 2026</span>
                </li>
                <li className="flex gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" aria-hidden="true" />
                  <span>Based in New York City · open to relocation</span>
                </li>
                <li className="flex gap-2">
                  <BadgeCheck className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" aria-hidden="true" />
                  <span>{PROFILE.authorization}</span>
                </li>
              </ul>
            </div>
          </div>

        </Section>

        {/* Education */}
        <Section
          id="education"
          title="Education"
          kicker="credentials"
        >
          <div className="space-y-6">
            {EDUCATION.map((ed, index) => (
              <article
                key={ed.school}
                className="grid md:grid-cols-5 gap-4 md:gap-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8"
              >
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3">
                    {ed.logo && (
                      <img
                        src={ed.logo}
                        alt=""
                        aria-hidden="true"
                        className="h-8 w-8 object-contain flex-shrink-0 dark:bg-white dark:rounded dark:p-0.5"
                      />
                    )}
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{ed.school}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" /> {ed.period}
                  </p>
                </div>
                <div className="md:col-span-3">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{ed.degree}</h3>
                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                    {ed.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section
          id="skills"
          title="Skills"
          kicker="what I work with"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {SKILLS.map((group) => {
              const Icon = group.icon;
              return (
                <article
                  key={group.group}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                    <h3 className="font-semibold tracking-tight">{group.group}</h3>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </Section>

        {/* SAIL - case study */}
        <Section
          id="sail"
          title="SAIL"
          kicker="case study"
        >
          <article
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-mono">
                  Software Engineer Intern · Sep 2025 – May 2026
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[11px] font-semibold uppercase tracking-wide border border-slate-300/60 dark:border-slate-700 font-mono">
                  Cornell Tech Runway–backed
                </span>
              </div>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight font-display">
                Global Trade Intelligence Platform
              </h3>
              <p className="mt-6 text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                SAIL builds trade-compliance software for importers: classifying products and
                calculating the duties they owe. As an engineer on its applied data platform I built the{" "}
                <strong className="text-slate-900 dark:text-slate-100">HTS revision engine</strong>{" "}
                (HTS is the Harmonized Tariff Schedule, the US catalog of tariff codes) and the
                in-house pipeline behind 5M+ tariff records across 166 HTS releases (2018–2026).
                Co-built the{" "}
                <strong className="text-slate-900 dark:text-slate-100">HTS classification model</strong>{" "}
                on top that maps a product description to the correct tariff code at inference
                time.
              </p>
            </div>

            {/* Metric strip - primary visual anchor */}
            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 md:gap-10">
              <div>
                <div className="text-5xl md:text-6xl font-bold tracking-tight font-display text-slate-900 dark:text-slate-100 tabular-nums">
                  5M<span className="text-accent">+</span>
                </div>
                <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono">
                  Tariff records versioned across 166 releases
                </div>
              </div>
              <div className="sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-8">
                <div className="text-5xl md:text-6xl font-bold tracking-tight font-display text-slate-900 dark:text-slate-100 tabular-nums">
                  166
                </div>
                <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono">
                  HTS releases tracked, Jan 2018 to May 2026
                </div>
              </div>
              <div className="sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-8">
                <div className="text-5xl md:text-6xl font-bold tracking-tight font-display text-slate-900 dark:text-slate-100 tabular-nums">
                  97<span className="text-accent">%</span>
                </div>
                <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono">
                  Scheduled runs completing without manual intervention
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono mb-3">
                  The problem
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  International-trade teams operate inside a 10,000-category tariff schedule that
                  changes every few weeks. Every revision shifts duty rates and product
                  classifications, but most teams don&rsquo;t know what changed, and most tools
                  either call external APIs per query or rely on manual lookup. Both are slow,
                  stale, and brittle.
                </p>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono mb-3">
                  The approach
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A deterministic revision engine (Python and SQL over SQLite and Parquet,
                  served through FastAPI) ingests and versions every HTS revision, surfaces
                  normalized changes between any two revisions, and powers downstream duty
                  calculation; golden tests, PyTest and GitHub Actions gate every release,
                  and the team&rsquo;s DuckDB and Supabase layer consumes the output. On top of that data layer, a co-built
                  classification model maps product descriptions to the right HTS code at
                  inference time. A &ldquo;Product DNA&rdquo; layer persists each classification
                  alongside the SKU it describes, so recurring products aren&rsquo;t
                  re-classified from scratch on every run.
                </p>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono mb-3">
                  The impact
                </div>
                <ul className="space-y-2 text-sm text-slate-800 dark:text-slate-200">
                  <li className="flex gap-2">
                    <span className="text-accent flex-shrink-0" aria-hidden="true">→</span>
                    <span>5M+ tariff records versioned; 166 HTS releases tracked (Jan 2018 to May 2026)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent flex-shrink-0" aria-hidden="true">→</span>
                    <span>A↔B HTS revision engine at ≥95% accuracy; 1000+ changes surfaced per release</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent flex-shrink-0" aria-hidden="true">→</span>
                    <span>97% of scheduled runs complete without manual intervention; golden tests and schema validation catch the rest</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent flex-shrink-0" aria-hidden="true">→</span>
                    <span>Co-built HTS classifier serving production traffic for international-trade customers</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid md:grid-cols-5 gap-6 md:gap-8 items-start">
              <div className="md:col-span-3">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono mb-2">
                  What I own
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                Owned the HTS revision engine end to end: schema, ingestion, 166-release
                history (2018–2026), golden tests, normalized change detection. Solely
                built the duty-calculation pipeline (Python, SQLite, Parquet, FastAPI)
                and the Product DNA store; co-built (with the CTO) the HTS classification
                model on top: training data curation, model, inference pipeline,
                evaluation loops.
                </p>
              </div>
              <PhotoFigure photo={PHOTOS.sail} ratio="aspect-[3/2]" className="md:col-span-2 max-w-[240px] md:justify-self-end" />
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Python · SQL · SQLite · Parquet · FastAPI · PyTest · GitHub Actions · DuckDB + Supabase (team platform) · R (validation harnesses)
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <a
                  href="https://sailgtx.ai"
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-accent transition-colors rounded ${focusRing}`}
                >
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> Visit product
                </a>
                <a
                  href="https://www.sailgtx.com/"
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-accent transition-colors rounded ${focusRing}`}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" /> Company
                </a>
              </div>
            </div>
          </article>
        </Section>

        {/* Experience */}
        <Section
          id="experience"
          title="Experience"
          kicker="roles"
        >
          <div className="space-y-6">
            {EXPERIENCE.map((exp, index) => exp.caseStudyHref ? (
              /* SAIL sits in the timeline as a pointer - the full case study is its own section above */
              <a
                key={exp.role + exp.company}
                href={exp.caseStudyHref}
                className={`block rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 md:p-5 hover:bg-white dark:hover:bg-slate-900 transition-colors ${focusRing}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-mono">
                      2025–26
                    </span>
                    <span className="text-sm md:text-base text-slate-900 dark:text-slate-100">
                      <strong className="font-semibold">{exp.role} @ {exp.company}</strong>
                      <span className="text-slate-600 dark:text-slate-400"> (see case study above)</span>
                    </span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-accent flex-shrink-0" aria-hidden="true" />
                </div>
              </a>
            ) : (
              <article
                key={exp.role + exp.company}
                className="grid md:grid-cols-5 gap-4 md:gap-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8"
              >
                <div className="md:col-span-2">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {exp.companyHref ? (
                      <a
                        href={exp.companyHref}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1 hover:text-accent transition-colors rounded ${focusRing}`}
                      >
                        {exp.company}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      exp.company
                    )}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" /> {exp.period}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {exp.location}
                  </p>
                  {exp.photo && <PhotoFigure photo={exp.photo} ratio="aspect-[4/3]" className="mt-5 max-w-sm" />}
                </div>
                <div className="md:col-span-3">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{exp.role}</h3>
                  {exp.impact && exp.impact.length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-sm text-slate-700 dark:text-slate-300 max-w-3xl">
                      {exp.impact.map((i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-accent flex-shrink-0" aria-hidden="true">→</span>
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {exp.stack && exp.stack.length > 0 && (
                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-mono max-w-3xl">
                      {exp.stack.join(" · ")}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section
          id="projects"
          title="Projects"
          kicker="selected work"
        >
          <div className="space-y-6">
            {PROJECTS.map((p, idx) => (
              <article
                key={p.title}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col"
              >
                {p.accolade && (
                  <span
                    className={
                      "self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide mb-3 font-mono " +
                      accoladeClasses(p.accolade.tone)
                    }
                  >
                    {p.accolade.tone === "violet" && (
                      <BookOpen className="h-3 w-3" aria-hidden="true" />
                    )}
                    {p.accolade.label}
                  </span>
                )}
                <h3 className="text-lg font-semibold tracking-tight font-display">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {p.summary}
                </p>

                <ul className="mt-4 space-y-1.5 text-sm text-slate-800 dark:text-slate-200">
                  {p.impact.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-accent flex-shrink-0" aria-hidden="true">→</span>
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>

                {p.widget === "guardrails" && <GuardrailPlayground />}

                <p className="mt-5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {p.stackLine}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 text-sm">
                  {p.links?.product && (
                    <a
                      href={p.links.product}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-accent transition-colors rounded ${focusRing}`}
                    >
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> Product
                    </a>
                  )}
                  {p.links?.site && (
                    <a
                      href={p.links.site}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-accent transition-colors rounded ${focusRing}`}
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" /> Company
                    </a>
                  )}
                  {p.links?.github && (
                    <a
                      href={p.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-accent transition-colors rounded ${focusRing}`}
                    >
                      <Github className="h-4 w-4" aria-hidden="true" /> Code
                    </a>
                  )}
                  {p.links?.demo && (
                    <a
                      href={p.links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-accent transition-colors rounded ${focusRing}`}
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" /> Demo
                    </a>
                  )}
                  {p.links?.insta && (
                    <a
                      href={p.links.insta}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-accent transition-colors rounded ${focusRing}`}
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" /> Page
                    </a>
                  )}
                  {p.links?.ppt && (
                    <a
                      href={p.links.ppt}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-accent transition-colors rounded ${focusRing}`}
                    >
                      <FileText className="h-4 w-4" aria-hidden="true" /> Slides
                    </a>
                  )}
                  {p.links?.ieee && (
                    <a
                      href={p.links.ieee}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-accent transition-colors rounded ${focusRing}`}
                    >
                      <BookOpen className="h-4 w-4" aria-hidden="true" /> IEEE Paper
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* Publications */}
        <Section
          id="publications"
          title="Publications"
          kicker="peer-reviewed"
        >
          <div className="grid gap-6">
            {PUBLICATIONS.map((pub) => (
              <article
                key={pub.title}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8"
              >
                <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-mono">
                  {pub.venue}
                </div>
                <h3 className="mt-2 text-lg md:text-xl font-semibold tracking-tight font-display">
                  {pub.title}
                </h3>
                <p className="mt-3 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                  {pub.summary}
                </p>
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 text-sm">
                  {pub.links?.ieee && (
                    <a
                      href={pub.links.ieee}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-accent transition-colors rounded ${focusRing}`}
                    >
                      <BookOpen className="h-4 w-4" aria-hidden="true" /> Read on IEEE Xplore
                    </a>
                  )}
                  {pub.links?.github && (
                    <a
                      href={pub.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-accent transition-colors rounded ${focusRing}`}
                    >
                      <Github className="h-4 w-4" aria-hidden="true" /> Code
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Section>

      </main>

      <DetoursBand notes={HOBBIES} reduce={reduce} dark={darkMode} />

      {/* Contact - full-bleed dark closing moment, breaks the white-card rhythm */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="scroll-mt-24 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800"
      >
        <div className="mx-auto max-w-[clamp(20rem,min(92vw,80rem),80rem)] px-4 py-20 md:py-28">
          <div className="flex items-center gap-2.5">
            <StationDot fill="bg-slate-100 dark:bg-slate-950" />
            <p className="text-xs uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 font-mono">get in touch</p>
          </div>
          <h2
            id="contact-heading"
            className="mt-2 mb-10 text-2xl md:text-3xl font-semibold tracking-tight font-display text-slate-900 dark:text-white"
          >
            Contact
          </h2>

          <div>
            <div className="flex flex-wrap items-baseline gap-3 sm:gap-4">
              <a
                href={LINKS.emailCompose}
                target="_blank"
                rel="noreferrer"
                className={`inline-block text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white hover:text-accent transition-colors break-all md:break-normal rounded font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-slate-950`}
              >
                {LINKS.email}
              </a>
              <button
                type="button"
                onClick={copyEmailAddresses}
                aria-label={emailCopied ? "Email address copied" : "Copy email address to clipboard"}
                aria-live="polite"
                className={`inline-flex items-center justify-center h-11 md:h-10 w-11 md:w-10 rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-slate-950 ${emailCopied
                  ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                  : "border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500 hover:bg-white dark:hover:bg-slate-900"
                  }`}
              >
                {emailCopied ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>

            <p className="mt-8 max-w-2xl text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Open to full-time AI engineering and software roles across agents, data, and
              backend. Happy to chat about agentic systems, audit-ready data pipelines, or
              making models behave reliably in production.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={LINKS.resume}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 h-11 md:h-10 text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-slate-950`}
              >
                <FileText className="h-4 w-4" aria-hidden="true" /> Resume
              </a>
              <a
                href={LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-4 h-11 md:h-10 text-sm hover:bg-white dark:hover:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-slate-950`}
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn
              </a>
              <a
                href={LINKS.github}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-4 h-11 md:h-10 text-sm hover:bg-white dark:hover:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-slate-950`}
              >
                <Github className="h-4 w-4" aria-hidden="true" /> GitHub
              </a>
            </div>

          </div>
        </div>
      </section>

      <footer className="bg-slate-100 dark:bg-slate-950 text-slate-500 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-[clamp(20rem,min(92vw,80rem),80rem)] px-4 py-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs font-mono">
          <span>
            © {new Date().getFullYear()} Nishanth G Palaniswami
            <span className="text-slate-400 dark:text-slate-600"> · built solo · React + Vite + Tailwind</span>
          </span>
          <LocalClock />
          <a
            href="#top"
            className={`hover:text-accent rounded px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-slate-950`}
          >
            back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
