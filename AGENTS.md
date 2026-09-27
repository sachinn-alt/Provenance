# Autonomous Agent Architecture (AGENTS.md)
## Project: Provenance – Autonomous Data Intelligence Platform
**Architecture Model:** Multi-Stage Deterministic-Agentic DAG Pipeline  
**Version:** 1.0.0  

---

## 1. Agent System Philosophy

Modern data collection cannot rely on monolithic single-prompt LLM calls. Doing so leads to hallucination, truncated tokens, non-deterministic structures, and unverified data.

SynapseData enforces a **Decoupled Multi-Agent DAG (Directed Acyclic Graph)** where each specialized agent has a single responsibility, rigorous typed inputs/outputs, and built-in validation gates.

---

## 2. Multi-Agent Topology & Pipeline Stages

```
                  ┌──────────────────────────────┐
                  │    User Business Prompt      │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                     [Stage 1: Intent & Schema Agent]
                                 │
              ┌──────────────────┴──────────────────┐
              ▼                                     ▼
        Typed Entity Schema                  Search & Crawl Plan
              │                                     │
              └──────────────────┬──────────────────┘
                                 │
                                 ▼
                    [Stage 2: Harvester Agent]
               (robots.txt, headers, clean fetch)
                                 │
                                 ▼
                    [Stage 3: Sanitizer Agent]
               (DOM strip, markdown density chunks)
                                 │
                                 ▼
                    [Stage 4: Extraction Agent]
              (Schema alignment + citation anchors)
                                 │
                                 ▼
             [Stage 5: Dedup & Normalization Agent]
             (Fuzzy matching, currency/date format)
                                 │
                                 ▼
              [Stage 6: Lineage & Audit Indexer]
              (Health score, source graph, export)
```

---

## 3. Detailed Agent Specifications

### 3.1 Agent 1: Intent & Schema Planner (`SchemaAgent`)
- **Responsibility:** Interprets the user's natural language request and generates a formal data collection blueprint.
- **Input:** Raw prompt string (e.g., *"Collect top 10 mechanical keyboard switches with tactile force and sound profile"*).
- **Output Blueprint:**
  - `entity`: Target entity name (e.g., "KeyboardSwitch").
  - `fields`: Field specifications with types (`string`, `number`, `url`, `currency`, `badge`), constraints, and extraction descriptions.
  - `searchPlan`: Targeted search queries and seed websites.
  - `primaryKeys`: Unique identification keys to prevent duplicate entries.
- **Safety Gate:** Rejects malicious or prohibited prompts (e.g., PII extraction, bypass credential walls).

### 3.2 Agent 2: Source Discovery & Harvester (`HarvesterAgent`)
- **Responsibility:** Discovers relevant web targets, checks crawler policies, and retrieves raw document content.
- **Rules:**
  - Adheres to `robots.txt` disallow patterns.
  - Enforces request rate limits (max 3 concurrent requests, 500ms delay).
  - Emits telemetry events: `HTTP_START`, `HTTP_SUCCESS`, `HTTP_RATE_LIMITED`.
  - Seamlessly switches to local curated snapshots in **Demo Mode** to prevent presentation failures.

### 3.3 Agent 3: Document Sanitizer & Chunker (`SanitizerAgent`)
- **Responsibility:** Strips noise, script tags, stylesheet definitions, tracking beacons, navigation menus, and footers.
- **Transforms:** HTML DOM $\rightarrow$ High-density, token-efficient Semantic Markdown chunks.
- **Preservation:** Retains structural headers (`#`, `##`, `###`), tables (`| ... |`), and link anchors (`[text](url)`).

### 3.4 Agent 4: Entity Extraction & Citation Resolver (`ExtractorAgent`)
- **Responsibility:** Extracts structured entity records conforming strictly to the `SchemaAgent` definition.
- **The Citation Anchor Protocol:**
  - For each extracted attribute, the agent locates the **verbatim sentence** in the source document where the fact was derived.
  - If a fact cannot be supported by an exact source snippet, it is marked as `unverified` and penalized in the confidence score.
  - Generates confidence rating (0.00 – 1.00) based on textual explicitness.

### 3.5 Agent 5: Deduplication & Normalization Agent (`ResolverAgent`)
- **Responsibility:** Unifies entities from multiple documents into a clean, canonical dataset.
- **Operations:**
  - **Normalization:** Cleans strings, strips non-numeric characters from price/count fields, standardizes dates to `YYYY-MM-DD`.
  - **Deduplication:** Computes normalized primary key hashes and string Levenshtein distances (threshold > 0.88).
  - **Entity Merging:** When duplicates are detected, merges unique attributes and aggregates all source citations into a multi-source lineage record.

### 3.6 Agent 6: Lineage & Audit Indexer (`AuditAgent`)
- **Responsibility:** Computes overall dataset quality metrics and compiles execution history.
- **Metrics Computed:**
  - `validityRate`: Percentage of required attributes successfully resolved.
  - `lineageCoverage`: Percentage of cells backed by verifiable web citations.
  - `dedupRatio`: Total raw records harvested vs. unique canonical records published.
  - `executionLatency`: End-to-end processing duration.

---

## 4. Error Handling & Self-Healing Loop
If an extraction pass yields 0 valid records or a critical schema mismatch:
1. `SchemaAgent` relaxes strict regex constraints.
2. `HarvesterAgent` queries secondary search fallback URLs.
3. Fallback heuristic pattern matchers execute to guarantee partial result yield rather than empty failure.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
