'use client';

import React from 'react';
import { Database, ShieldCheck, Globe, History, Download, Terminal, Cpu } from 'lucide-react';

interface HeaderProps {
  mode: 'live' | 'demo';
  onToggleMode: (mode: 'live' | 'demo') => void;
  onOpenHistory: () => void;
  onOpenExport: () => void;
  historyCount: number;
  hasRecords: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onToggleMode,
  onOpenHistory,
  onOpenExport,
  historyCount,
  hasRecords
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold tracking-tight text-zinc-100 text-base">Provenance</h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Operational
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">Autonomous Data Intelligence & Lineage Platform</p>
          </div>
        </div>

        {/* Right: Mode Switcher & Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Dual-Mode Selector: Demo Safe vs Live Web */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => onToggleMode('demo')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                mode === 'demo'
                  ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Guaranteed zero-lag cached snapshot execution for hackathon presentation"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Safe Demo Mode</span>
              <span className="md:hidden">Demo</span>
            </button>
            <button
              onClick={() => onToggleMode('live')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                mode === 'live'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 text-xs font-medium transition-colors"
          >
            <History className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Runs</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              {historyCount}
            </span>
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            disabled={!hasRecords}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              hasRecords
                ? 'border-blue-500/40 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400'
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
