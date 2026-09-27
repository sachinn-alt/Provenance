import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  Compass, 
  Filter, 
  Binary, 
  GitMerge, 
  Database,
  Info
} from 'lucide-react';
import { ExecutionStep, ExecutionPhase } from '@/types';
import { DagInspectorModal } from './DagInspectorModal';

interface PipelineDAGProps {
  steps: ExecutionStep[];
  isRunning: boolean;
}

const PHASE_ICONS: Record<ExecutionPhase, React.ElementType> = {
  intent: Sparkles,
  discovery: Compass,
  crawl: Filter,
  extract: Binary,
  validate: GitMerge,
  export: Database
};

export const PipelineDAG: React.FC<PipelineDAGProps> = ({ steps, isRunning }) => {
  const [selectedStep, setSelectedStep] = useState<ExecutionStep | null>(null);

  return (
    <>
      <div className="w-full bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <h3 className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Multi-Stage Autonomous Pipeline DAG
            </h3>
            <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
              (Click any stage node to inspect agent architecture & policy rules)
            </span>
          </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Done
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Active
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-zinc-700" /> Pending
          </span>
        </div>
      </div>

      {/* DAG Nodes Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {steps.map((step, idx) => {
          const Icon = PHASE_ICONS[step.phase] || Sparkles;
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in_progress';
          const isFailed = step.status === 'failed';

          return (
            <div
              key={step.id}
              onClick={() => setSelectedStep(step)}
              className={`relative flex flex-col justify-between p-3 rounded-lg border transition-all cursor-pointer group hover:scale-[1.02] ${
                isCompleted
                  ? 'bg-zinc-900/80 border-emerald-500/40 hover:border-emerald-400 text-zinc-100 shadow-sm'
                  : isInProgress
                  ? 'bg-zinc-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                  : isFailed
                  ? 'bg-rose-950/20 border-rose-500/60 text-rose-300'
                  : 'bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700 text-zinc-500'
              }`}
              title="Click to inspect Agent Architecture & Mathematical Guardrails"
            >
              {/* Header: Stage Number & Status Icon */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/60 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  0{idx + 1}
                </span>

                <div>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isInProgress && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
                  {isFailed && <AlertCircle className="w-4 h-4 text-rose-400" />}
                  {!isCompleted && !isInProgress && !isFailed && (
                    <Circle className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500" />
                  )}
                </div>
              </div>

              {/* Title & Phase Icon */}
              <div className="flex items-start gap-2 my-1">
                <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                  isCompleted ? 'text-emerald-400' : isInProgress ? 'text-cyan-400' : 'text-zinc-600 group-hover:text-zinc-400'
                }`} />
                <h4 className="text-xs font-semibold leading-snug line-clamp-2 group-hover:text-zinc-100 transition-colors">
                  {step.label}
                </h4>
              </div>

              {/* Footer status / detail */}
              <div className="mt-2 pt-2 border-t border-zinc-800/40 text-[10px] font-mono flex items-center justify-between">
                {step.durationMs ? (
                  <span className="text-emerald-400">+{step.durationMs}ms</span>
                ) : isInProgress ? (
                  <span className="text-cyan-400 animate-pulse">Processing...</span>
                ) : (
                  <span className="text-zinc-600">Standby</span>
                )}
                <span className="text-[9px] text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Inspect &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Interactive Agent & Policy Rules Inspector Modal */}
    <DagInspectorModal
      step={selectedStep}
      onClose={() => setSelectedStep(null)}
    />
  </>
  );
};

