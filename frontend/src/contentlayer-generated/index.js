// Contentlayer generated data - pre-built for CRA compatibility
const allBlogPosts = [
  {
    "title": "Building Reactive Skills: From Passive Prompts to Deterministic State Machines",
    "date": "2024-03-15T00:00:00.000Z",
    "tags": ["agentic-systems", "typescript", "event-sourcing", "hsm"],
    "summary": "How I built an open-source runtime that compiles passive markdown agent instructions into observable hierarchical state machines, cutting LLM token usage by ~65%.",
    "draft": false,
    "body": {
      "raw": "\nI've spent the last year thinking about a fundamental problem: **LLM prompts are passive text, but production systems need active, observable behavior.**\n\n## The Problem\n\nWhen you write a prompt like \"You are a helpful assistant that helps users debug code,\" you get back... text. There's no guarantee of:\n- What state the agent is in\n- Whether it can recover from interruption\n- How it handles conflicting instructions\n- Token efficiency across conversation turns\n\nTraditional prompt engineering treats the LLM as a black box. But for systems that need to run reliably in production—handling real user requests, maintaining session state, recovering from failures—we need something more deterministic.\n\n## Enter Reactive Skills\n\nReactive Skills flips the model: **instructions become executable state machines.**\n\n```\n# Agent Charter\n## States\n- IDLE → LISTENING (on USER_INPUT)\n- LISTENING → PROCESSING (on INTENT_CLASSIFIED)\n- PROCESSING → RESPONDING (on TOOL_RESULT)\n- RESPONDING → IDLE (on COMPLETE)\n```\n\nEach state has:\n- **Entry guards** — preconditions that must pass before entering\n- **Exit actions** — deterministic side effects on transition\n- **Signal handlers** — typed event responses (CHECK_PASSED, TOOL_FAILED, etc.)\n\n## The Architecture\n\n```\n┌─────────────────────────────────────────────┐\n│           Markdown Charter (.md)            │\n└─────────────────────┬───────────────────────┘\n                      ▼\n┌─────────────────────────────────────────────┐\n│         Contentlayer Parser                 │\n│  (frontmatter → typed JSON schema)          │\n└─────────────────────┬───────────────────────┘\n                      ▼\n┌─────────────────────────────────────────────┐\n│         Hierarchical State Machine          │\n│  (parent/child states, signal routing)      │\n└─────────────────────┬───────────────────────┘\n                      ▼\n┌─────────────────────────────────────────────┐\n│         Event-Sourced Ledger                │\n│  (immutable signal log, instant replay)     │\n└─────────────────────────────────────────────┘\n```\n\n## Key Results\n\n| Metric | Before | After |\n|--------|--------|-------|\n| Input tokens/turn | ~2,400 | ~840 |\n| Session recovery | Manual | Automatic (replay) |\n| Debugging | \"Check logs\" | State machine visualizer |\n| Hallucination rate | ~12% | <2% (guarded transitions) |\n\n## The Token Savings\n\nThe biggest win wasn't even the state machine—it was **prompt slicing**.\n\nInstead of stuffing the entire charter, tools, and context into every prompt, Reactive Skills:\n1. **Compiles** the charter to a minimal instruction set per state\n2. **Injects** only the signals relevant to the current state\n3. **Strips** tool definitions not available in the current context\n\nThis alone cut tokens by ~65% with zero capability loss.\n\n## Try It\n\n```bash\nnpm install @reactive-skills/core\n```\n\n```typescript\nimport { createAgent } from '@reactive-skills/core'\n\nconst agent = createAgent({\n  charter: await import('./my-agent.md'),\n  tools: [codeSearch, fileEdit, testRunner],\n})\n\nawait agent.start()\n```\n\nThe runtime handles everything else: state transitions, signal validation, event persistence, and recovery.\n\n---\n\n*This post is adapted from the Reactive Skills launch announcement. The full source is at [github.com/reactive-skills/reactive-skills](https://github.com/reactive-skills/reactive-skills).*",
      "code": ""
    },
    "_id": "blog/building-reactive-skills.mdx",
    "_raw": {
      "sourceFilePath": "blog/building-reactive-skills.mdx",
      "sourceFileName": "building-reactive-skills.mdx",
      "sourceFileDir": "blog",
      "contentType": "mdx",
      "flattenedPath": "blog/building-reactive-skills"
    },
    "type": "BlogPost",
    "slug": "building-reactive-skills",
    "url": "/blog/building-reactive-skills"
  },
  {
    "title": "Event Sourcing at Scale: Lessons from 10M Records/Day",
    "date": "2024-07-22T00:00:00.000Z",
    "tags": ["distributed-systems", "event-sourcing", "cqrs", "postgresql", "opensearch"],
    "summary": "Architecting an enterprise ETL pipeline streaming 10M+ daily records from 200+ MLS providers into dual stores behind sub-50ms consumer APIs.",
    "draft": false,
    "body": {
      "raw": "\nWhen you're ingesting 10 million records a day from 200+ heterogeneous sources, **event sourcing isn't a pattern—it's survival.**\n\n## The Constraint Landscape\n\n- **200+ MLS providers**, each with their own schema, rate limits, and reliability\n- **Sub-50ms P99** on consumer read APIs\n- **Dual write**: PostgreSQL (transactional) + OpenSearch (analytics)\n- **Schema evolution** without downtime\n- **Exactly-once** semantics despite source flakiness\n\n## Architecture\n\n```\n┌─────────────┐     ┌─────────────┐     ┌──────────────────┐\n│   CDC       │────▶│  Event Bus  │────▶│  Projection      │\n│  (Debezium) │     │  (Kafka)    │     │  Workers         │\n└─────────────┘     └─────────────┘     └────────┬─────────┘\n                                                  │\n                    ┌─────────────────────────────┼─────────────┐\n                    ▼                             ▼             ▼\n              ┌───────────┐               ┌───────────┐  ┌───────────┐\n              │ PostgreSQL│               │ OpenSearch│  │  Redis    │\n              │ (Source   │               │ (Search/  │  │  (Cache/  │\n              │  of Truth)│               │  Analytics)│  │  Session) │\n              └───────────┘               └───────────┘  └───────────┘\n```\n\n## Critical Decisions\n\n### 1. CDC Over Polling\nDebezium on SQL Server CDC → Kafka. No custom pollers, no missed updates, no schema coupling.\n\n### 2. Event Schema = Contract\nEvery event is Avro-registered. Consumers validate on read. Producers evolve backward-compatibly.\n\n### 3. Idempotent Projections\nEach projection worker tracks its Kafka offset + event hash. Reprocessing is free and safe.\n\n### 4. Dual-Write via Transactional Outbox\nPostgreSQL `outbox` table → Kafka Connect → OpenSearch. No distributed transactions.\n\n## The Numbers\n\n| Metric | Value |\n|--------|-------|\n| Daily events | 10M+ |\n| Peak throughput | 180k events/sec |\n| P99 consumer latency | 34ms |\n| Schema migrations | 47 (zero downtime) |\n| Data loss incidents | 0 |\n\n## What I'd Do Differently\n\n1. **Start with OpenSearch ISM** (Index State Management) earlier—manual ILM policies bit us\n2. **Invest in Kafka Streams** for lightweight transformations instead of custom workers\n3. **Add event replay tooling** from day one—debugging production issues without it is painful\n\n## The Takeaway\n\nEvent sourcing at scale isn't about \"event-driven architecture\" as a buzzword. It's about **making the immutable log the single source of truth** so every downstream system—search, analytics, cache, audit—is a deterministic projection.\n\nWhen the next provider adds a field, when OpenSearch changes its mapping, when you need a new report: you replay from the log. The system *remembers*.\n\n---\n\n*Built this at Strategic Data Systems. The pattern generalizes: any high-throughput, multi-consumer ingestion pipeline benefits from the same foundation.*",
      "code": ""
    },
    "_id": "blog/event-sourcing-at-scale.mdx",
    "_raw": {
      "sourceFilePath": "blog/event-sourcing-at-scale.mdx",
      "sourceFileName": "event-sourcing-at-scale.mdx",
      "sourceFileDir": "blog",
      "contentType": "mdx",
      "flattenedPath": "blog/event-sourcing-at-scale"
    },
    "type": "BlogPost",
    "slug": "event-sourcing-at-scale",
    "url": "/blog/event-sourcing-at-scale"
  },
  {
    "title": "Deterministic AI: Typed Guards Over Prompt Engineering",
    "date": "2024-11-08T00:00:00.000Z",
    "tags": ["ai-systems", "typescript", "hsm", "agentic-systems", "mcp"],
    "summary": "Why the future of reliable AI agents isn't better prompts—it's typed precondition guards, hierarchical state machines, and event-sourced session recovery.",
    "draft": false,
    "body": {
      "raw": "\nThe industry is obsessed with **prompt engineering**. I'm obsessed with **prompt elimination**.\n\n## The Prompt Trap\n\nEvery week there's a new \"prompt pattern\":\n- Chain-of-thought\n- Tree-of-thought\n- ReAct\n- Reflexion\n- Self-consistency\n- AutoGPT, BabyAGI, etc.\n\nThey all share one flaw: **they treat the LLM as a reasoning engine**.\n\nBut LLMs are *probabilistic token predictors*. They don't \"reason\"—they continue patterns. When the pattern breaks (ambiguous input, missing context, token limit), the output degrades unpredictably.\n\n## What Actually Works: Typed Guards\n\n```typescript\n// Instead of \"be careful with user data\"\n// We write:\n\ninterface UserDataAccess {\n  require: 'USER_CONSENT_GRANTED'\n  scope: 'READ' | 'WRITE'\n  fields: string[]\n}\n\nconst guard = (signal: Signal, ctx: Context): GuardResult => {\n  if (signal.type === 'TOOL_CALL' && signal.tool === 'user.data') {\n    const consent = ctx.consents.get(signal.payload.userId)\n    if (!consent?.granted) return { pass: false, reason: 'CONSENT_REQUIRED' }\n    if (!signal.payload.fields.every(f => consent.fields.includes(f))) {\n      return { pass: false, reason: 'FIELD_EXCEEDS_SCOPE' }\n    }\n  }\n  return { pass: true }\n}\n```\n\nThis isn't a prompt. It's **TypeScript that runs before the LLM sees anything**.\n\n## Hierarchical State Machines > Prompt Chains\n\n```\nAGENT\n├── IDLE\n├── PLANNING\n│   ├── DECOMPOSE_TASK\n│   ├── VALIDATE_PLAN (guard: plan.passesAllPreconditions)\n│   └── COMMIT_PLAN\n├── EXECUTING\n│   ├── STEP_N\n│   │   ├── PRE_GUARD (typed)\n│   │   ├── TOOL_CALL\n│   │   ├── POST_GUARD (typed)\n│   │   └── EMIT_PROGRESS\n│   └── CHECKPOINT (event-sourced)\n└── COMPLETE / FAILED / RECOVERING\n```\n\nEach state has **typed entry/exit guards**. The LLM only operates *inside* `STEP_N`—everything else is deterministic code.\n\n## Event-Sourced Recovery\n\n```\nSession interrupted at STEP_3 (network failure)\n         │\n         ▼\nReplay event log from CHECKPOINT_2\n         │\n         ▼\nRehydrate exact state (variables, tool results, context)\n         │\n         ▼\nResume at STEP_3 — zero context loss, zero token re-spend\n```\n\nThis is impossible with pure prompt chains. The conversation history *is* the state, and it's fragile.\n\n## Model Context Protocol (MCP) Integration\n\nReactive Skills implements MCP natively. Tools aren't \"functions the LLM calls\"—they're **signal handlers with typed contracts**:\n\n```typescript\nconst mcpServer = createMCPServer({\n  tools: [\n    {\n      name: 'code.search',\n      schema: CodeSearchSchema,  // Zod schema = guard\n      handler: async (input, ctx) => {\n        // Typed input, typed output, audited\n      }\n    }\n  ]\n})\n```\n\nThe LLM *never sees raw tool definitions*. It sees **signal schemas** that match the guard types.\n\n## Results in Production\n\n| Approach | Hallucination Rate | Recovery Time | Token Efficiency |\n|----------|-------------------|---------------|------------------|\n| Prompt chains (ReAct) | ~12% | Manual (minutes) | Baseline |\n| Reactive Skills (guarded HSM) | ~2% | Auto (< 1s) | 65% fewer tokens |\n\n## The Shift\n\n**Stop asking \"how do I prompt this better?\"**\n**Start asking \"what typed invariants must hold?\"**\n\nThe LLM becomes a **constrained generator inside a verified envelope**. The envelope is code. The code is testable, auditable, and recoverable.\n\nThat's not prompt engineering. That's **software engineering with an LLM inside**.\n\n---\n\n*This is the philosophy behind Reactive Skills. See the implementation at [github.com/reactive-skills/reactive-skills](https://github.com/reactive-skills/reactive-skills).*",
      "code": ""
    },
    "_id": "blog/deterministic-ai-typed-guards.mdx",
    "_raw": {
      "sourceFilePath": "blog/deterministic-ai-typed-guards.mdx",
      "sourceFileName": "deterministic-ai-typed-guards.mdx",
      "sourceFileDir": "blog",
      "contentType": "mdx",
      "flattenedPath": "blog/deterministic-ai-typed-guards"
    },
    "type": "BlogPost",
    "slug": "deterministic-ai-typed-guards",
    "url": "/blog/deterministic-ai-typed-guards"
  }
];

export { allBlogPosts };
export const allDocuments = [...allBlogPosts];