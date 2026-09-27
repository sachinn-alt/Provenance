# LLM Engineering & Model Strategy (LLM.md)
## Project: Provenance – Autonomous Data Intelligence Platform
**Model Strategy:** Multi-Provider Adapter + Structured Output Enforcers + Heuristic Fallback  
**Supported Providers:** Google Gemini (1.5 Flash / 2.0 Flash), Groq Cloud (Llama 3), OpenAI Compatible, Deterministic Fallback  
**Version:** 1.0.0  

---

## 1. Model Selection & Rationale

| Provider | Model | Latency | Cost (Free Tier) | Usage in SynapseData |
| :--- | :--- | :--- | :--- | :--- |
| **Google Gemini** | `gemini-1.5-flash` / `gemini-2.0-flash` | ~400–800ms | **100% Free** (15 RPM / 1M TPM on AI Studio) | Primary Schema Generation & Deep Document Entity Extraction |
| **Groq Cloud** | `llama-3.1-70b-versatile` / `8b-instant` | ~200–400ms | **100% Free** (Generous daily free tier) | High-speed structured extraction alternative |
| **Deterministic Engine** | Local Heuristic Parser | <15ms | **$0.00 / 0 Tokens** | Instant offline execution, automated unit testing, guaranteed zero-failure demo fallback |

---

## 2. Prompt Engineering Architecture

### 2.1 Schema Generation System Prompt (`SchemaAgent`)
```
You are an expert Data Architect and Extraction Planner.
Your task is to analyze the user's natural language business requirement and synthesize a complete, strongly-typed extraction schema and web crawl blueprint.

OUTPUT REQUIREMENTS:
You MUST respond strictly with a valid JSON object conforming to this TypeScript interface:
{
  "entityName": "string (PascalCase, e.g. EarlyStageStartup)",
  "description": "string (1-sentence summary of the entity)",
  "primaryKeys": ["string", "key field names used for deduplication"],
  "attributes": [
    {
      "name": "string (camelCase, e.g. fundingAmount)",
      "type": "string" | "number" | "currency" | "url" | "date" | "badge",
      "description": "string (precise definition of what to extract)",
      "required": boolean
    }
  ],
  "searchStrategy": {
    "suggestedQueries": ["3-5 targeted search queries"],
    "targetDomainHints": ["domains likely to host this data"]
  }
}

RULES:
- Keep attributes focused (typically 4-8 high-value attributes).
- Always include an authoritative link or identifier if applicable.
- Do NOT output markdown code fences or conversational text. Return raw JSON only.
```

### 2.2 Entity & Citation Extraction System Prompt (`ExtractorAgent`)
```
You are a High-Precision Structured Extraction Engine with strict anti-hallucination protocols.
Given a document markdown snippet and an extraction schema, extract all entities matching the schema.

CRITICAL CITATION RULE:
Every extracted field value MUST be accompanied by the exact verbatim quote (10-150 characters) from the text that proves the value is accurate. 
If an attribute value is not explicitly stated in the text, set its value to null and quote to "". NEVER invent facts, urls, or numbers.

OUTPUT FORMAT:
{
  "entities": [
    {
      "attributes": {
        "<fieldName>": {
          "value": <extracted_value_or_null>,
          "exactQuote": "<verbatim sentence from text>",
          "confidence": <float between 0.0 and 1.0>
        }
      }
    }
  ]
}
```

---

## 3. Token Efficiency & Cost Reduction Rules
1. **Aggressive Noise Elimination:** Raw web pages are stripped of all script, style, advertising, and navigation tags before tokenization. This yields an **85% reduction in token consumption**.
2. **Chunk Prioritization:** Documents are chunked into 2,000–3,500 token segments with header preservation to prevent context window overflow.
3. **Structured Output Enforcement:** Models are invoked with `response_mime_type: "application/json"` to avoid expensive retry loops caused by malformed markdown formatting.

---

## 4. Deterministic Heuristic Fallback Engine
To eliminate dependency on live network connectivity or API key availability during hackathon stage judging, SynapseData ships with a **Deterministic Pattern Engine**:
- Evaluates regex patterns for emails, currencies (`$`, `€`, `£`, `M`, `B`), dates (`YYYY-MM-DD`, `Month YYYY`), domains, and telephone numbers.
- Uses semantic DOM tag extraction (`<h1>`, `<h2>`, table cells, `<dl>`, `<dt>`, `<dd>`) to extract structured records with 0 external network requests.
- Guarantees seamless offline demonstrations even in basement hackathon venues with zero Wi-Fi.
