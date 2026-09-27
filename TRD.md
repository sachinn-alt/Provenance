# Technical Requirements Document (TRD)
## Project: Provenance – Autonomous Data Intelligence Platform
**Architecture:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + Server-Sent Events (SSE)  
**Version:** 1.0.0  

---

## 1. High-Level Architecture Overview

SynapseData is built as a unified, high-performance TypeScript application leveraging Next.js App Router for frontend UI and backend agent orchestration.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SynapseData Frontend UI                         │
│  ┌────────────────────────┬──────────────────────┬──────────────────┐  │
│  │ Natural Prompt Input   │  Live Pipeline DAG   │  Data Workbench  │  │
│  │ (Schema Formulator)    │  (SSE Log Stream)    │  & Lineage Modal │  │
│  └────────────────────────┴──────────────────────┴──────────────────┘  │
└────────────────────────────────────▲───────────────────────────────────┘
                                     │ Server-Sent Events / REST
┌────────────────────────────────────▼───────────────────────────────────┐
│                     Next.js API Engine (Server-Side)                   │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                Orchestrator & Workflow Controller                │  │
│  └──────┬───────────────────────┬──────────────────────┬────────────┘  │
│         │                       │                      │               │
│  ┌──────▼─────────────┐  ┌──────▼────────────┐  ┌──────▼────────────┐  │
│  │   LLM Synthesis    │  │   Web Harvester   │  │   Normalization   │  │
│  │   & Schema Planner │  │ & Permitted Crawl │  │  & Deduplication  │  │
│  └────────────────────┘  └───────────────────┘  └───────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │               Lineage Tracker & Memory Data Store                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Subsystems & Components

### 2.1 Prompt Decomposer & Schema Formulator
- **Input:** Raw user string (e.g. *"Scrape top 10 remote AI engineers jobs with salaries and requirements"*).
- **Process:** 
  - Passes prompt to the LLM agent or built-in schema inference engine.
  - Outputs a strongly typed JSON Schema specification:
    ```typescript
    interface GeneratedSchema {
      entityName: string;
      description: string;
      primaryKeys: string[];
      attributes: {
        name: string;
        type: 'string' | 'number' | 'currency' | 'url' | 'date' | 'badge';
        description: string;
        required: boolean;
      }[];
      searchStrategy: {
        suggestedQueries: string[];
        targetDomainHints: string[];
        permittedSelectors?: string[];
      };
    }
    ```

### 2.2 Autonomous Web Harvester & Sanitizer
- **Fetching:** Standard fetch with configurable headers (custom User-Agent, Accept-Language, Accept: text/html).
- **Content Cleaning:**
  - Removes `<script>`, `<style>`, `<noscript>`, `<svg>`, `<nav>`, and `<footer>` elements.
  - Converts messy DOM nodes to high-density structured Markdown / plaintext chunks to minimize token consumption and maximize LLM attention.
- **Source Safety:** Evaluates URL against permitted patterns; checks mock repository if in Demo/Offline mode.

### 2.3 Extraction & Inference Engine
- Supports multiple LLM providers via an adapter pattern:
  - **Gemini API:** via `@google/genai` or standard REST endpoint with `gemini-1.5-flash` or `gemini-2.0-flash`.
  - **Groq API / OpenAI API:** via standard OpenAI-compatible format with fast Llama-3-70b/8b models.
  - **Deterministic Rule-Based Fallback Parser:** An intelligent regex/DOM pattern extraction engine ensuring 100% reliability during offline judging.

### 2.4 Data Cleaning, Validation & Deduplication Engine
- **Field Normalization:**
  - Currency: Normalizes `"$150k"`, `"150,000 USD"`, `"£120,000"` into standardized numerical values + ISO currency codes.
  - URLs: Resolves relative links to fully qualified canonical URLs.
  - Dates: Parses ISO 8601 strings.
- **Deduplication:**
  - Jaccard similarity and exact primary key hash checks.
  - Flags duplicate candidates and merges records while preserving all source references.
- **Validation Engine:**
  - Computes per-record validation score (0 to 100%) based on required field completeness and valid regex masks.

### 2.5 Lineage & Provenance Tracker
- Every single entity cell is wrapped with a provenance tuple:
  ```typescript
  interface CellProvenance {
    value: any;
    sourceUrl: string;
    sourceDomain: string;
    exactQuote: string;
    extractedAt: string;
    confidence: number; // 0.0 to 1.0
  }
  ```

---

## 3. Data Models & State Architecture

### 3.1 Workflow State & History
```typescript
interface WorkflowRun {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'idle' | 'planning' | 'crawling' | 'extracting' | 'validating' | 'completed' | 'failed';
  prompt: string;
  schema: GeneratedSchema;
  steps: ExecutionStep[];
  records: ExtractedRecord[];
  summary: {
    totalExtracted: number;
    validRate: number;
    sourcesCount: number;
    avgConfidence: number;
    durationMs: number;
  };
}

interface ExecutionStep {
  id: string;
  phase: 'intent' | 'discovery' | 'crawl' | 'extract' | 'validate' | 'export';
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp: string;
  detail?: string;
  metadata?: Record<string, any>;
}
```

---

## 4. API Endpoints & Protocols

| Route | Method | Description | Protocol |
| :--- | :--- | :--- | :--- |
| `/api/workflows` | `POST` | Initiates a new prompt execution. Returns `workflowId`. | JSON REST |
| `/api/workflows/[id]/stream` | `GET` | Live event stream of workflow execution steps, logs, and partial records. | Server-Sent Events (SSE) |
| `/api/workflows/[id]` | `GET` | Fetches complete workflow state, schema, and dataset. | JSON REST |
| `/api/workflows/history` | `GET` | Retrieves list of all past workflows. | JSON REST |
| `/api/workflows/export` | `POST` | Generates download payloads for CSV, JSON, Markdown, or TSV. | File / Text Stream |

---

## 5. Resilience & Hackathon Safeguards
1. **Zero-Crash Protocol:** Every external call is wrapped in a bounded circuit breaker (3-second timeout).
2. **Offline Mode Switch:** A visible, prominent toggle in the UI allows switching between `Live Web Agent` and `High-Speed Demo Cache`. This guarantees that if hackathon Wi-Fi degrades, the system continues demonstrating live without embarrassing errors.
3. **No External Database Requirement:** Local state is stored in an in-memory repository with local filesystem JSON persistence, allowing the entire application to boot with a single `npm run dev` with zero setup.
