'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Sliders, 
  Plus, 
  X, 
  UserCheck, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';
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
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>NATURAL LANGUAGE DATA SPECIFICATION</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRefining(!isRefining)}
              className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                isRefining
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                  : 'bg-zinc-800/80 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'
              }`}
            >
              <UserCheck className="w-3 h-3 text-blue-400" />
              <span>Human-in-the-Loop Refiner</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isRefining ? 'bg-blue-400 animate-pulse' : 'bg-zinc-600'}`} />
            </button>
            <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px]">Enter ↵</kbd>
            </span>
          </div>
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

      {/* Human-in-the-Loop Interactive Schema Refiner Drawer / Bar */}
      {currentSchema && currentSchema.attributes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-800/60 relative z-10 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-zinc-200">{currentSchema.entityName}</span>
              <span className="text-zinc-500">({currentSchema.attributes.length} fields):</span>
            </div>

            {isRefining && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/20 text-blue-400 border border-blue-800/40 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-blue-400" />
                Human Control Active — Click [×] to remove or add custom fields
              </span>
            )}
          </div>

          {/* Attributes List */}
          <div className="flex flex-wrap items-center gap-1.5">
            {currentSchema.attributes.map((attr) => (
              <span
                key={attr.name}
                className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-950 text-zinc-200 border border-zinc-800 flex items-center gap-1.5 hover:border-zinc-700 transition-colors"
              >
                <span>{attr.name}</span>
                <span className="text-zinc-500 text-[9px] uppercase">[{attr.type}]</span>
                {isRefining && (
                  <button
                    type="button"
                    onClick={() => handleDeleteField(attr.name)}
                    className="text-zinc-500 hover:text-rose-400 ml-0.5 p-0.5"
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
            <form onSubmit={handleAddField} className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="New field name (e.g. employeeCount)..."
                className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-blue-500 w-48 text-[11px]"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as AttributeType)}
                className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-300 text-[11px] outline-none"
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
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium flex items-center gap-1 disabled:opacity-50"
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
