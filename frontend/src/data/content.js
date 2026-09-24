export const PROFILE = {
  name: "Brandon D. Phillips",
  role: "Systems Engineer · AI Architect",
  tagline: "Weaver of resilient systems",
  location: "Chicago, IL · UTC-6",
  est: "EST. 2008 · SIX TENURES",
  availability: "Open to onsite, hybrid, or remote",
  website: "bytesbybrandon.com",
};

export const ABOUT = {
  eyebrow: "ENTOMOLOGY OF AN ENGINEER",
  paragraphs: [
    "I'm a staff-level systems engineer and AI architect based in Chicago. For 18 years I've built resilient distributed systems, event-driven agent runtimes, and high-throughput data infrastructure across six long tenures.",
    "I created Reactive Skills, an open-source runtime that turns passive LLM instructions into observable, recoverable state machines, and I led enterprise integrations at DocuSign through growth from $250M to $2.5B ARR. Like the orb weaver, I build quietly and I build to hold.",
  ],
  pillars: [
    {
      n: "01",
      title: "Resilience in Architecture",
      body: "Event-sourced ledgers, deterministic state recovery, and systems that degrade gracefully. When a global TLS outage hit DocuSign, I led the fleet-wide remediation that protected $5M+ in contracts.",
    },
    {
      n: "02",
      title: "Deterministic AI Systems",
      body: "Typed event buses and precondition guards that stop hallucination cascades. Passive prompts become observable hierarchical state machines with instant session recovery.",
    },
    {
      n: "03",
      title: "Long-Term Endurance",
      body: "Eight years at DocuSign, six tenures total. I mentor teams, carry the pager, and stay to maintain what I weave.",
    },
  ],
  stats: [
    { k: "06", v: "Long-term tenures" },
    { k: "18", v: "Years shipping" },
    { k: "10M+", v: "Records streamed daily" },
    { k: "$2.5B", v: "ARR platform scale" },
  ],
};

export const EDUCATION = {
  degree: "B.S. Computer Engineering",
  school: "Boston University",
  years: "2004 – 2008",
  note: "Anita Cuadrado Memorial Award for outstanding service as a Teaching Assistant",
};

export const TIMELINE = [
  {
    company: "ByteQuilt",
    role: "Founding Principal Software Engineer / AI Architect",
    tenure: "2023 – Present",
    impact:
      "Founded the studio and shipped Reactive Skills, an open-source agent runtime cutting LLM token use by ~65%. Built a contextual RAG service, the Bergcache Rust graph cache, and commit-to-deploy AWS infrastructure holding 99.9%+ availability.",
    stack: ["TypeScript", "Rust", "MCP", "AWS"],
  },
  {
    company: "Strategic Data Systems",
    role: "Lead Software Engineer",
    tenure: "2024 – 2026",
    impact:
      "Architected an enterprise ETL pipeline streaming 10M+ daily records from 200+ MLS providers into PostgreSQL and OpenSearch, and compressed client onboarding from 3–5 days to under 5 minutes.",
    stack: [".NET", "SQL Server CDC", "PostgreSQL", "OpenSearch", "Redis"],
  },
  {
    company: "DocuSign",
    role: "Lead Software Engineer / Technical Lead",
    tenure: "2015 – 2023",
    impact:
      "Led architecture for 6 core enterprise integrations (SharePoint, Dynamics 365, Power Automate, Outlook, Word) serving 200K+ customer organizations through growth from $250M to $2.5B ARR.",
    stack: ["C#", ".NET", "Azure", "React", "TypeScript"],
  },
  {
    company: "Philips Healthcare",
    role: "Senior Software Engineer",
    tenure: "2014 – 2015",
    impact:
      "Built the clinician-facing real-time telemetry interface for an emergency care coordination platform under FDA Class III and HIPAA reliability standards.",
    stack: ["JavaScript", "HL7", "Real-Time Telemetry"],
  },
  {
    company: "Microsoft",
    role: "Software Engineer / SDET",
    tenure: "2010 – 2014",
    impact:
      "Owned end-to-end test automation for Windows Store search and catalog discovery, validating query relevance and fault tolerance under high concurrency.",
    stack: ["C#", "Selenium", "Windows Store"],
  },
  {
    company: "Philips",
    role: "Software Engineer",
    tenure: "2008 – 2010",
    impact:
      "First engineering role after Boston University, building and shipping software at Philips. The first of two tours with the company.",
    stack: ["C#", ".NET"],
  },
];

export const PROJECTS = [
  {
    id: "reactive-skills",
    index: "01",
    title: "Reactive Skills",
    category: "Agentic Systems",
    year: "2023",
    stack: ["TypeScript", "MCP", "Event Sourcing", "HSM"],
    summary:
      "Open-source runtime that compiles passive markdown agent instructions into deterministic hierarchical state machines, with typed signal guards and an immutable event ledger for instant session recovery.",
    metrics: ["~65% fewer input tokens", "Zero-install AXI CLI", "Open source"],
    links: [
      { label: "Docs", href: "https://reactive-skills.github.io/reactive-skills" },
      { label: "GitHub", href: "https://github.com/reactive-skills/reactive-skills" },
      { label: "Skills Registry", href: "https://github.com/reactive-skills/skills" },
    ],
  },
  {
    id: "luminedb",
    index: "02",
    title: "LumineDB Engine",
    category: "Distributed Engines",
    year: "2024",
    stack: ["Rust", "WebAssembly", "Graph", "Event Sourcing"],
    summary:
      "Graph-native, event-sourced database engine with Dynamic Consistency Boundaries that scope transactions to entity tags, plus WebAssembly runtimes for client and edge.",
    metrics: ["Dynamic Consistency", "WASM edge runtime", "Graph-native"],
  },
  {
    id: "bergcache",
    index: "03",
    title: "Bergcache",
    category: "Distributed Engines",
    year: "2024",
    stack: ["Rust", "WebAssembly", "Node.js"],
    summary:
      "High-throughput in-memory graph cache with hierarchical colon-delimited key namespaces and automatic cascade invalidation.",
    metrics: ["~40% lower cache cost", "Sub-ms reads", "Node + WASM bindings"],
  },
  {
    id: "formicary",
    index: "04",
    title: "Formicary",
    category: "Agentic Systems",
    year: "2023",
    stack: ["TypeScript", "Node.js", "Anthropic", "OpenAI"],
    summary:
      "Autonomous multi-agent orchestration with pluggable LLM drivers, automated task decomposition, and stigmergic ledger coordination.",
    metrics: ["~30% faster dev velocity", "Multi-provider drivers", "Autonomous"],
  },
  {
    id: "mls-pipeline",
    index: "05",
    title: "Enterprise Streaming Pipeline",
    category: "Real-Time Telemetry",
    year: "2024",
    stack: [".NET", "SQL Server CDC", "PostgreSQL", "OpenSearch"],
    summary:
      "ETL pipeline streaming 10M+ daily records from 200+ MLS providers into dual stores, behind sub-50ms consumer APIs serving 200+ client organizations.",
    metrics: ["10M+ records/day", "Sub-50ms APIs", "200+ providers"],
  },
  {
    id: "tttui",
    index: "06",
    title: "tttui-axi",
    category: "Agentic Systems",
    year: "2024",
    stack: ["Terminal", "AXI", "Agent Runtimes"],
    summary:
      "Terminal-native interface for the AXI agent experience: live state machine events, session control, and artifact inventory without leaving the shell.",
    metrics: ["Terminal-native", "Live event stream"],
    links: [
      { label: "GitHub", href: "https://github.com/bytesbybrandon/tttui" },
    ],
  },
  {
    id: "progressive-depth",
    index: "07",
    title: "Progressive Depth",
    category: "Agentic Systems",
    year: "2025",
    stack: ["TypeScript", "Context Engines", "LLM Drivers"],
    summary:
      "Context engine that reveals detail to agents in progressive layers, holding token budgets nearly flat as task complexity grows.",
    metrics: ["Progressive disclosure", "Flat token budget"],
    links: [
      { label: "GitHub", href: "https://github.com/bytequilt/progressive-depth" },
    ],
  },
];

export const SKILLS = [
  {
    group: "Core Languages",
    items: [
      { name: "TypeScript / Node.js", level: 96 },
      { name: "C# / .NET", level: 95 },
      { name: "SQL", level: 92 },
      { name: "Python", level: 88 },
      { name: "Rust", level: 82 },
    ],
  },
  {
    group: "AI & Agentic Systems",
    items: [
      { name: "Agent Runtimes & HSMs", level: 94 },
      { name: "RAG & Vector Search", level: 90 },
      { name: "Prompt Slicing", level: 90 },
      { name: "Model Context Protocol", level: 88 },
      { name: "Multi-Agent Orchestration", level: 86 },
    ],
  },
  {
    group: "Backend & Data",
    items: [
      { name: "Distributed Systems", level: 94 },
      { name: "PostgreSQL / SQL Server", level: 92 },
      { name: "Event Sourcing & CQRS", level: 90 },
      { name: "Kafka & Kinesis", level: 85 },
      { name: "OpenSearch / Elasticsearch", level: 84 },
    ],
  },
  {
    group: "Cloud & Frontend",
    items: [
      { name: "React & Next.js", level: 92 },
      { name: "AWS", level: 90 },
      { name: "CI/CD", level: 88 },
      { name: "Observability", level: 86 },
      { name: "Kubernetes & Terraform", level: 84 },
    ],
  },
];

export const SOCIALS = [
  {
    id: "github",
    label: "GitHub",
    handle: "github.com/bytesbybrandon",
    href: "https://github.com/bytesbybrandon",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "linkedin.com/in/bdphillips",
    href: "https://linkedin.com/in/bdphillips",
  },
  {
    id: "website",
    label: "Website",
    handle: "bytesbybrandon.com",
    href: "https://bytesbybrandon.com",
  },
  {
    id: "email",
    label: "Email",
    handle: "brandon@bytesbybrandon.com",
    href: "mailto:brandon@bytesbybrandon.com",
  },
];
