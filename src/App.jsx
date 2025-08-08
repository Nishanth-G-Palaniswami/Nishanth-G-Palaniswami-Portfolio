
import React, { useMemo, useState } from "react";
import { Mail, ExternalLink, Github, Linkedin, FileText, Filter, Globe, Server, Cloud, Cpu, Layers, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Nishanth G. Palaniswami — One-file React portfolio
 * Tailwind CSS required. Uses lucide-react icons + framer-motion.
 *
 * How to use:
 * 1) Drop this file in a React/Next.js app and set it as a page or component.
 * 2) Make sure Tailwind is enabled. (https://tailwindcss.com/docs/guides/create-react-app)
 * 3) Replace PROFILE, LINKS, and PROJECTS data below.
 */

// -------------------- CONFIG -------------------- //
const PROFILE = {
  name: "Nishanth G. Palaniswami",
  tagline: "Machine Learning & Cloud Engineer | AWS | Data | Community Builder",
  University: "New York University",
  location: "New York, NY",
  graduation: "Spring 2026",
  workAuth: "3 years U.S. work authorization post‑graduation (OPT + STEM OPT)",
  summary:
    "MS in Computer Engineering at NYU focused on ML, data, and cloud. I build end‑to‑end systems: data pipelines → training → deployment on AWS. I also lead with community—grew a university club radio hub by 3,000+ followers via strategic content and creator collaborations.",
};

const LINKS = {
  email: "ng3124@nyu.edu",
  github: "https://github.com/Nishanth-G-Palaniswami",
  linkedin: "https://www.linkedin.com/in/nishanth-g-palaniswami",
  resume: "https://bit.ly/nishanthresume",
};

const SKILLS = {
  coreCloud: [
    "Amazon SageMaker",
    "Amazon S3",
    "EC2",
    "AWS Lambda",
    "AWS Glue",
    "Athena",
    "CloudWatch",
    "CloudFormation",
    "IAM",
    "API Gateway",
    "DynamoDB",
  ],
  mlAi: [
    "PyTorch",
    "TensorFlow / Keras",
    "scikit-learn",
    "Hugging Face (NLP)",
    "OpenCV",
    "Pandas",
    "NumPy",
    "Matplotlib / Seaborn",
  ],
  bigData: ["Apache Spark", "(optional) Apache Airflow", "(optional) Kafka"],
  programming: ["Python", "Django", "FastAPI", "MATLAB", "HTML/CSS/JS"],
  databases: ["PostgreSQL", "ElasticSearch", "Tableau", "Google Analytics", "Athena"],
  interests: ["MLOps", "LangChain", "API Mesh", "Kubernetes", "Microservices"],
};

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "ml", label: "ML/AI" },
  { key: "cloud", label: "Cloud/AWS" },
  { key: "data", label: "Big Data" },
  { key: "leadership", label: "Leadership" },
  { key: "creative", label: "Creative" },
];

const PROJECTS = [
  {
    title: "Drug–Target Interaction & Side‑Effects (Multi‑Modal, Multi‑Task)",
    category: ["ml"],
    summary:
      "Built a multi‑modal (SMILES sequences + 2D molecular images) and multi‑task pipeline to jointly predict DTI (pKI regression) and side‑effects (multi‑label). Used ProtBERT for protein embeddings and RDKit for cheminformatics.",
    stack: ["PyTorch", "Hugging Face", "RDKit", "SageMaker", "S3"],
    impact: ["End‑to‑end, reproducible notebooks", "Joint training & evaluation scripts"],
    links: { github: "#", demo: "#" },
  },
  {
    title: "MetroScan — NYC Subway Big Data Analytics",
    category: ["data", "ml"],
    summary:
      "Ingested and analyzed ~5M hourly ridership records (2020–2024) to model demand patterns, cluster stations, and detect anomalies; trained linear/RandomForest/GBT models as delay proxies.",
    stack: ["PySpark", "Athena", "S3", "Spark MLlib", "Tableau"],
    impact: ["~5M rows processed", "Station typologies via KMeans", "Rolling anomaly detection"],
    links: { github: "https://github.com/Nishanth-G-Palaniswami/MetroScan-NYC-Subway-Ridership-and-Delay-Detection", demo: "https://colab.research.google.com/drive/1VbhLZuXFlg1NgOVsxAKEhIlwHzWL-WXS?usp=sharing" },
  },
  {
    title: "ASL Recognition (CV + Temporal Smoothing)",
    category: ["ml"],
    summary:
      "Prototyped sign recognition with data augmentation and temporal smoothing; exported for edge‑friendly formats (TorchScript/TFLite).",
    stack: ["PyTorch", "OpenCV", "TensorFlow"],
    impact: ["Deployable model artifacts", "Baseline‑beating prototype"],
    links: { github: "https://github.com/Nishanth-G-Palaniswami/english-asl", 'IEEE Publication': "https://ieeexplore.ieee.org/document/10725877" },
  },
  {
    title: "MLOps for Agri Drones — Crop Health Inference API",
    category: ["cloud", "ml"],
    summary:
      "Deployed inference on SageMaker; automated ingest from S3 via Lambda; monitoring with CloudWatch; exposed via API Gateway for downstream apps.",
    stack: ["SageMaker", "S3", "Lambda", "CloudWatch", "API Gateway"],
    impact: ["Reduced manual review time", "Scalable real‑time endpoint"],
    links: { github: "#", demo: "#" },
  },
  {
    title: "University Club Radio Hub Growth (+3,000)",
    category: ["leadership", "creative"],
    summary:
      "Led content strategy and creator ops for a university club radio hub; managed 15+ collaborations and grew the audience by 3,000+ followers.",
    stack: ["Strategy", "Analytics", "Canva/PS", "Scheduling"],
    impact: ["+3,000 followers", "15+ creator partnerships"],
    links: { demo: "#" },
  },
  {
    title: "E‑commerce SEO Rollouts (15+ sites)",
    category: ["data"],
    summary:
      "Launched and optimized 15+ storefronts; improved organic traffic ~20% through technical SEO, analytics, and content experiments.",
    stack: ["GA4", "Ahrefs", "Screaming Frog", "PostgreSQL"],
    impact: ["~20% organic lift", "Funnel insights"],
    links: { demo: "#" },
  },
];

// -------------------- UI HELPERS -------------------- //
const Section = ({ id, title, icon, children }) => (
  <section id={id} className="scroll-mt-24 py-10 md:py-14">
    <div className="flex items-center gap-3 mb-6">
      {icon}
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
    </div>
    {children}
  </section>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-white/60 backdrop-blur border-black/10">
    {children}
  </span>
);

const Card = ({ children }) => (
  <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
    <div className="p-5 md:p-6">{children}</div>
  </div>
);

// -------------------- MAIN COMPONENT -------------------- //
export default function Portfolio() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      const inCat = filter === "all" || p.category.includes(filter);
      const inText = !q
        ? true
        : [p.title, p.summary, ...(p.stack || []), ...(p.impact || [])]
            .join(" ")
            .toLowerCase()
            .includes(q);
      return inCat && inText;
    });
  }, [query, filter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6" />
            <span className="font-semibold">{PROFILE.name.split(" ")[0]} · Portfolio</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#projects" className="hover:underline">Projects</a>
            <a href="#skills" className="hover:underline">Skills</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
          <a
            href={LINKS.resume}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-black text-white px-4 py-2 text-sm hover:opacity-90"
          >
            <FileText className="h-4 w-4" /> Resume
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              {PROFILE.name}
            </h1>
            <p className="mt-3 text-lg text-slate-700">{PROFILE.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {/* University first, with logo */}
              <Badge>
                <img src="/nyu-logo.png" alt="NYU" className="h-3.5 w-3.5 mr-1 rounded-sm" />
                {PROFILE.University}
              </Badge>
            
              {/* Location */}
              <Badge>
                <Globe className="h-3.5 w-3.5 mr-1" /> {PROFILE.location}
              </Badge>
            
              {/* Graduation & Work Auth */}
              <Badge><Cpu className="h-3.5 w-3.5 mr-1" /> Grad: {PROFILE.graduation}</Badge>
              <Badge><Cloud className="h-3.5 w-3.5 mr-1" /> {PROFILE.workAuth}</Badge>
            </div>
            <p className="mt-6 text-slate-700 max-w-2xl">{PROFILE.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 hover:shadow">
                <Linkedin className="h-4 w-4"/> LinkedIn
              </a>
              <a href={LINKS.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 hover:shadow">
                <Github className="h-4 w-4"/> GitHub
              </a>
              <a href={`mailto:${LINKS.email}`} className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 hover:shadow">
                <Mail className="h-4 w-4"/> Email
              </a>
              <a href={LINKS.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 hover:shadow">
                <FileText className="h-4 w-4"/> View Resume
              </a>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur p-8 shadow-sm"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gradient-to-br from-indigo-200 to-indigo-50 p-4">
                <div className="text-sm font-semibold">AWS</div>
                <ul className="mt-2 text-sm text-slate-700 space-y-1 list-disc list-inside">
                  {SKILLS.coreCloud.slice(0,6).map((s) => (<li key={s}>{s}</li>))}
                </ul>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-emerald-200 to-emerald-50 p-4">
                <div className="text-sm font-semibold">ML / AI</div>
                <ul className="mt-2 text-sm text-slate-700 space-y-1 list-disc list-inside">
                  {SKILLS.mlAi.slice(0,6).map((s) => (<li key={s}>{s}</li>))}
                </ul>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-200 to-amber-50 p-4">
                <div className="text-sm font-semibold">Big Data</div>
                <ul className="mt-2 text-sm text-slate-700 space-y-1 list-disc list-inside">
                  {SKILLS.bigData.map((s) => (<li key={s}>{s}</li>))}
                </ul>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-pink-200 to-pink-50 p-4">
                <div className="text-sm font-semibold">Programming</div>
                <ul className="mt-2 text-sm text-slate-700 space-y-1 list-disc list-inside">
                  {SKILLS.programming.map((s) => (<li key={s}>{s}</li>))}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">* Full skills below</p>
          </motion.div>
        </section>

        {/* Projects */}
        <Section id="projects" title="Projects" icon={<Layers className="h-6 w-6"/>}>
          <Card>
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
              <div className="flex flex-wrap gap-2 items-center">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setFilter(c.key)}
                    className={`px-3 py-1 rounded-full text-sm border transition ${
                      filter === c.key
                        ? "bg-black text-white border-black"
                        : "bg-white border-black/10 hover:bg-slate-50"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="md:ml-auto relative max-w-md w-full">
                <Filter className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects, stacks, impacts…"
                  className="w-full rounded-xl border border-black/10 bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
            </div>
          </Card>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {filtered.map((p, idx) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                <Card>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <p className="text-sm text-slate-700">{p.summary}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {p.stack.map((s) => (
                        <Badge key={s}>{s}</Badge>
                      ))}
                    </div>
                    {p.impact?.length ? (
                      <ul className="mt-2 text-sm text-slate-700 list-disc list-inside">
                        {p.impact.map((i) => (
                          <li key={i}>{i}</li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="mt-3 flex gap-3">
                      {p.links?.github && (
                        <a href={p.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-700 hover:underline">
                          <Github className="h-4 w-4"/> Code
                        </a>
                      )}
                      {p.links?.demo && (
                        <a href={p.links.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-700 hover:underline">
                          <ExternalLink className="h-4 w-4"/> Demo
                        </a>
                      )}
                      {p.links?.ieee && (
                        <a
                          href={p.links.ieee}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-indigo-700 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" /> IEEE Publication
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section id="skills" title="Skills (Ranked)" icon={<Server className="h-6 w-6"/>}>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h4 className="font-semibold">Cloud & AWS (Core)</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {SKILLS.coreCloud.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </Card>
            <Card>
              <h4 className="font-semibold">ML & AI</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {SKILLS.mlAi.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </Card>
            <Card>
              <h4 className="font-semibold">Big Data & Distributed</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {SKILLS.bigData.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </Card>
            <Card>
              <h4 className="font-semibold">Programming & Frameworks</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {SKILLS.programming.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </Card>
            <Card>
              <h4 className="font-semibold">Databases & Analytics</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {SKILLS.databases.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </Card>
            <Card>
              <h4 className="font-semibold">Professional Interests</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {SKILLS.interests.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        {/* About */}
        <Section id="about" title="About" icon={<Sparkles className="h-6 w-6"/>}>
          <Card>
            <p className="text-slate-700 leading-relaxed">
              I’m pursuing an MS in Computer Engineering at NYU (graduating Spring 2026). My focus is
              applied machine learning and cloud: I enjoy turning large datasets into deployable models and
              shipping them on AWS. I care about community and communication—leading a university club
              radio hub taught me cross‑functional collaboration, content operations, and data‑informed growth.
            </p>
          </Card>
        </Section>

        {/* Contact */}
        <Section id="contact" title="Contact" icon={<Mail className="h-6 w-6"/>}>
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${LINKS.email}`} className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 hover:shadow">
                <Mail className="h-4 w-4"/> {LINKS.email}
              </a>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 hover:shadow">
                <Linkedin className="h-4 w-4"/> LinkedIn
              </a>
              <a href={LINKS.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 hover:shadow">
                <Github className="h-4 w-4"/> GitHub
              </a>
              <a href={LINKS.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 hover:shadow">
                <FileText className="h-4 w-4"/> Resume
              </a>
            </div>
          </Card>
        </Section>
      </main>

      <footer className="border-t border-black/10 bg-white/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} {PROFILE.name}. Built with React + Tailwind.
        </div>
      </footer>
    </div>
  );
}
