import { WorkflowRun, ExecutionStep } from '@/types';
import { PRESET_DATASETS } from './sampleData';
import { normalizeAndDeduplicate } from './resolverAgent';

// In-memory store
const workflowsMap = new Map<string, WorkflowRun>();

export function getInitialSteps(): ExecutionStep[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'step-1',
      phase: 'intent',
      label: 'Deconstruct Intent & Formulate Schema',
      description: 'Parsing natural language semantics, extracting entity attributes, types, and primary keys.',
      status: 'pending',
      timestamp: now
    },
    {
      id: 'step-2',
      phase: 'discovery',
      label: 'Permitted Source Discovery & Policy Audit',
      description: 'Formulating search strategies, inspecting robots.txt, and validating rate limits.',
      status: 'pending',
      timestamp: now
    },
    {
      id: 'step-3',
      phase: 'crawl',
      label: 'Intelligent Crawling & DOM Sanitization',
      description: 'Fetching target documents, pruning script/style boilerplate, chunking into dense markdown.',
      status: 'pending',
      timestamp: now
    },
    {
      id: 'step-4',
      phase: 'extract',
      label: 'Entity Extraction & Citation Anchoring',
      description: 'Executing schema-aligned extraction, binding verbatim source quotes to every attribute.',
      status: 'pending',
      timestamp: now
    },
    {
      id: 'step-5',
      phase: 'validate',
      label: 'Normalization, Deduplication & Quality Audit',
      description: 'Standardizing currencies, formats, running Levenshtein deduplication, and calculating health scores.',
      status: 'pending',
      timestamp: now
    },
    {
      id: 'step-6',
      phase: 'export',
      label: 'Dataset Published & Lineage Indexed',
      description: 'Dataset materialized into interactive workbench ready for filtering, inspection, and export.',
      status: 'pending',
      timestamp: now
    }
  ];
}

export function getInitialSeedWorkflow(): WorkflowRun {
  const startupData = PRESET_DATASETS['ai-startups'];
  const { cleanedRecords, summary } = normalizeAndDeduplicate(startupData.records, startupData.schema, 3120);

  return {
    id: 'wf-seed-ai-startups',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3500000).toISOString(),
    status: 'completed',
    prompt: 'Collect top 10 early-stage AI agent startups with founders, funding amount, headquarters, core tech stack, and careers link.',
    mode: 'demo',
    schema: startupData.schema,
    steps: getInitialSteps().map(s => ({ ...s, status: 'completed' as const })),
    records: cleanedRecords,
    logs: [
      { id: 'l1', timestamp: new Date(Date.now() - 3590000).toISOString(), level: 'info', phase: 'intent', message: 'Deconstructed prompt into AIAgentStartup schema with 6 typed attributes.' },
      { id: 'l2', timestamp: new Date(Date.now() - 3570000).toISOString(), level: 'info', phase: 'discovery', message: 'Discovered 4 authoritative source domains: techcrunch.com, venturebeat.com, ycombinator.com, bloomberg.com.' },
      { id: 'l3', timestamp: new Date(Date.now() - 3550000).toISOString(), level: 'info', phase: 'crawl', message: 'Harvested 5 document pages. Pruned 78,000 DOM elements into 6.2KB clean semantic markdown.' },
      { id: 'l4', timestamp: new Date(Date.now() - 3530000).toISOString(), level: 'success', phase: 'extract', message: 'Extracted 6 entities with 100% Citation Anchor Protocol compliance.' },
      { id: 'l5', timestamp: new Date(Date.now() - 3510000).toISOString(), level: 'warn', phase: 'validate', message: 'Detected duplicate candidate: "Devin Technologies" matches primary key of "Cognition AI". Flagged and linked.' },
      { id: 'l6', timestamp: new Date(Date.now() - 3500000).toISOString(), level: 'success', phase: 'export', message: 'Workflow completed. 5 canonical records published with 97% health index.' }
    ],
    summary
  };
}

// Seed initial historical run
function seedInitialWorkflows() {
  if (workflowsMap.size === 0) {
    const initialWorkflow = getInitialSeedWorkflow();
    workflowsMap.set(initialWorkflow.id, initialWorkflow);
  }
}

seedInitialWorkflows();

export function createWorkflow(prompt: string, mode: 'live' | 'demo' = 'demo'): WorkflowRun {
  const id = `wf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const workflow: WorkflowRun = {
    id,
    createdAt: now,
    updatedAt: now,
    status: 'running',
    prompt,
    mode,
    schema: {
      entityName: 'AnalyzingRequirement',
      description: 'Deconstructing intent...',
      primaryKeys: ['name'],
      attributes: [],
      searchStrategy: { suggestedQueries: [], targetDomainHints: [] }
    },
    steps: getInitialSteps(),
    records: [],
    logs: [
      {
        id: `log-${Date.now()}-1`,
        timestamp: now,
        level: 'info',
        phase: 'intent',
        message: `Workflow initialized for prompt: "${prompt.slice(0, 60)}..."`
      }
    ],
    summary: {
      totalExtracted: 0,
      validRate: 0,
      sourcesCount: 0,
      avgConfidence: 0,
      durationMs: 0,
      dedupCount: 0
    }
  };

  workflowsMap.set(id, workflow);
  return workflow;
}

export function getWorkflow(id: string): WorkflowRun | undefined {
  return workflowsMap.get(id);
}

export function updateWorkflow(id: string, updates: Partial<WorkflowRun>): WorkflowRun | undefined {
  const existing = workflowsMap.get(id);
  if (!existing) return undefined;

  const updated: WorkflowRun = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  workflowsMap.set(id, updated);
  return updated;
}

export function getAllWorkflows(): WorkflowRun[] {
  seedInitialWorkflows();
  return Array.from(workflowsMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
