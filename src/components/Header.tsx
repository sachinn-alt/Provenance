'use client';

import React from 'react';
import { ShieldCheck, Globe, History, Download, Terminal, Cpu } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Left: Mode Switcher & System Telemetry */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-start min-w-0">
          {/* Dual-Mode Selector: Demo Safe vs Live Web */}
          <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-lg p-0.5 text-xs font-mono shadow-inner">
            <button
              onClick={() => onToggleMode('demo')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-150 active:scale-95 ${
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
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-150 active:scale-95 ${
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

          {/* Operational Status Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-900/70 border border-zinc-800 text-[10px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4400] animate-pulse"></span>
            <span>SYSTEM READY</span>
          </div>
        </div>

        {/* Center: Brand "Provenance" Hero */}
        <div className="flex flex-col items-center justify-center shrink-0 mx-2 sm:mx-4 group cursor-pointer select-none text-center">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-[#ff4400] group-hover:border-[#ff4400]/60 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,68,0,0.3)] transition-all duration-200">
              <Cpu className="w-4.5 h-4.5 group-hover:rotate-6 transition-transform duration-200" />
            </div>
            <h1 className="font-brand text-2xl sm:text-3xl text-white group-hover:text-[#ff4400] transition-colors leading-none tracking-wide">
              Provenance
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 hidden sm:flex items-center gap-1.5 transition-colors group-hover:border-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4400] animate-pulse"></span>
              Operational
            </span>
          </div>
          <p className="text-[10px] font-mono text-zinc-500 hidden md:block tracking-tight pt-1">
            Autonomous Data Intelligence &amp; Lineage Machine
          </p>
        </div>

        {/* Right: Actions (Runs, API, Export) */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-1 justify-end min-w-0">
          
          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 text-zinc-300 text-xs font-mono transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-sm"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:border-[#ff4400]/50 hover:text-[#ff4400] text-zinc-300 text-xs font-mono transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-sm"
            title="View cURL CLI, Python client, and REST API docs"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">API</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            disabled={!hasRecords}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-150 ${
              hasRecords
                ? 'border-[#ff4400]/40 bg-[#ff4400]/15 hover:bg-[#ff4400]/25 text-[#ff4400] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-sm shadow-[#ff4400]/10'
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
