# Provenance ⚡ Autonomous Data Intelligence Platform

> **Geek Room Hackathon — Problem Statement 01**  
> *Turn natural-language business requests into clean, validated, source-backed datasets with autonomous multi-stage workflows.*

---

## 🎯 The Vision & Problem Solved
Modern businesses continuously need web data—emerging startup funding, competitor pricing, job market trends, supplier catalogs, or research developments. Yet traditional web scraping is:
- **Fragile & High-Maintenance:** Selectors and DOM structures break constantly.
- **Engineering-Bottlenecked:** Analysts and business teams can't easily write scrapers on the fly.
- **Plagued by AI Hallucinations:** Raw generative models invent URLs, company names, and figures out of thin air.

**Provenance solves this.** Users describe what they need in plain English. Provenance autonomously deconstructs the requirement, designs a multi-agent collection workflow, harvests permitted sources, validates & deduplicates records, and delivers a source-backed, traceable dataset inside an industrial-grade data workbench.

---

## 🚀 Key Features & Differentiators

### 1. 🧠 Natural Language to Schema Synthesis
- Enter prompts like: *"Collect the top 15 AI agents startups with founders, funding stage, headquarters, and careers link."*
- SynapseData infers entity types, data constraints, deduplication primary keys, and search discovery queries in seconds.

### 2. ⚡ Live Pipeline DAG & Agent Execution Stream
- Visual 6-stage pipeline: **Intent Deconstruction ➔ Source Discovery ➔ Page Harvesting ➔ Structured Extraction ➔ Dedup & Normalization ➔ Lineage Indexing**.
- Real-time Server-Sent Events (SSE) telemetry showing crawled URLs, latencies, tokens, and active phase.

### 3. 🔍 Click-to-Trace Lineage (The Anti-Hallucination Core)
- **Every single data cell is clickable.**
- Inspect the exact verbatim source quote from the original webpage, authoritative URL, timestamp, and extraction confidence score.

### 4. 🛠️ Industrial Data Workbench (Zero "AI Slop")
- **High-Density Data Grid:** Sticky headers, multi-column sorting, instant global search, and column visibility toggles.
- **Validation Scoring:** Real-time data health checks (% fields populated, % citations verified).
- **Visual Analytics:** Auto-generated distribution charts and KPI metrics.
- **Multi-Format Export:** 1-click download as **CSV**, **JSON**, **Markdown Table**, or **TSV**.

### 5. 🛡️ Dual-Mode Resilience (Live + Safe Demo Mode)
- **Live Web Agent:** Fetches live internet sources and executes LLM structured extraction.
- **Guaranteed Safe Demo Mode:** Pre-indexed offline snapshots prevent network drops or API rate-limit crashes during live stage judging.

---

## 📚 Architectural & Engineering Documentation

This repository includes full technical documentation:

| Document | Purpose |
| :--- | :--- |
| **[`PRD.md`](./PRD.md)** | Product Requirements Document: Problem statement, personas, functional requirements, and success metrics. |
| **[`TRD.md`](./TRD.md)** | Technical Requirements Document: Architecture diagram, data models, API routes, and fault tolerance. |
| **[`DESIGN.md`](./DESIGN.md)** | Design System & UI/UX Spec: Anti-AI-slop principles, color tokens, typography, and interaction guidelines. |
| **[`AGENTS.md`](./AGENTS.md)** | Multi-Agent Architecture: 6-stage DAG, task decomposition, and error-recovery loops. |
| **[`LLM.md`](./LLM.md)** | Model Strategy: Prompts, structured JSON enforcement, multi-provider adapter, and token optimization. |

---

## 🛠️ Technology Stack
- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS (Dark Mode, Industrial Zinc Palette)
- **Icons & UI:** Lucide React + Radix UI primitives
- **Data & Streaming:** Server-Sent Events (SSE) + In-Memory & Local JSON Store
- **LLM Reasoning:** Google Gemini API (Flash 1.5/2.0) / Groq Llama 3 / Deterministic Fallback Engine

---

## 🚦 Quickstart Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Create a `.env.local` file:
```env
# Optional: Provide Gemini or Groq API key for live LLM extraction.
# If omitted, SynapseData automatically uses its intelligent Heuristic Engine & Safe Demo Mode!
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
