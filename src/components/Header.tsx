'use client';

import React from 'react';
import { Database, ShieldCheck, Globe, History, Download, Terminal, Cpu } from 'lucide-react';

interface HeaderProps {
  mode: 'live' | 'demo';
  onToggleMode: (mode: 'live' | 'demo') => void;
  onOpenHistory: () => void;
  onOpenExport: () => void;
  onOpenApi: () => void;
  historyCount: number;
  hasRecords: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onToggleMode,
  onOpenHistory,
  onOpenExport,
  onOpenApi,
  historyCount,
  hasRecords
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 text-[#ff4400]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display font-bold tracking-tight text-white text-base">Provenance</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4400] animate-pulse"></span>
                Operational
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 hidden sm:block">Autonomous Data Intelligence & Lineage Machine</p>
          </div>
        </div>

        {/* Right: Mode Switcher & Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Dual-Mode Selector: Demo Safe vs Live Web */}
          <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => onToggleMode('demo')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all ${
                mode === 'demo'
                  ? 'bg-zinc-800 text-white font-medium shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Guaranteed zero-lag cached snapshot execution for hackathon presentation"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline">Safe Demo Mode</span>
              <span className="md:hidden">Demo</span>
            </button>
            <button
              onClick={() => onToggleMode('live')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all ${
                mode === 'live'
                  ? 'bg-[#ff4400] text-white font-medium shadow-sm shadow-[#ff4400]/20'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Execute live HTTP scraping and LLM extraction against permitted sources"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Live Web Agent</span>
              <span className="md:hidden">Live</span>
            </button>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
          >
            <History className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Runs</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              {historyCount}
            </span>
          </button>

          {/* Developer API Docs Button */}
          <button
            onClick={onOpenApi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:border-[#ff4400]/50 hover:text-[#ff4400] text-zinc-300 text-xs font-mono transition-all"
            title="View cURL CLI, Python client, and REST API docs"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">API</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            disabled={!hasRecords}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              hasRecords
                ? 'border-[#ff4400]/40 bg-[#ff4400]/15 hover:bg-[#ff4400]/25 text-[#ff4400]'
                : 'border-zinc-800 bg-zinc-900/30 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

        </div>
      </div>
    </header>
  );
};
