import React, { useState, useEffect } from "react";
import {
  ExternalLink, Github, Linkedin, FileText, Menu, X,
  BookOpen, Sun, Moon, Calendar, MapPin, ArrowUpRight,
  Cpu, Database, Cloud, Code2, GraduationCap, Route, Mail,
  Copy, Check,
} from "lucide-react";

import { motion, useReducedMotion } from "framer-motion";

const PROFILE = {
  name: "Nishanth G Palaniswami",
  role: "AI Engineer · LLM Agents & Data Pipelines",
  thesis:
    "I build agentic AI systems and audit-ready data pipelines, and the tests that keep them honest. NYU MSCE '26 · AI Engineer @ got2eat · previously SAIL GTX. Open to full-time roles now.",
  availability: "Actively seeking full-time roles",
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

const SKILLS = [
  {
    group: "ML & AI",
    icon: Cpu,
    items: [
      "PyTorch", "Scikit-learn", "Pandas", "NumPy", "LLMs / RAG / GenAI",
      "Agents / MCP / Claude Agent SDK",
      "NLP", "Transformers (Hugging Face)", "LoRA / PEFT",
    ],
  },
  {
    group: "Data & Infrastructure",
    icon: Database,
    items: [
      "PySpark", "Dagster / dbt", "Supabase / PostgreSQL", "SQLite", "DuckDB",
      "Parquet / pyarrow", "FastAPI", "Django", "Deno / Node.js", "REST APIs", "React",
      "MapLibre GL / GTFS",
    ],
  },
  {
    group: "Languages",
    icon: Code2,
    items: ["Python", "SQL", "JavaScript (ES6+)", "TypeScript", "R", "HTML / CSS", "Git"],
  },
  {
    group: "Cloud & MLOps",
    icon: Cloud,
    items: [
      "AWS S3 / EC2 / CloudWatch (deployments)",
      "Observability", "CI/CD (GitHub Actions)",
      "Golden tests", "PyTest", "Schema validation",
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
    company: "Got2eat (Base44 Accelerator Runner-Up)",
    companyHref: "https://got2eat.site",
    period: "August 2026 – Present",
    location: "Remote · New York, NY",
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

// -------------------- MAIN COMPONENT -------------------- //

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const reduce = useReducedMotion();

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
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="flex-shrink-0"
            >
              <circle
                cx="16"
                cy="16"
                r="15"
                fill="currentColor"
                className="text-white dark:text-slate-900"
                stroke="currentColor"
              />
              <path
                d="M8 8 L8 24 L12 24 L20 12 L20 24 L24 24 L24 8 L20 8 L12 20 L12 8 Z"
                className="fill-current"
              />
            </svg>
            <span className="font-semibold tracking-tight truncate">
              Nishanth G Palaniswami
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm" aria-label="Primary">
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
              className={`md:hidden inline-flex items-center justify-center h-11 w-11 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${focusRing}`}
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
            className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
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
      </header>

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
            <aside className="md:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono">
                Quick facts
              </div>
              <ul className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex gap-2">
                  <GraduationCap className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" aria-hidden="true" />
                  <span>M.S. Computer Engineering · NYU · May 2026</span>
                </li>
                <li className="flex gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" aria-hidden="true" />
                  <span>Based in New York City · open to relocation</span>
                </li>
              </ul>
            </aside>
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
                Engineer on SAIL&rsquo;s applied data platform. Built the{" "}
                <strong className="text-slate-900 dark:text-slate-100">HTS revision engine</strong>{" "}
                and in-house pipeline behind 5M+ tariff records across 166 HTS releases (2018–2026).
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
                  Tariff records indexed
                </div>
              </div>
              <div className="sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-8">
                <div className="text-5xl md:text-6xl font-bold tracking-tight font-display text-slate-900 dark:text-slate-100 tabular-nums">
                  166
                </div>
                <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono">
                  HTS releases tracked (2018–2026)
                </div>
              </div>
              <div className="sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-8">
                <div className="text-5xl md:text-6xl font-bold tracking-tight font-display text-slate-900 dark:text-slate-100 tabular-nums">
                  97<span className="text-accent">%</span>
                </div>
                <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono">
                  Pipeline reliability
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
                  A deterministic revision engine ingests and versions every HTS revision
                  (DuckDB + Supabase, backed by golden tests + PyTest + GitHub Actions),
                  surfaces normalized changes between any two revisions, and powers
                  downstream duty calculation. On top of that data layer, a co-built
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
                    <span>5M+ tariff records indexed; 166 HTS releases tracked (Jan 2018 → May 2026)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent flex-shrink-0" aria-hidden="true">→</span>
                    <span>A↔B HTS revision engine at ≥95% accuracy; 1000+ changes surfaced per release</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent flex-shrink-0" aria-hidden="true">→</span>
                    <span>97% pipeline reliability end-to-end via golden tests + schema validation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent flex-shrink-0" aria-hidden="true">→</span>
                    <span>Co-built HTS classifier serving production traffic for international-trade customers</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
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

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Python · SQL · R · FastAPI · Supabase · DuckDB · Railway · PyTest · GitHub Actions
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

      {/* Contact - full-bleed dark closing moment, breaks the white-card rhythm */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="on-dark scroll-mt-24 bg-slate-950 text-slate-100 border-t border-slate-800"
      >
        <div className="mx-auto max-w-[clamp(20rem,min(92vw,80rem),80rem)] px-4 py-20 md:py-28">
          <div className="flex items-center gap-2.5">
            <StationDot fill="bg-slate-950" />
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-mono">get in touch</p>
          </div>
          <h2
            id="contact-heading"
            className="mt-2 mb-10 text-2xl md:text-3xl font-semibold tracking-tight font-display text-white"
          >
            Contact
          </h2>

          <div>
            <div className="flex flex-wrap items-baseline gap-3 sm:gap-4">
              <a
                href={LINKS.emailCompose}
                target="_blank"
                rel="noreferrer"
                className={`inline-block text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white hover:text-accent transition-colors break-all md:break-normal rounded font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
              >
                {LINKS.email}
              </a>
              <button
                type="button"
                onClick={copyEmailAddresses}
                aria-label={emailCopied ? "Email address copied" : "Copy email address to clipboard"}
                aria-live="polite"
                className={`inline-flex items-center justify-center h-11 md:h-10 w-11 md:w-10 rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${emailCopied
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                  : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-900"
                  }`}
              >
                {emailCopied ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>

            <p className="mt-8 max-w-2xl text-base md:text-lg text-slate-300 leading-relaxed">
              Open to full-time AI engineering and software roles across agents, data, and
              backend. Happy to chat about agentic systems, audit-ready data pipelines, or
              making models behave reliably in production.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={LINKS.resume}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-lg bg-white text-slate-900 px-4 h-11 md:h-10 text-sm font-medium hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
              >
                <FileText className="h-4 w-4" aria-hidden="true" /> Resume
              </a>
              <a
                href={LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-lg border border-slate-700 text-slate-200 px-4 h-11 md:h-10 text-sm hover:bg-slate-900 hover:border-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn
              </a>
              <a
                href={LINKS.github}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-lg border border-slate-700 text-slate-200 px-4 h-11 md:h-10 text-sm hover:bg-slate-900 hover:border-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
              >
                <Github className="h-4 w-4" aria-hidden="true" /> GitHub
              </a>
            </div>

          </div>
        </div>
      </section>

      <footer className="on-dark bg-slate-950 text-slate-500 border-t border-slate-800">
        <div className="mx-auto max-w-[clamp(20rem,min(92vw,80rem),80rem)] px-4 py-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs font-mono">
          <span>
            © {new Date().getFullYear()} Nishanth G Palaniswami
            <span className="text-slate-600"> · built solo · React + Vite + Tailwind</span>
          </span>
          <a
            href="#top"
            className={`hover:text-accent rounded px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
          >
            back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
