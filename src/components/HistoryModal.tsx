'use client';

import React from 'react';
import { X, History, ArrowRight, CheckCircle2, Clock, Layers, Sparkles } from 'lucide-react';
import { WorkflowRun } from '@/types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflows: WorkflowRun[];
  onSelectWorkflow: (workflow: WorkflowRun) => void;
  activeWorkflowId?: string;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  workflows,
  onSelectWorkflow,
  activeWorkflowId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Workflow & Dataset History</h3>
              <p className="text-[11px] font-mono text-zinc-500">
                Explore, restore, or re-inspect previous intelligence runs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workflow List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {workflows.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 font-mono text-xs">
              No historical runs recorded yet.
            </div>
          ) : (
            workflows.map((wf) => {
              const isActive = wf.id === activeWorkflowId;
              const dateStr = new Date(wf.createdAt).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={wf.id}
                  onClick={() => {
                    onSelectWorkflow(wf);
                    onClose();
                  }}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-zinc-900 border-blue-500/60 shadow-md ring-1 ring-blue-500/20'
                      : 'bg-zinc-900/40 hover:bg-zinc-900/80 border-zinc-800'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-zinc-200 truncate">
                        {wf.schema.entityName || 'Unstructured Dataset'}
                      </span>
                      {isActive && (
                        <span className="px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono border border-blue-500/20">
                          Active
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {dateStr}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1">
                      "{wf.prompt}"
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 pt-1">
                      <span>{wf.records.length} records</span>
                      <span>•</span>
                      <span className="text-emerald-400">{wf.summary.validRate}% valid</span>
                      <span>•</span>
                      <span>{wf.summary.sourcesCount} sources</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-blue-600 hover:text-white text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
