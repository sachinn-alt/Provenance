'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, 
  GitCompare, 
  PlusCircle, 
  MinusCircle, 
  RefreshCw, 
  ArrowRight, 
  Layers
} from 'lucide-react';
import { WorkflowRun, RecordDiff, RunDiffSummary } from '@/types';

interface DiffViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflows: WorkflowRun[];
  currentWorkflowId?: string;
}

export const DiffViewerModal: React.FC<DiffViewerModalProps> = ({
  isOpen,
  onClose,
  workflows,
  currentWorkflowId
}) => {
  const [selectedRunAId, setSelectedRunAId] = useState<string>(() => {
    return workflows.length > 1 ? workflows[1].id : (workflows[0]?.id || '');
  });
  const [selectedRunBId, setSelectedRunBId] = useState<string>(() => {
    return currentWorkflowId || workflows[0]?.id || '';
  });

  const runA = useMemo(() => workflows.find(w => w.id === selectedRunAId), [workflows, selectedRunAId]);
  const runB = useMemo(() => workflows.find(w => w.id === selectedRunBId), [workflows, selectedRunBId]);

  // Compute Delta & Change Detection
  const diffSummary: RunDiffSummary = useMemo(() => {
    if (!runA || !runB) {
      return {
        runAId: selectedRunAId,
        runBId: selectedRunBId,
        addedCount: 0,
        removedCount: 0,
        modifiedCount: 0,
        unchangedCount: 0,
        volatilityPercentage: 0,
        diffs: []
      };
    }

    const recordsA = runA.records || [];
    const recordsB = runB.records || [];

    // Helper to get key identifier for a record
    const getRecordKey = (r: any, schema: any) => {
      const pks = schema?.primaryKeys || [];
      if (pks.length > 0 && r.data[pks[0]]) {
        return String(r.data[pks[0]]).toLowerCase().trim();
      }
      const firstField = Object.keys(r.data || {})[0];
      return String(r.data[firstField] || r.id).toLowerCase().trim();
    };

    const mapA = new Map<string, any>();
    recordsA.forEach(r => mapA.set(getRecordKey(r, runA.schema), r));

    const mapB = new Map<string, any>();
    recordsB.forEach(r => mapB.set(getRecordKey(r, runB.schema), r));

    const diffs: RecordDiff[] = [];
    let addedCount = 0;
    let removedCount = 0;
    let modifiedCount = 0;
    let unchangedCount = 0;

    // Check records in B (New or Modified or Unchanged)
    mapB.forEach((recB, key) => {
      if (!mapA.has(key)) {
        addedCount++;
        diffs.push({
          type: 'added',
          primaryKey: key,
          recordB: recB
        });
      } else {
        const recA = mapA.get(key);
        const fieldChanges: { fieldName: string; oldValue: any; newValue: any }[] = [];

        const allFields = new Set([
          ...Object.keys(recA.data || {}),
          ...Object.keys(recB.data || {})
        ]);

        allFields.forEach(field => {
          const valA = recA.data?.[field];
          const valB = recB.data?.[field];
          if (String(valA ?? '') !== String(valB ?? '')) {
            fieldChanges.push({
              fieldName: field,
              oldValue: valA ?? 'null',
              newValue: valB ?? 'null'
            });
          }
        });

        if (fieldChanges.length > 0) {
          modifiedCount++;
          diffs.push({
            type: 'modified',
            primaryKey: key,
            recordA: recA,
            recordB: recB,
            fieldChanges
          });
        } else {
          unchangedCount++;
          diffs.push({
            type: 'unchanged',
            primaryKey: key,
            recordA: recA,
            recordB: recB
          });
        }
      }
    });

    // Check records in A that are missing in B (Removed)
    mapA.forEach((recA, key) => {
      if (!mapB.has(key)) {
        removedCount++;
        diffs.push({
          type: 'removed',
          primaryKey: key,
          recordA: recA
        });
      }
    });

    const totalRecords = Math.max(recordsA.length, recordsB.length, 1);
    const volatilityPercentage = Math.min(100, Math.round(((addedCount + removedCount + modifiedCount) / totalRecords) * 100));

    return {
      runAId: selectedRunAId,
      runBId: selectedRunBId,
      addedCount,
      removedCount,
      modifiedCount,
      unchangedCount,
      volatilityPercentage,
      diffs
    };
  }, [runA, runB, selectedRunAId, selectedRunBId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div 
        className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ff4400]/15 border border-[#ff4400]/30 flex items-center justify-center text-[#ff4400]">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                Continuous Monitoring // Change Detection Diff Engine
              </h2>
              <p className="text-xs text-zinc-400">
                Compare multi-pass crawler runs, detect added entities, and identify volatile field updates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Run Selector Bar */}
        <div className="px-6 py-3 bg-zinc-900/40 border-b border-zinc-800/60 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          {/* Baseline Run A */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 uppercase font-semibold">Baseline Run (A):</span>
            <select
              value={selectedRunAId}
              onChange={(e) => setSelectedRunAId(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-zinc-200 font-mono text-xs focus:outline-none focus:border-[#ff4400]"
            >
              {workflows.map((w, idx) => (
                <option key={w.id} value={w.id}>
                  Run #{workflows.length - idx} • {w.schema?.entityName || 'Entities'} ({w.records?.length || 0} recs)
                </option>
              ))}
            </select>
          </div>

          <div className="text-zinc-500 flex items-center gap-1">
            <ArrowRight className="w-4 h-4 text-[#ff4400]" />
          </div>

          {/* Target Run B */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 uppercase font-semibold">Current Run (B):</span>
            <select
              value={selectedRunBId}
              onChange={(e) => setSelectedRunBId(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-zinc-200 font-mono text-xs focus:outline-none focus:border-[#ff4400]"
            >
              {workflows.map((w, idx) => (
                <option key={w.id} value={w.id}>
                  Run #{workflows.length - idx} • {w.schema?.entityName || 'Entities'} ({w.records?.length || 0} recs)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Change Volatility Metrics Bar */}
        <div className="px-6 py-3 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+{diffSummary.addedCount} Added</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-400">
              <MinusCircle className="w-3.5 h-3.5" />
              <span>-{diffSummary.removedCount} Removed</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>~{diffSummary.modifiedCount} Modified</span>
            </div>
            <div className="text-zinc-500 hidden sm:inline">
              ={diffSummary.unchangedCount} Identical
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Volatility Score:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              diffSummary.volatilityPercentage > 30 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {diffSummary.volatilityPercentage}% Volatility
            </span>
          </div>
        </div>

        {/* Diff List Body */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs">
          {diffSummary.diffs.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-mono">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
              <p>No records to compare between selected runs.</p>
            </div>
          ) : (
            diffSummary.diffs.map((diff, idx) => {
              const rec = diff.recordB || diff.recordA;
              const primaryTitle = rec?.data?.[Object.keys(rec.data || {})[0]] || diff.primaryKey;

              return (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    diff.type === 'added'
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                      : diff.type === 'removed'
                      ? 'bg-red-950/20 border-red-800/40 text-red-200'
                      : diff.type === 'modified'
                      ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                      : 'bg-zinc-900/30 border-zinc-800/50 text-zinc-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        diff.type === 'added'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : diff.type === 'removed'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : diff.type === 'modified'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {diff.type}
                      </span>
                      <span className="font-semibold text-zinc-100">{primaryTitle}</span>
                    </div>

                    <span className="text-[10px] font-mono text-zinc-500">
                      ID: {rec?.id?.slice(0, 14)}...
                    </span>
                  </div>

                  {/* Show Field Modifications */}
                  {diff.type === 'modified' && diff.fieldChanges && (
                    <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-amber-500/40 font-mono text-[11px]">
                      {diff.fieldChanges.map((change, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-2 flex-wrap">
                          <span className="text-zinc-400 font-semibold">{change.fieldName}:</span>
                          <span className="line-through text-red-400/80 bg-red-950/30 px-1 rounded">
                            {String(change.oldValue)}
                          </span>
                          <ArrowRight className="w-3 h-3 text-zinc-500 inline" />
                          <span className="text-emerald-400 font-bold bg-emerald-950/40 px-1 rounded">
                            {String(change.newValue)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Show Record Data for Added or Removed */}
                  {(diff.type === 'added' || diff.type === 'removed') && (
                    <div className="text-[11px] font-mono text-zinc-400 truncate opacity-80 mt-1">
                      {JSON.stringify(rec?.data || {})}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between font-mono text-xs">
          <div className="text-zinc-500">
            Autonomous diff index computed against primary key hashes
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
          >
            Close Diff Engine
          </button>
        </div>

      </div>
    </div>
  );
};
