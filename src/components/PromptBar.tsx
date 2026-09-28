'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Plus, 
  X, 
  UserCheck 
} from 'lucide-react';
import { MorphIcon } from 'morphicons/react';
import { ArrowRight as ArrowRightData, Loader2 as Loader2Data } from 'lucide';
import { PROMPT_PRESETS } from '@/lib/sampleData';
import { GeneratedSchema, PromptPreset, SchemaAttribute, AttributeType } from '@/types';

interface PromptBarProps {
  onExecute: (prompt: string, customSchema?: GeneratedSchema) => void;
  isRunning: boolean;
  currentSchema?: GeneratedSchema;
  onUpdateSchema?: (updatedSchema: GeneratedSchema) => void;
}

export const PromptBar: React.FC<PromptBarProps> = ({
  onExecute,
  isRunning,
  currentSchema,
  onUpdateSchema
}) => {
  const [promptText, setPromptText] = useState(
    'Collect top 10 early-stage AI agent startups with founders, funding amount, headquarters, core tech stack, and careers link.'
  );

  // Human-in-the-Loop Refiner state
  const [isRefining, setIsRefining] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<AttributeType>('string');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        textareaRef.current?.focus();
        textareaRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Auto-grow textarea height as content expands
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollH, 48), 240)}px`;
    }
  }, [promptText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptText.trim() && !isRunning) {
      onExecute(promptText.trim(), currentSchema);
    }
  };

  const handleSelectPreset = (preset: PromptPreset) => {
    setPromptText(preset.prompt);
    if (!isRunning) {
      onExecute(preset.prompt);
    }
  };

  const handleDeleteField = (fieldName: string) => {
    if (!currentSchema || !onUpdateSchema) return;
    const updatedAttrs = currentSchema.attributes.filter(a => a.name !== fieldName);
    onUpdateSchema({
      ...currentSchema,
      attributes: updatedAttrs
    });
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim() || !currentSchema || !onUpdateSchema) return;

    const formattedName = newFieldName.trim().replace(/\s+/g, '');
    const newAttr: SchemaAttribute = {
      name: formattedName,
      type: newFieldType,
      description: `User-defined attribute: ${newFieldName}`,
      required: true,
      example: 'Custom value'
    };

    onUpdateSchema({
      ...currentSchema,
      attributes: [...currentSchema.attributes, newAttr]
    });

    setNewFieldName('');
  };

  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-5 backdrop-blur-sm shadow-xl relative overflow-hidden">
      
      {/* Background Grid Pattern subtle accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a08_1px,transparent_1px),linear-gradient(to_bottom,#27272a08_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Main Prompt Form */}
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono font-medium text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ff4400]" />
            <span className="tracking-wider">NATURAL LANGUAGE DATA SPECIFICATION</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRefining(!isRefining)}
              className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-all duration-150 hover:scale-[1.02] active:scale-95 flex items-center gap-1 ${
                isRefining
                  ? 'bg-[#ff4400]/15 text-[#ff4400] border-[#ff4400]/40'
                  : 'bg-zinc-800/80 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'
              }`}
            >
              <UserCheck className="w-3 h-3 text-[#ff4400]" />
              <span>Human-in-the-Loop Refiner</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isRefining ? 'bg-[#ff4400] animate-pulse' : 'bg-zinc-600'}`} />
            </button>
          </div>
        </div>

        {/* Unified Command Box Container */}
        <div className="relative bg-zinc-950/90 border border-zinc-700/80 focus-within:border-[#ff4400] focus-within:shadow-[0_0_24px_rgba(255,68,0,0.18)] rounded-xl p-3 transition-all duration-200 shadow-inner">
          <textarea
            ref={textareaRef}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            disabled={isRunning}
            placeholder="Describe what data to collect, attributes needed, and target criteria in plain English..."
            rows={2}
            className="w-full bg-transparent border-0 outline-none resize-none text-sm text-zinc-100 placeholder:text-zinc-600 disabled:opacity-60 leading-relaxed font-sans block"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          {/* Bottom Action & Telemetry Toolbar */}
          <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-zinc-800/70">
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
              <span className="hidden sm:flex items-center gap-1.5">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-850 border border-zinc-700 text-zinc-300 text-[10px] font-mono font-semibold">[/]</kbd>
                <span>or</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-850 border border-zinc-700 text-zinc-300 text-[10px] font-mono font-semibold">⌘K</kbd>
                <span>to focus •</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-850 border border-zinc-700 text-zinc-300 text-[10px] font-mono font-semibold">Enter ↵</kbd>
                <span>to execute •</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-850 border border-zinc-700 text-zinc-300 text-[10px] font-mono font-semibold">Shift+↵</kbd>
                <span>new line</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={isRunning || !promptText.trim()}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-150 shrink-0 ${
                isRunning
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-[#ff4400] hover:bg-[#ff5500] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#ff4400]/30 active:translate-y-0 active:scale-95 text-white shadow-lg shadow-[#ff4400]/25'
              }`}
            >
              <MorphIcon 
                icon={isRunning ? Loader2Data : ArrowRightData} 
                size={14} 
                spring="snappy" 
                className={isRunning ? "animate-spin text-zinc-400" : "text-white group-hover:translate-x-0.5 transition-transform duration-150"} 
              />
              <span>{isRunning ? 'Orchestrating...' : 'Execute Workflow'}</span>
            </button>
          </div>
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
            className="text-xs px-2.5 py-1 rounded-md bg-zinc-800/70 hover:bg-zinc-700/70 hover:border-zinc-500 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-zinc-300 border border-zinc-700/50 transition-all duration-150 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4400]" />
            <span>{preset.title}</span>
          </button>
        ))}
      </div>

      {/* Human-in-the-Loop Interactive Schema Refiner Drawer / Bar */}
      {currentSchema && currentSchema.attributes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-800/60 relative z-10 space-y-2 animate-modal-pop">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
              <Layers className="w-3.5 h-3.5 text-zinc-300" />
              <span className="font-semibold text-zinc-200">{currentSchema.entityName}</span>
              <span className="text-zinc-500">({currentSchema.attributes.length} fields):</span>
            </div>

            {isRefining && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff4400]/15 text-[#ff4400] border border-[#ff4400]/30 flex items-center gap-1 animate-badge-pop">
                <UserCheck className="w-3 h-3 text-[#ff4400]" />
                Human Control Active — Click [×] to remove or add custom fields
              </span>
            )}
          </div>

          {/* Attributes List */}
          <div className="flex flex-wrap items-center gap-1.5">
            {currentSchema.attributes.map((attr) => (
              <span
                key={attr.name}
                className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-950 text-zinc-200 border border-zinc-800 flex items-center gap-1.5 hover:border-zinc-600 hover:-translate-y-0.5 transition-all duration-150"
              >
                <span>{attr.name}</span>
                <span className="text-zinc-500 text-[9px] uppercase">[{attr.type}]</span>
                {isRefining && (
                  <button
                    type="button"
                    onClick={() => handleDeleteField(attr.name)}
                    className="text-zinc-500 hover:text-rose-400 ml-0.5 p-0.5 hover:scale-110 active:scale-95 transition-all"
                    title={`Delete ${attr.name}`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {/* Add Field Form (Visible in Human-in-the-Loop Mode) */}
          {isRefining && (
            <form onSubmit={handleAddField} className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono animate-modal-pop">
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="New field name (e.g. employeeCount)..."
                className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-[#ff4400] focus:ring-1 focus:ring-[#ff4400]/40 w-48 text-[11px] transition-all"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as AttributeType)}
                className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-300 text-[11px] outline-none focus:border-[#ff4400] transition-colors"
              >
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="currency">currency</option>
                <option value="url">url</option>
                <option value="badge">badge</option>
                <option value="date">date</option>
              </select>
              <button
                type="submit"
                disabled={!newFieldName.trim()}
                className="px-2.5 py-1 rounded bg-[#ff4400] hover:bg-[#ff5511] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-black text-[11px] font-bold flex items-center gap-1 disabled:opacity-40 transition-all duration-150 shadow-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Add Attribute</span>
              </button>
            </form>
          )}

        </div>
      )}

    </div>
  );
};
