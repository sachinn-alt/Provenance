export type AttributeType = 'string' | 'number' | 'currency' | 'url' | 'date' | 'badge';

export interface SchemaAttribute {
  name: string;
  type: AttributeType;
  description: string;
  required: boolean;
  example?: string;
}

export interface SearchStrategy {
  suggestedQueries: string[];
  targetDomainHints: string[];
  permittedPolicies?: string[];
}

export interface GeneratedSchema {
  entityName: string;
  description: string;
  primaryKeys: string[];
  attributes: SchemaAttribute[];
  searchStrategy: SearchStrategy;
}

export interface CellProvenance {
  value: any;
  sourceUrl: string;
  sourceDomain: string;
  exactQuote: string;
  confidence: number; // 0.00 to 1.00
  extractedAt: string;
}

export interface ExtractedRecord {
  id: string;
  entityName: string;
  data: Record<string, any>;
  provenance: Record<string, CellProvenance>;
  validationScore: number; // 0 to 100
  isDuplicate: boolean;
  duplicateOf?: string;
  mergedSources: string[];
}

export type ExecutionPhase = 
  | 'intent'       // Step 1: Deconstruct Prompt & Formulate Schema
  | 'discovery'    // Step 2: Source Discovery & robots.txt verification
  | 'crawl'        // Step 3: Fetching & HTML-to-Markdown Sanitization
  | 'extract'      // Step 4: Structured Entity Extraction + Citation Anchoring
  | 'validate'     // Step 5: Normalization, Deduplication & Quality Indexing
  | 'export';      // Step 6: Dataset Ready & Published

export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface ExecutionStep {
  id: string;
  phase: ExecutionPhase;
  label: string;
  description: string;
  status: StepStatus;
  timestamp: string;
  durationMs?: number;
  detail?: string;
  metadata?: Record<string, any>;
}

export interface WorkflowLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  phase: ExecutionPhase;
  message: string;
  data?: any;
}

export interface WorkflowSummary {
  totalExtracted: number;
  validRate: number; // percentage (0 - 100)
  sourcesCount: number;
  avgConfidence: number; // percentage (0 - 100)
  durationMs: number;
  dedupCount: number;
}

export interface WorkflowRun {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';
  prompt: string;
  mode: 'live' | 'demo';
  schema: GeneratedSchema;
  steps: ExecutionStep[];
  records: ExtractedRecord[];
  logs: WorkflowLog[];
  summary: WorkflowSummary;
}

export interface PromptPreset {
  id: string;
  title: string;
  category: string;
  prompt: string;
  description: string;
}
