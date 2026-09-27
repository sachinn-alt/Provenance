'use client';

import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, CornerDownLeft, Layers, CheckCircle2 } from 'lucide-react';
import { PROMPT_PRESETS } from '@/lib/sampleData';
import { GeneratedSchema, PromptPreset } from '@/types';

interface PromptBarProps {
  onExecute: (prompt: string) => void;
  isRunning: boolean;
  currentSchema?: GeneratedSchema;
}

export const PromptBar: React.FC<PromptBarProps> = ({
  onExecute,
  isRunning,
  currentSchema
}) => {
  const [promptText, setPromptText] = useState(
    'Collect top 10 early-stage AI agent startups with founders, funding amount, headquarters, core tech stack, and careers link.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptText.trim() && !isRunning) {
      onExecute(promptText.trim());
    }
  };

  const handleSelectPreset = (preset: PromptPreset) => {
    setPromptText(preset.prompt);
    if (!isRunning) {
      onExecute(preset.prompt);
    }
  };

  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-5 backdrop-blur-sm shadow-xl relative overflow-hidden">
      
      {/* Background Grid Pattern subtle accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a08_1px,transparent_1px),linear-gradient(to_bottom,#27272a08_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Main Prompt Form */}
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono font-medium text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>NATURAL LANGUAGE DATA SPECIFICATION</span>
          </label>
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px]">Enter ↵</kbd> to launch workflow
          </span>
        </div>

        <div className="relative flex items-center">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            disabled={isRunning}
            placeholder="Describe what data to collect, attributes needed, and target criteria in plain English..."
            rows={2}
            className="w-full bg-zinc-950/90 border border-zinc-700/80 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 rounded-lg p-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none resize-none transition-all disabled:opacity-60"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <button
            type="submit"
            disabled={isRunning || !promptText.trim()}
            className={`absolute right-2.5 bottom-3 px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              isRunning
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-lg shadow-blue-600/20'
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                <span>Orchestrating...</span>
              </>
            ) : (
              <>
                <span>Execute Workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Chips */}
      <div className="mt-3.5 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-2 relative z-10">
        <span className="text-[11px] font-mono text-zinc-500">Benchmark Presets:</span>
        {PROMPT_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            disabled={isRunning}
            className="text-xs px-2.5 py-1 rounded-md bg-zinc-800/70 hover:bg-zinc-700/70 active:bg-zinc-800 text-zinc-300 border border-zinc-700/50 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400/80" />
            <span>{preset.title}</span>
          </button>
        ))}
      </div>

      {/* Schema Attributes Preview Bar (if schema is available) */}
      {currentSchema && currentSchema.attributes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center gap-2 relative z-10">
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-zinc-200">{currentSchema.entityName}</span>
            <span className="text-zinc-500">({currentSchema.attributes.length} fields):</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {currentSchema.attributes.map((attr) => (
              <span
                key={attr.name}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800 flex items-center gap-1"
              >
                <span>{attr.name}</span>
                <span className="text-zinc-500 text-[9px] uppercase">[{attr.type}]</span>
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
