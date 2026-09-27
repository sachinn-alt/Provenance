import { GeneratedSchema, SchemaAttribute } from '@/types';
import { PRESET_DATASETS } from './sampleData';

export async function generateSchemaFromPrompt(prompt: string, mode: 'live' | 'demo' = 'demo'): Promise<GeneratedSchema> {
  const normalized = prompt.toLowerCase();

  // 1. Check if it matches a preset or close keyword match
  if (normalized.includes('keyboard') || normalized.includes('switch')) {
    return PRESET_DATASETS['mech-keyboards'].schema;
  }
  if (normalized.includes('job') || normalized.includes('role') || normalized.includes('hire') || normalized.includes('engineer')) {
    return PRESET_DATASETS['remote-ai-jobs'].schema;
  }
  if (normalized.includes('startup') || normalized.includes('founder') || normalized.includes('funding') || normalized.includes('seed') || normalized.includes('series a')) {
    return PRESET_DATASETS['ai-startups'].schema;
  }

  // 2. Try Gemini API if API key is provided and mode is live
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && mode === 'live') {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert Data Architect for an automated web intelligence agent.
Analyze this user request: "${prompt}"

Generate a strictly structured extraction schema in JSON conforming to:
{
  "entityName": "string (PascalCase, e.g. ProductItem, VentureFund, JobPost)",
  "description": "string (1-sentence description)",
  "primaryKeys": ["string", "1 or 2 attribute names that uniquely identify an item"],
  "attributes": [
    {
      "name": "string (camelCase)",
      "type": "string" | "number" | "currency" | "url" | "date" | "badge",
      "description": "string",
      "required": boolean,
      "example": "string"
    }
  ],
  "searchStrategy": {
    "suggestedQueries": ["3-5 targeted web search queries"],
    "targetDomainHints": ["3-4 reputable domains to harvest"]
  }
}
Respond with RAW JSON ONLY. No markdown, no commentary.`
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed.entityName && Array.isArray(parsed.attributes)) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('Gemini schema generation failed, falling back to heuristic engine:', err);
    }
  }

  // 3. Deterministic Heuristic Schema Synthesizer (Zero-Failure Fallback)
  return synthesizeHeuristicSchema(prompt);
}

function synthesizeHeuristicSchema(prompt: string): GeneratedSchema {
  const words = prompt.split(/\s+/).filter(w => w.length > 2);
  const subjectWord = words.find(w => !['find', 'collect', 'scrape', 'extract', 'list', 'the', 'top', 'with', 'from', 'and'].includes(w.toLowerCase())) || 'Item';
  const entityName = subjectWord.charAt(0).toUpperCase() + subjectWord.slice(1).replace(/[^a-zA-Z0-9]/g, '') + 'Record';

  const attributes: SchemaAttribute[] = [
    { name: 'name', type: 'string', description: `Name or title of the ${subjectWord}`, required: true, example: 'Primary Entity' },
    { name: 'category', type: 'badge', description: 'Domain classification or category', required: true, example: 'Standard' },
    { name: 'description', type: 'string', description: 'Overview and specifications', required: true, example: 'High quality record details' }
  ];

  const lower = prompt.toLowerCase();
  if (lower.includes('price') || lower.includes('cost') || lower.includes('salary') || lower.includes('rate') || lower.includes('fee')) {
    attributes.push({ name: 'estimatedCost', type: 'currency', description: 'Price, compensation, or valuation', required: true, example: '$120 - $250' });
  }
  if (lower.includes('link') || lower.includes('url') || lower.includes('site') || lower.includes('page') || lower.includes('career')) {
    attributes.push({ name: 'referenceUrl', type: 'url', description: 'Direct web link or application portal', required: true, example: 'https://example.com/details' });
  }
  if (lower.includes('date') || lower.includes('year') || lower.includes('founded') || lower.includes('time')) {
    attributes.push({ name: 'dateRecorded', type: 'date', description: 'Established date or record timestamp', required: false, example: '2025-06-15' });
  }
  if (lower.includes('rating') || lower.includes('score') || lower.includes('count') || lower.includes('metric')) {
    attributes.push({ name: 'scoreMetric', type: 'number', description: 'Quantitative score or metric', required: false, example: '94' });
  }

  return {
    entityName,
    description: `Automated data extraction for: "${prompt.slice(0, 80)}"`,
    primaryKeys: ['name'],
    attributes,
    searchStrategy: {
      suggestedQueries: [
        `${prompt} directory list`,
        `top ${subjectWord} specifications and data`,
        `site:github.com ${subjectWord} dataset`
      ],
      targetDomainHints: ['wikipedia.org', 'crunchbase.com', 'news.ycombinator.com', 'producthunt.com']
    }
  };
}
