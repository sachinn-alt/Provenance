# Design System & UI/UX Specification (DESIGN.md)
## Project: Provenance – Autonomous Data Intelligence Platform
**Aesthetic Style:** Industrial Data Workbench / High-Density Developer Platform  
**Design Reference:** Linear, Supabase Studio, Datadog, Raycast  
**Strict Directive:** Zero AI-Slop UI  

---

## 1. The Anti-AI-Slop Manifesto

### What We Strictly Ban (The "AI Slop" Anti-Patterns):
1. **No Garish Rainbow/Purple-Pink Neon Gradients:** No oversized, fuzzy cosmic hero blobs that scream "generic AI wrapper."
2. **No Hollow Marketing Fluff:** No giant useless illustration cards with text like *"Harness the hyper-power of autonomous intelligence."*
3. **No Dumb Chatbot Paradigm:** Data engineering is tabular, relational, and structured. A tiny WhatsApp-style chat bubble box is an anti-pattern for exploring 50 columns of structured data.
4. **No Non-Functional Decorative Elements:** Every single button, badge, metric, and graph must display real operational data or trigger an actionable state change.

### What We Enforce (The Industrial Data Workbench Principles):
1. **High Information Density:** Dense tables with clean padding (`px-3 py-2.5`), monospace metadata, and sticky header controls.
2. **Tactile & Responsive Feedback:** Subtle 150ms ease transitions, crisp hover states (`bg-zinc-800/60`), and clear loading indicators.
3. **Data Provenance Front-and-Center:** Hovering or clicking any data point reveals its exact source citation snippet, source URL, and timestamp.
4. **Operational Observability:** Live terminal-style execution logs, visual step-by-step pipeline DAG with elapsed time and record counters.
5. **Keyboard & Power-User Friendly:** Filter chips, quick prompt templates, instant CSV/JSON exports, and clear view toggles.

---

## 2. Color Palette & Typography

### 2.1 Theme & Dark Mode Foundation
```css
/* Core Palette Tokens */
--bg-app:        #09090b; /* Zinc 950 - Deep Obsidian */
--bg-surface:    #121215; /* Zinc 900 modified - Crisp Elevated Surface */
--bg-elevated:   #18181b; /* Zinc 800 - Modals, Drawers, Dropdowns */
--border-subtle: #27272a; /* Zinc 800 - Clean 1px structural dividing lines */
--border-focus:  #3f3f46; /* Zinc 700 - Focus and active state borders */

--text-primary:   #f4f4f5; /* Zinc 100 - Razor-sharp high contrast reading */
--text-secondary: #a1a1aa; /* Zinc 400 - Labels, schema hints, secondary data */
--text-muted:     #71717a; /* Zinc 500 - Timestamps, subtle metadata */

--accent-primary: #3b82f6; /* Electric Cobalt Blue - Primary Actions & Focus */
--accent-glow:    rgba(59, 130, 246, 0.15);

--status-success: #10b981; /* Emerald 500 - Verified, Deduplicated, Validated */
--status-warning: #f59e0b; /* Amber 500 - Partial Match, Low Confidence */
--status-error:   #f43f5e; /* Rose 500 - Crawl Blocked, Schema Mismatch */
--status-info:    #06b6d4; /* Cyan 500 - Pipeline In-Progress / Crawling */
```

### 2.2 Typography Hierarchy
- **Primary Body & UI:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif` (Clean, legible, optimized for data density).
- **Code, Schemas, & Lineage Snippets:** `JetBrains Mono`, `Fira Code`, `ui-monospace`, `monospace` (Used for regex, URLs, IDs, timestamps, and JSON payloads).

---

## 3. Core Component Anatomy

### 3.1 Prompt & Intent Input Bar
- Floating command-style input with subtle keyboard hint (`Enter ↵ to run`).
- One-click prompt presets (e.g., *"Top YC AI Startups"*, *"Remote AI Engineers"*, *"SaaS Pricing Tiers"*).
- Instant Schema Preview pill bar showing detected fields before full execution.

### 3.2 Live Pipeline DAG & Execution Telemetry
A horizontal execution pipeline showing live step progression:
```
[1. Intent Synthesizer] ──► [2. Source Harvester] ──► [3. Document Parser] ──► [4. Entity Extraction] ──► [5. Validation & Dedup] ──► [6. Lineage Index]
      ● Completed                 ● Completed               ● In Progress             ○ Pending                 ○ Pending                  ○ Pending
```
- Accompanied by a collapsible **Live Agent Execution Console** with timestamped log streams.

### 3.3 The Data Workbench & Table View
- **Controls Header:** Global quick search, column visibility toggle, export dropdown (CSV, JSON, Markdown), and view mode switch (Table / Analytics Cards / Raw JSON).
- **Interactive Rows:**
  - Alternating subtle rows with hover highlight.
  - Verification Badge column (e.g. `98% Valid`, `Duplicate Merged`).
  - Clickable source citations: clicking opens the **Citation Drawer**.

### 3.4 Citation & Lineage Inspector Drawer
A right-hand flyout drawer that opens when any cell is clicked:
- **Field Name & Value:** The exact extracted string.
- **Source Authority:** Domain icon, full URL, HTTP status code.
- **Verbatim Proof Context:** A highlighted text card showing the 100-character context window from the original web page where the AI found the fact.
- **Confidence Rating:** Extraction confidence meter.

### 3.5 Analytics & Distribution View
- Real-time KPI counters: Total Entities, Cleaned & Deduplicated, Sources Consulted, Execution Latency.
- Distribution bar charts for categorical attributes.

---

## 4. Interaction & Motion Rules
- Transitions are strictly snappy: `150ms` to `200ms` cubic bezier.
- No floaty bouncy animations. Only crisp state changes, subtle skeletons on loading, and smooth drawer slide-ins.
