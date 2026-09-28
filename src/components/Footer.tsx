'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  History 
} from 'lucide-react';
import { MorphIcon } from 'morphicons/react';
import { 
  Terminal as TerminalData, 
  Cpu as CpuData, 
  ShieldCheck as ShieldCheckData, 
  Sparkles as SparklesData 
} from 'lucide';

interface FooterProps {
  onOpenApi?: () => void;
  onOpenHistory?: () => void;
  mode?: 'live' | 'demo';
  totalWorkflows?: number;
}

const MORPH_ICONS = [TerminalData, CpuData, ShieldCheckData, SparklesData];

export const Footer: React.FC<FooterProps> = ({
  onOpenApi,
  onOpenHistory,
  mode = 'demo',
  totalWorkflows = 1
}) => {
  const [iconIndex, setIconIndex] = useState(0);

  const cycleIcon = () => {
    setIconIndex((prev) => (prev + 1) % MORPH_ICONS.length);
  };

  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md relative z-20 mt-12 py-6 select-none font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Top Status & Telemetry Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60 text-xs">
          
          {/* Left: System Signature with Interactive MorphIcon */}
          <div className="flex items-center gap-3">
            <button
              onClick={cycleIcon}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#ff4400]/60 text-[#ff4400] transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,68,0,0.15)] group"
              title="Click to trigger MorphIcon physics animation"
            >
              <MorphIcon 
                icon={MORPH_ICONS[iconIndex]} 
                size={16} 
                spring="snappy" 
                className="group-hover:rotate-6 transition-transform duration-200" 
              />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-wide">PROVENANCE // CORE</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-950/40 text-orange-400 border border-orange-500/30">
                  BUILD 1.0.0-PROD
                </span>
                <span className="text-[10px] text-zinc-500 hidden sm:inline">
                  MODE: {mode.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Autonomous Data Intelligence &bull; Sentence-Level Verifiable Citations
              </p>
            </div>
          </div>

          {/* Right: Telemetry Chips */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 text-zinc-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4400] animate-pulse" />
              <span>DAG Engine: Active</span>
            </span>

            <span className="px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 text-zinc-400">
              Total Runs: <span className="text-[#ff4400] font-semibold">{totalWorkflows}</span>
            </span>

            <span className="px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 text-zinc-400">
              Hallucination: <span className="text-emerald-400 font-semibold">0.00%</span>
            </span>
          </div>

        </div>

        {/* Middle: Keyboard Shortcuts & System Directives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-400 pt-1">
          
          {/* Col 1: Terminal Control Shortcuts */}
          <div className="space-y-1.5">
            <span className="text-zinc-500 uppercase text-[10px] tracking-wider font-semibold">
              Keyboard Navigation
            </span>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                <kbd className="text-[#ff4400]">[/]</kbd> Focus Prompt
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                <kbd className="text-[#ff4400]">[Enter]</kbd> Execute
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                <kbd className="text-[#ff4400]">[Shift+Enter]</kbd> Newline
              </span>
            </div>
          </div>

          {/* Col 2: Pipeline Architecture Spec */}
          <div className="space-y-1.5">
            <span className="text-zinc-500 uppercase text-[10px] tracking-wider font-semibold">
              Multi-Agent DAG Architecture
            </span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Decoupled 6-stage pipeline: Schema &rarr; Discovery &rarr; Sanitizer &rarr; Extraction &rarr; Deduplication &rarr; Audit Indexer.
            </p>
          </div>

          {/* Col 3: Direct Links */}
          <div className="space-y-1.5">
            <span className="text-zinc-500 uppercase text-[10px] tracking-wider font-semibold">
              Developer Ecosystem
            </span>
            <div className="flex items-center gap-3 text-xs">
              <a
                href="https://github.com/sachinn-alt/Provenance"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-zinc-300 hover:text-[#ff4400] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>

              {onOpenApi && (
                <button
                  type="button"
                  onClick={onOpenApi}
                  className="flex items-center gap-1 text-zinc-300 hover:text-[#ff4400] transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>REST API</span>
                </button>
              )}

              {onOpenHistory && (
                <button
                  type="button"
                  onClick={onOpenHistory}
                  className="flex items-center gap-1 text-zinc-300 hover:text-[#ff4400] transition-colors"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Runs ({totalWorkflows})</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Editorial Legal / Teen Eng Style */}
        <div className="pt-3 border-t border-zinc-800/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} Provenance &bull; Built for Autonomous Data Intelligence &bull; MIT License
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#ff4400] font-semibold">&ldquo;No Citation? It Never Happened.&rdquo;</span>
            <span>&bull;</span>
            <span>Next.js &bull; Turbopack &bull; Morphicons</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
