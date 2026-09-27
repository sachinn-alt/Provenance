# Product Requirements Document (PRD)
## Project: Provenance – Autonomous Data Intelligence Platform
**Problem Statement:** PS 01 – Geek Room Hackathon  
**Target Delivery:** Production-grade Hackathon MVP  
**Version:** 1.0.0  

---

## 1. Executive Summary & Vision
Provenance is an autonomous, prompt-driven Data Intelligence Platform that replaces rigid, brittle web scrapers and bespoke data aggregation scripts with dynamic, self-healing data extraction pipelines. 

A user provides an intent in plain English (e.g., *"Find the top 15 seed-stage AI robotics startups in Europe, their founders, latest funding round, verified career pages, and primary tech stack"*). Provenance autonomously:
1. Deconstructs the business intent into an entity schema and search strategy.
2. Crawls and harvests permitted sources with rate-limit and `robots.txt` compliance.
3. Extracts structured entities using an LLM reasoning engine backed by a deterministic fallback parser.
4. Normalizes, validates, and deduplicates records with statistical confidence scoring.
5. Surfaces verifiable, click-to-trace source citations for every extracted attribute.
6. Renders the dataset inside an interactive data workbench with real-time logs, chart analytics, and multi-format exports.

---

## 2. Problem Statement & Market Pain Points
- **Fragile & High-Maintenance:** Traditional web scrapers break whenever target sites change their DOM, CSS classes, or pagination mechanisms.
- **Engineering Bottleneck:** Non-technical domain experts (analysts, recruiters, investors, marketers) must wait days or weeks for data engineering teams to write custom scripts.
- **Black-Box AI / Hallucination Risk:** Standard LLMs hallucinate companies, numbers, and links when asked to generate lists out of memory. Data teams require verifiable provenance.
- **Unstructured to Structured Gap:** The web consists of semi-structured HTML, blog posts, press releases, and PDF filings. Turning this into relational rows with schema enforcement is manual and tedious.

---

## 3. User Personas
| Persona | Role | Primary Goal | Key Feature Needed |
| :--- | :--- | :--- | :--- |
| **Venture Capital Analyst** | Market Researcher | Monitor stealth and early-stage AI startups and their founders. | Source traceability (proof of funding, official website). |
| **Talent Lead / Recruiter** | Headhunter | Source niche candidates and open roles across competitor careers pages. | Schema auto-discovery, deduplication across job boards. |
| **Competitive Intelligence Lead** | Product Manager | Track competitor pricing changes, product releases, and feature tiers. | Automated workflow re-runs, historical diffs, export to CSV/JSON. |
| **Hackathon Judge / Developer** | Evaluator | Verify technical rigor, edge-case handling, and zero-slop UI utility. | Transparent DAG logs, real-time agent execution stream, audit lineage. |

---

## 4. Core Functional Requirements

### FR-1: Natural Language Requirement Decomposition
- Accepts unstructured business prompts.
- Emits a structured specification including:
  - `Entity Name` & `Entity Description`
  - `Attribute Schema`: Name, data type (`string`, `number`, `url`, `date`, `enum`), required/optional flag, and extraction rules.
  - `Search Queries & Seed Sources`: 3–5 targeted discovery queries and suggested domain patterns.
  - `Deduplication Keys`: Primary fields used to detect identical records (e.g., company domain, job title + company).

### FR-2: Autonomous Workflow Generation & Execution
- Visual DAG pipeline displaying 6 discreet stages:
  1. *Prompt Parsing & Schema Synthesis*
  2. *Permitted Source Discovery & Filtering*
  3. *Deep Document Crawling & Sanitization*
  4. *Structured Entity Extraction*
  5. *Validation, Normalization & Deduplication*
  6. *Lineage Indexing & Dataset Publishing*
- Real-time execution telemetry (active URL, fetch latency, tokens used, record count, execution status).
- Execution controls: Cancel run, re-run workflow, fork with modified prompt.

### FR-3: Multi-Source Harvesting & Permitted Scraping
- Respects `robots.txt` and domain policies.
- Resilient fetching with user-agent rotation, timeout resilience, and clean markdown/DOM parsing.
- Dual-mode architecture:
  - **Live Web Mode:** Executes live HTTP requests against public search and web targets.
  - **Cached/Safe Demo Mode:** Provides instant, guaranteed offline fallbacks for hackathon stage presentations without network flakiness.

### FR-4: Clean, Validate, and Deduplicate Engine
- Strips redundant boilerplate, marketing navbars, and script tags.
- Formats normalized data (currency normalization, ISO dates, standard URL formatting).
- Deduplicates identical or fuzzy-matched entities based on compound primary keys.
- Computes a Dataset Health Score (% fields populated, % citations verified).

### FR-5: Source Traceability & Data Lineage (The Anti-Hallucination Core)
- Every single extracted cell maintains an immutable lineage metadata object:
  - `source_url`: Verifiable URL where the fact was obtained.
  - `snippet`: The exact verbatim 50–200 character sentence from the source document.
  - `confidence_score`: 0.00 – 1.00 score assigned by the extraction engine.
- Clicking any cell in the table opens an **Inspect Lineage** inspector drawer.

### FR-6: Interactive Data Workbench
- Virtualized/paginated data table with:
  - Global search & multi-column sorting
  - Column show/hide toggles
  - Inline JSON preview drawer
  - Filter by validation state or confidence threshold
- Visual Analytics View:
  - Auto-generated KPI summary cards (Total Entities, Valid Rate, Sources Consulted, Avg Confidence).
  - Dynamic categorical charts (e.g., breakdown by category/location) and numeric histograms.
- Multi-format Export: CSV, JSON, Markdown Table, and TSV.

### FR-7: Task & Workflow History Management
- Persistent history of all past workflow runs.
- View previous results, review agent execution logs, and clone prompts for iterative exploration.

---

## 5. Non-Functional Requirements
- **Performance:** End-to-end extraction workflow completes within 10–25 seconds for an initial batch of 10–20 records.
- **Reliability:** 100% graceful degradation. If an external API is down or throttled, the platform falls back to heuristic pattern extraction and cached samples without crashing.
- **Cost:** Operable at $0 cost on free-tier APIs (Google Gemini Flash / Groq / Local Node).
- **Usability:** 0 learning curve for non-technical users; power-user shortcuts (e.g., `Cmd+K` / `Ctrl+K`, quick filter chips).

---

## 6. Success Metrics & Hackathon Judging Criteria Alignment
1. **Prompt Understanding:** Does the AI correctly infer complex schemas from vague human prompts?
2. **Data Accuracy & Lineage:** Can judges click any cell and immediately inspect the exact source quote?
3. **Execution Robustness:** Does the pipeline execute smoothly live on stage without network hangs or API crashes?
4. **Product Polish & UX:** Is the interface an industrial-grade, ultra-clean productivity tool rather than a toy chatbot?
