
import React, { useMemo, useState, useEffect } from "react";
import {
  Mail, ExternalLink, Github, Linkedin, FileText, Filter, Globe, Server, Cloud,
  Cpu, Layers, Sparkles, BookOpen, Sun, Moon, Building2, Calendar, MapPin
} from "lucide-react";

import { motion } from "framer-motion";


/**
 * Nishanth G. Palaniswami — React + Tailwind CSS Portfolio
 * Built with lucide-react icons & framer-motion animations.
 *
 * For anyone viewing or modifying this portfolio:
 * 
 * SETUP INSTRUCTIONS:
 * 1. This is a self-contained React component — drop it into any React or Next.js project
 * 2. Ensure Tailwind CSS is installed and configured: https://tailwindcss.com/docs/guides/create-react-app
 * 3. Install required dependencies: npm install lucide-react framer-motion
 * 4. Update the PROFILE, LINKS, and PROJECTS objects below with your information
 * 5. Customize colors, animations, and layout as needed
 *
 * CUSTOMIZATION:
 * - Modify PROFILE object for personal information
 * - Update PROJECTS array with your projects
 * - Adjust LINKS object for your social media and resume
 * - Customize SKILLS object to match your expertise
 * - Modify CATEGORIES array for project filtering
 *
 * Author: Nishanth G. Palaniswami
 * License: MIT (feel free to use and modify)
 */

const PROFILE = {
  name: "Nishanth G. Palaniswami",
  tagline: "Machine Learning & Cloud Engineer | AWS | Data | Community Builder",
  University: "New York University",
  location: "New York City, NY",
  graduation: "Spring 2026",
  workAuth: "3 years U.S. work authorization post‑graduation (OPT + STEM OPT)",
  summary:
    "Hey there! I’m Nishanth — a Computer Engineering master’s student at NYU who turns massive datasets into real-world impact. From crafting machine learning models to deploying them in the cloud, I love building end-to-end systems that actually solve problems. Beyond the code, I’m a community builder, event organizer, and believer that tech should be as collaborative as it is powerful. Let’s create something game-changing together!",
};

const LINKS = {
  email: "ng3124@nyu.edu",
  github: "https://github.com/Nishanth-G-Palaniswami",
  linkedin: "https://www.linkedin.com/in/nishanth-g-palaniswami",
  resume: "https://drive.google.com/file/d/1xSsXeuJOPBaVGLctq1r0azfFToLEzv9L/view?usp=sharing",
};


const EXPERIENCE = [
  {
    "role": "Software Engineer Intern",
    "company": "SAIL GTX (Cornell Tech Runway Startup)",
    "period": "September 2024 – Present",
    "location": "New York City, NY",
    "impact": [
      "Building an AI-native trade compliance intelligence system that tracks and analyzes updates in the U.S. Harmonized Tariff Schedule (HTS) and CROSS rulings for duty and classification insights",
      "Developed a deterministic JSON→OPLOG→CSV diff engine that detects textual, rate, and structural changes across HTS revisions with 99% reproducibility",
      "Engineered ETL pipelines for ingestion, parsing, and normalization of official HTS datasets with schema validation, provenance hashing, and automated reproducibility gates",
      "Designed REST APIs and CLI utilities for diff queries, report exports, and revision management; integrated Airflow and GitHub Actions for automated orchestration and QA"
    ],
    "stack": [
      "React", "Python", "SQL", "AWS S3", "AWS EC2", "OpenSearch",
      "Airflow", "GitHub Actions", "Git LFS", "Pandas", "JSON", "CSV",
      "OPLOG", "CLI Tools", "REST API"
  ]
 },
  {
    role: "Software Engineer Intern",
    company: "Tagwebs Technologies",
    period: "April 2023 – May 2024",
    location: "Remote",
    impact: [
      "Built 15+ full-stack web projects using Python, Django, HTML, CSS, and JavaScript — including Edliy.com, an EdTech platform, supporting the launch of 40+ STEM modules and onboarding 500+ users in 90 days",
      "Deployed backend systems on AWS EC2/S3 and integrated CloudWatch to track application performance",
      "Optimized pipelines to improve deployment efficiency, driving a 12% productivity gain",
      ],
     stack: ["Python", "Django", "HTML", "CSS", "JavaScript", "AWS EC2/S3", "CloudWatch"],
  },
  {
    role: "Software Engineer Intern - ML & IoT",
    company: "Vaayusastra Aerospace (IIT Madras RTBI)",
    period: "February 2023 – March 2023",
    location: "Chennai, India",
    impact: [
      "Spearheaded a responsive Mobile dashboard and UI using React & Javascript for an automated irrigation and agricultural drone system",
      "Solved IoT sensor data pipelines using ESP32 microcontrollers and wireless modules",
      "Preprocessed real-time sensor data and streamlined ML pipelines to optimize irrigation schedules",
    ],
    stack: ["React", "Javascript", "ESP32", "PyTorch", "Scikit-learn"],
    
  },
  {
    role: "Research Intern",
    company: "GaiT Watch, PSG CARE (Center for Academic Research and Excellence)",
    period: "December 2021 – January 2022",
    location: "Coimbatore, India",
    impact: [
       "Engineered the GaitWatch product website using Python, Django, HTML & CSS, revamped the brand identity using Photoshop and Procreate, and generated real-time data collection from 450+ participants during early clinical trials",
      "Preprocessed and structured gait data to assist ML research team in refining fall-risk prediction models",
      "Validated mobile app UX through user trials, contributing to commercial rollout funded by PSG College of Technology",
    ],
    stack: ["Python", "Django", "HTML", "CSS", "Photoshop", "Procreate", "Pandas"],
    
  },
];


const SKILLS = {
  coreCloud: [
    "Amazon SageMaker",
    "Amazon Bedrock",
    "Amazon S3",
    "EC2",
    "AWS Lambda",
    "CloudWatch",
  ],
  mlAi: [
    "PyTorch",
    "scikit-learn",
    "Hugging Face (NLP)",
    "OpenCV",
    "Pandas",
    "NumPy",
    "Matplotlib / Seaborn",
    "Agentic AI"
  ],
  programming: ["Python", "Django", "FastAPI", "JavaScript"],
  databases: ["SQL", "Tableau", "Google Analytics", "Athena"],
  interests: ["Open-source ML projects", "data-driven applications", "Cloud deployment"],
  uiUx: ["Figma", "Procreate", "Photoshop", "HTML/CSS", "Tailwind CSS", "React"],
  softSkills: ["Microsoft Excel", "Microsoft Word", "PowerPoint", "Project Management", "Team Leadership", "Communication", "Problem Solving", "Data Analysis"],
};

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "ml", label: "ML/AI" },
  { key: "data", label: "Big Data" },
  { key: "leadership", label: "Leadership" },
  { key: "creative", label: "Creative" },
];

const PROJECTS = [
  {
    title: "Drug–Target Interaction & Side‑Effects (Multi‑Modal, Multi‑Task)",
    category: ["leadership","ml"],
    summary:
      "End-to-end multi-task learning framework combining CNNs for 2D drug structure images, Transformer encoders for SMILES strings, and ProtBERT embeddings for protein sequences to predict binding affinities (pKI) and adverse side effects. integrated SMILES canonicalization & augmentation via RDKit and dual-dataloader strategy using BindingDB & SIDER datasets.",
    stack: [
      "PyTorch",
      "Hugging Face Transformers",
      "ProtBERT",
      "RDKit",
      "AWS SageMaker",
      "Amazon S3",
    ],
    impact: [
      "F1 score ↑92% for side-effect classification",
      "Joint training reduced inference time by 30%",
      "Gradient conflict analysis improved multi-task stability",
    ],
    links: { github: "https://github.com/Nishanth-G-Palaniswami/Multi-Modal-Deep-Learning-for-Joint-Prediction-of-Drug-Target-Interaction-and-Side-Effects.git",
       ppt: "https://docs.google.com/presentation/d/1hXOH0fBqxfF33P-VlMnFsEevn2IKBg7NmSnFfXH_Ftc/edit?usp=sharing",   
      },
  },
  {
    title: "MetroScan — NYC Subway Big Data Analytics",
    category: ["leadership","data", "ml"],
    summary:
      "Scalable PySpark pipeline analyzing ~5M hourly ridership records (2020–2024) from the MTA. Modeled delay-like patterns via Linear, Random Forest, and Gradient Boosted Trees, clustered stations by usage profiles, and detected anomalies using statistical Z-scores.",
    stack: [
      "PySpark 3.3.2 (Hadoop 3)",
      "Spark MLlib",
      "Google Colab",
      "Matplotlib",
      "Seaborn",
      "Parquet"
    ],
    impact: [
      "Processed ~5M records at hourly granularity",
      "Found 8 AM/5 PM peaks and post-COVID recovery",
      "Clustered stations with PCA+KMeans into usage typologies",
      "RMSE ≈ 104 for GBT model predicting delay proxies",
      "Rolling window anomaly detection flagged disruption events"
    ],
    links: {
      github: "https://github.com/Nishanth-G-Palaniswami/MetroScan-NYC-Subway-Ridership-and-Delay-Detection",
      demo: "https://colab.research.google.com/drive/1VbhLZuXFlg1NgOVsxAKEhIlwHzWL-WXS?usp=sharing",
      ppt: "https://docs.google.com/presentation/d/1o2ho5Qf1a4Axyc0mWregmTxmuISYSep_uROid4kJ_xI/edit?usp=sharing",  
    },
  },
  {
    title: "American Sign Language Alphabet Recognition",
    category: ["ml", "cv"],
    summary: "Developed an ASL recognition model integrating CNN-based image classification with temporal smoothing for real-time video input. Achieved 99% accuracy in translating ASL alphabets to text and voice. Published findings in IEEE ICCCNT 2023. Designed for deployment on edge devices via TensorFlow Lite, with preprocessing in OpenCV to enhance robustness.",
    stack: ["Python", "OpenCV", "Llama 2 7B LLM", "LM Studio", "TensorFlow", "spaCy (for similarity search)", "OpenAI API", "Teachable Machine"],
  impact: [
    "99% translation accuracy (alphabet set)",
    "Reduced false positives by ~35% using temporal smoothing",
    "Peer-reviewed: IEEE ICCCNT 2023"
  ],
    links: {
      github: "https://github.com/Nishanth-G-Palaniswami/American-Sign-Language-Alphabet-Recognition-Using-Teachable-Machine",
              ppt: "https://www.canva.com/design/DAGC7042lUM/HqdJc_sCPVDXcpvI02a1WA/edit?utm_content=DAGC7042lUM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
        ieee: "https://ieeexplore.ieee.org/document/10725877",
    },
  },
  {
    title: "Creative Director — University Club Radio Hub",
    category: ["leadership", "creative"],
    summary: "Shipped a repeatable pipeline (pillars → calendar → briefs → templates → checklist) and stayed hands-on: copy + Procreate/Canva/PS design. Ran 15+ collabs and added 3,000+ followers by iterating on timing/copy and posting consistently.",
    stack: ["Strategy", "Analytics", "Adobe Photoshop", "Procreate", "Canva", "Scheduling", "Leadership"],
    impact: ["Led a 20-member creative team", "+3,000 followers", "15+ creator partnerships", "Increased engagement rate by 40%"],
    links: { insta: "https://www.instagram.com/psg_radio_hub/?hl=en" },
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
  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-white/60 dark:bg-slate-700/60 backdrop-blur border-black/10 dark:border-white/10">
    {children}
  </span>
);

const Card = ({ children }) => (
  <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
    <div className="p-5 md:p-6">{children}</div>
  </div>
);

// -------------------- MAIN COMPONENT -------------------- //
export default function Portfolio() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage and system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    } else {
      // Check system preference if no saved preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    console.log('Dark mode:', darkMode); // Debug log
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
    <div id="top" className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-black/10 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="15" fill="#FFFFFF" stroke="#000000" stroke-width="1"/>
              <path d="M8 8 L8 24 L12 24 L20 12 L20 24 L24 24 L24 8 L20 8 L12 20 L12 8 Z" fill="#000000"/>
            </svg>
            <span className="font-semibold">{PROFILE.name.split(" ")[0]} · Portfolio</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#experience" className="hover:underline">Experience</a>
            <a href="#projects" className="hover:underline">Projects</a>
            <a href="#skills" className="hover:underline">Skills</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 backdrop-blur hover:bg-white dark:hover:bg-slate-700 transition-colors text-sm"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <>
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-slate-600" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>
            <a
              href={LINKS.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm hover:opacity-90"
            >
              <FileText className="h-4 w-4" /> Resume
            </a>
          </div>
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
            <p className="mt-6 text-slate-700 dark:text-slate-300 max-w-2xl">{PROFILE.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2 hover:shadow dark:hover:bg-slate-700 transition-colors">
                <Linkedin className="h-4 w-4"/> LinkedIn
              </a>
              <a href={LINKS.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2 hover:shadow dark:hover:bg-slate-700 transition-colors">
                <Github className="h-4 w-4"/> GitHub
              </a>
              <a href={`mailto:${LINKS.email}`} className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2 hover:shadow dark:hover:bg-slate-700 transition-colors">
                <Mail className="h-4 w-4"/> Email
              </a>
              <a href={LINKS.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2 hover:shadow dark:hover:bg-slate-700 transition-colors">
                <FileText className="h-4 w-4"/> View Resume
              </a>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-slate-800/70 backdrop-blur p-8 shadow-sm"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gradient-to-br from-indigo-300 to-indigo-50 dark:from-indigo-900/50 dark:to-indigo-800/50 p-4">
                <div className="text-sm font-semibold">AWS</div>
                <ul className="mt-2 text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {SKILLS.coreCloud.slice(0,6).map((s) => (<li key={s}>{s}</li>))}
                </ul>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-emerald-300 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-800/50 p-4">
                <div className="text-sm font-semibold">ML / AI</div>
                <ul className="mt-2 text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {SKILLS.mlAi.slice(0,6).map((s) => (<li key={s}>{s}</li>))}
                </ul>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-pink-300 to-pink-50 dark:from-pink-900/50 dark:to-pink-800/50 p-4">
                <div className="text-sm font-semibold">Programming</div>
                <ul className="mt-2 text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {SKILLS.programming.map((s) => (<li key={s}>{s}</li>))}
                </ul>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-300 to-amber-50 dark:from-amber-900/50 dark:to-amber-800/50 p-4">
                <div className="text-sm font-semibold">Databases & Analytics</div>
                <ul className="mt-2 text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {SKILLS.databases.slice(0, 6).map((s) => (<li key={s}>{s}</li>))}
                </ul>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-purple-300 to-purple-50 dark:from-purple-900/50 dark:to-purple-800/50 p-4">
                <div className="text-sm font-semibold">Professional Skills</div>
                <ul className="mt-2 text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {SKILLS.softSkills.slice(0, 6).map((s) => (<li key={s}>{s}</li>))}
                </ul>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-lime-200 to-lime-50 dark:from-yellow-900/50 dark:to-yellow-800/50 p-4">
                <div className="text-sm font-semibold">Design & Frontend</div>
                <ul className="mt-2 text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {SKILLS.uiUx.map((s) => (<li key={s}>{s}</li>))}
                </ul>
              </div>
              
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">* Full skills below</p>
          </motion.div>
        </section>
        
        
        
        {/* Experience Section */}
        <Section id="experience" title="Work Experience" icon={<Server className="h-6 w-6" />}>
          <div className="relative border-l-2 border-slate-200 dark:border-slate-700 pl-8 md:pl-12 space-y-12">
            {EXPERIENCE.map((exp, index) => (
              <motion.div
                key={exp.role + exp.company}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[47px] md:-left-[63px] top-1 h-6 w-6 rounded-full bg-indigo-500 border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center">
                  <Building2 className="h-3 w-3 text-white" />
                </div>
                
                <div className="flex flex-col md:flex-row gap-2 md:gap-8">
                  {/* Left Column: Metadata */}
                  <div className="md:w-1/4 text-sm text-slate-600 dark:text-slate-400 space-y-1 pt-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{exp.company}</p>
                    <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {exp.period}</p>
                    <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {exp.location}</p>
                  </div>

                  {/* Right Column: Details in a Card */}
                  <div className="md:w-3/4">
                    <Card>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{exp.role}</h3>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{exp.summary}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {exp.stack.map((s) => (
                          <Badge key={s}>{s}</Badge>
                        ))}
                      </div>
                      {exp.impact && exp.impact.length > 0 && (
                        <ul className="mt-3 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside space-y-1">
                          {exp.impact.map((i) => (
                            <li key={i}>{i}</li>
                          ))}
                        </ul>
                      )}
                    </Card>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>




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
                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                        : "bg-white dark:bg-slate-800 border-black/10 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700"
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
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 dark:text-white"
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
                    <p className="text-sm text-slate-700 dark:text-slate-300">{p.summary}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {p.stack.map((s) => (
                        <Badge key={s}>{s}</Badge>
                      ))}
                    </div>
                    {p.impact?.length ? (
                      <ul className="mt-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                        {p.impact.map((i) => (
                          <li key={i}>{i}</li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="mt-3 flex gap-3 flex-wrap">
                      {p.links?.github && (
                        <a href={p.links.github} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-indigo-700 dark:text-indigo-400 hover:underline">
                          <Github className="h-4 w-4" /> Code
                        </a>
                      )}

                      {p.links?.demo && (
                        <a href={p.links.demo} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-indigo-700 dark:text-indigo-400 hover:underline">
                          <ExternalLink className="h-4 w-4" /> Demo
                        </a>
                      )}

                      {p.links?.insta && (
                        <a href={p.links.insta} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-indigo-700 dark:text-indigo-400 hover:underline">
                          <ExternalLink className="h-4 w-4" /> Page
                        </a>
                      )}

                      {p.links?.ppt && (
                        <a href={p.links.ppt} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-indigo-700 dark:text-indigo-400 hover:underline uppercase">
                          <FileText className="h-4 w-4" /> PPT
                        </a>
                      )}

                      {p.links?.ieee && (
                        <a href={p.links.ieee} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-indigo-700 dark:text-indigo-400 hover:underline uppercase">
                          <BookOpen className="h-4 w-4" /> IEEE Publication
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
        <Section id="skills" title="Skills" icon={<Server className="h-6 w-6"/>}>
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
              <h4 className="font-semibold">Programming & Frameworks</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {SKILLS.programming.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </Card>
            <Card>
              <h4 className="font-semibold">Design & Frontend Development</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {SKILLS.uiUx.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </Card>
            <Card>
              <h4 className="font-semibold">Professional & Soft Skills</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {SKILLS.softSkills.map((s) => (
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
        <Section id="about" title="About" icon={<Sparkles className="h-6 w-6" />}>
        <Card>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By the time you’ve scrolled this far, you’ve seen the tech stacks, the metrics, and the projects that keep my GitHub commits flowing at odd hours. But here’s the part that doesn’t fit neatly into a bullet point: I’m an engineer who’s just as obsessed with <strong>why</strong> something should be built as I am with how to build it.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-3">
          I’ve built AI pipelines that digest <strong>millions of NYC subway rides</strong> to spot delays, taught models to understand sign language, and deployed MLOps systems that help drones keep crops healthy. My happy place? That intersection where <strong>data</strong>, <strong>creativity</strong>, and <strong>problem-solving</strong> collide to create tools that actually change how someone works, learns, or lives.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-3">
          Outside the terminal window, I’m usually exploring NYC with a camera, hunting for the perfect espresso, or diving into the latest generative AI rabbit hole “just for 10 minutes” (<em>famous last words</em>). Oh—and if you ever want to swap ideas on AI, urban data, or the best coffee in Manhattan, my inbox is open.
        </p>
      </Card>
        </Section>


        {/* Contact */}
        <Section id="contact" title="Contact" icon={<Mail className="h-6 w-6"/>}>
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${LINKS.email}`} className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2 hover:shadow dark:hover:bg-slate-700 transition-colors">
                <Mail className="h-4 w-4"/> {LINKS.email}
              </a>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2 hover:shadow dark:hover:bg-slate-700 transition-colors">
                <Linkedin className="h-4 w-4"/> LinkedIn
              </a>
              <a href={LINKS.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2 hover:shadow dark:hover:bg-slate-700 transition-colors">
                <Github className="h-4 w-4"/> GitHub
              </a>
              <a href={LINKS.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2 hover:shadow dark:hover:bg-slate-700 transition-colors">
                <FileText className="h-4 w-4"/> Resume
              </a>
            </div>
          </Card>
        </Section>
      </main>

      <footer className="border-t border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} {PROFILE.name}. Built with React + Tailwind.
        </div>
      </footer>
    </div>
  );
}
