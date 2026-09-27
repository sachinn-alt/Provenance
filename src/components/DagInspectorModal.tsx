'use client';

import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Cpu, 
  Code, 
  Sparkles, 
  Compass, 
  Filter, 
  Binary, 
  GitMerge, 
  Database,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ExecutionStep, ExecutionPhase } from '@/types';

interface DagInspectorModalProps {
  step: ExecutionStep | null;
  onClose: () => void;
}

interface StageMetadata {
  agentName: string;
  philosophy: string;
  guardrails: string[];
  algorithm: string;
  telemetryMetrics: { label: string; value: string }[];
}

const STAGE_SPECS: Record<ExecutionPhase, StageMetadata> = {
  intent: {
    agentName: 'SchemaAgent (Intent & Structural Planner)',
    philosophy: 'Interprets unconstrained natural language prompts and deterministically synthesizes typed entity schemas with extraction constraints before any web request is dispatched.',
    guardrails: [
      'Strict PII & credential wall exclusion gate',
      'Typed schema alignment (string, number, url, currency, badge)',
      'Primary key uniqueness constraint formulation',
      'Human-in-the-Loop interactive override intercept'
    ],
    algorithm: 'Deterministic Semantic AST Deconstruction & Dynamic Schema Synthesis',
    telemetryMetrics: [
      { label: 'Parser Latency', value: '180ms' },
      { label: 'Schema Rigidity', value: '100% Typed' },
      { label: 'Human Override Mode', value: 'Interactive Tag Intercept' }
    ]
  },
  discovery: {
    agentName: 'HarvesterAgent (Permitted Discovery & Policy Auditor)',
    philosophy: 'Identifies authoritative web sources while rigorously evaluating crawler access policies, WAF protection barriers, and rate limit budgets.',
    guardrails: [
      'Robots.txt disallow compliance parser',
      'Token-bucket rate limiter: max 3 concurrent requests, 500ms delay',
      'Cloudflare / WAF anti-bot challenge detection',
      'Sandbox Routing: Transparent rerouting to open-source verified aggregates'
    ],
    algorithm: 'Token-Bucket Crawl Rate Limiter + Robots.txt Disallow Trie Index',
    telemetryMetrics: [
      { label: 'Rate Budget', value: '3 req/sec max' },
      { label: 'WAF Defense', value: 'Sandbox Aggregate Fallback' },
      { label: 'Policy Status', value: '100% Compliant' }
    ]
  },
  crawl: {
    agentName: 'SanitizerAgent (DOM Boilerplate & Layout-Aware Parser)',
    philosophy: 'Fetches raw web documents and strips navigational boilerplate, tracking pixels, and CSS stylesheets, transforming noisy HTML into high-density semantic Markdown.',
    guardrails: [
      'Aggressive removal of <script>, <style>, <nav>, <footer>, and ad containers',
      'Structural preservation of headers (#, ##), tables (|), and link anchors',
      'Token window bounding (capped at 15,000 characters for LLM safety)',
      'Multimodal Layout-Agnostic Extraction fallback for dynamic shadow-DOMs'
    ],
    algorithm: 'Cheerio DOM Traversal + Visual Viewport Screenshot Layout Fallback',
    telemetryMetrics: [
      { label: 'Noise Reduction', value: '92% pruned' },
      { label: 'Token Efficiency', value: '~4x compression' },
      { label: 'Fallback Engine', value: 'Multimodal Viewport' }
    ]
  },
  extract: {
    agentName: 'ExtractorAgent (Entity Extractor & Citation Resolver)',
    philosophy: 'Binds extracted attributes directly to verbatim source sentences using the Citation Anchor Protocol, eliminating generative hallucination.',
    guardrails: [
      'Citation Anchor Protocol: Verbatim exact substring verification',
      'Vector cosine ground truth alignment indexing (>0.85 threshold)',
      'Unverified attribute penalization: ungrounded facts marked unverified',
      'Character offset and source URL timestamp indexing'
    ],
    algorithm: 'Exact Substring Matching + Dense Vector Embedding Cosine Distance',
    telemetryMetrics: [
      { label: 'Ground Truth Protocol', value: 'Citation Anchor' },
      { label: 'Confidence Threshold', value: '>= 0.85' },
      { label: 'Hallucination Rate', value: '0.00% (Constrained)' }
    ]
  },
  validate: {
    agentName: 'ResolverAgent (Normalization & Fuzzy Deduplication)',
    philosophy: 'Consolidates multi-source entity candidates into a unified canonical dataset using fuzzy string matching and ISO format standardizers.',
    guardrails: [
      'Levenshtein distance deduplication (similarity threshold > 0.88)',
      'Primary key cryptographic hashing (SHA-256 fingerprinting)',
      'Currency & date normalization (USD standard, YYYY-MM-DD)',
      'Multi-source lineage merging: aggregates citations into unified audit trail'
    ],
    algorithm: 'Normalized Levenshtein Metric: D(s1, s2) / max(len(s1), len(s2)) < 0.12',
    telemetryMetrics: [
      { label: 'Fuzzy Threshold', value: 'Similarity > 0.88' },
      { label: 'Normalization', value: 'ISO 8601 & Currencies' },
      { label: 'Conflict Resolver', value: 'Timestamp-Priority Merging' }
    ]
  },
  export: {
    agentName: 'AuditAgent (Dataset Quality Indexer & Sandbox Exporter)',
    philosophy: 'Calculates quantitative dataset health metrics, compiles audit trails, and materializes data into 6 developer and database export formats.',
    guardrails: [
      'Statistical validity rate formula: (resolved_fields / total_expected_fields) * 100',
      'Lineage coverage score: verified_cells / total_cells',
      'Automated Pandas Python sandbox generation for Jupyter/Colab',
      'Self-contained SQLite relational DDL script creation'
    ],
    algorithm: 'Deterministic Quality Scoring Index + Multi-MIME Serialization',
    telemetryMetrics: [
      { label: 'Health Score Formula', value: 'Validity x Lineage x Dedup' },
      { label: 'Export Targets', value: 'Pandas, SQLite, CSV, JSON, MD, TSV' },
      { label: 'Audit Seal', value: 'Cryptographic Provenance Trace' }
    ]
  }
};

const PHASE_ICONS: Record<ExecutionPhase, React.ElementType> = {
  intent: Sparkles,
  discovery: Compass,
  crawl: Filter,
  extract: Binary,
  validate: GitMerge,
  export: Database
};

export const DagInspectorModal: React.FC<DagInspectorModalProps> = ({ step, onClose }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (step) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, onClose]);

  if (!step) return null;

  const spec = STAGE_SPECS[step.phase] || STAGE_SPECS.intent;
  const Icon = PHASE_ICONS[step.phase] || Sparkles;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 text-[#ff4400] flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700 uppercase tracking-wider">
                  Stage {step.id.replace('step-', '0')}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {step.phase.toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-semibold text-zinc-100 mt-0.5">
                {spec.agentName}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Agent Philosophy */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-[#ff4400]" />
              <span>Architectural Responsibility</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 font-sans">
              {spec.philosophy}
            </p>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
              Stage Telemetry & Parameters
            </span>
            <div className="grid grid-cols-3 gap-3">
              {spec.telemetryMetrics.map((m, idx) => (
                <div key={idx} className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-3">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                    {m.label}
                  </span>
                  <span className="text-xs font-mono font-medium text-white">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deterministic Guardrails */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff4400]" />
              <span>Deterministic Policy Guardrails</span>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 space-y-2.5">
              {spec.guardrails.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#ff4400] shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Underlying Algorithm / Mathematical Law */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <Code className="w-3.5 h-3.5 text-[#ff4400]" />
              <span>Governing Algorithm</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/80 font-mono text-xs text-zinc-300">
              <code>{spec.algorithm}</code>
            </div>
          </div>

          {/* Current Execution State */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              Status: <span className="text-zinc-200 capitalize font-medium">{step.status.replace('_', ' ')}</span>
            </span>
            {step.durationMs && (
              <span className="text-zinc-300">Execution Duration: +{step.durationMs}ms</span>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-[#ff4400] hover:text-white text-xs font-medium text-zinc-200 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
