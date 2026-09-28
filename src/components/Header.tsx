'use client';

import React from 'react';
import { History, Download, Terminal, Settings, GitCompare } from 'lucide-react';
import { MorphIcon } from 'morphicons/react';
import { ShieldCheck as ShieldCheckData, Globe as GlobeData, Cpu as CpuData } from 'lucide';

interface HeaderProps {
  mode: 'live' | 'demo';
  onToggleMode: (mode: 'live' | 'demo') => void;
  onOpenHistory: () => void;
  onOpenExport: () => void;
  onOpenApi: () => void;
  onOpenSettings?: () => void;
  onOpenDiff?: () => void;
  historyCount: number;
  hasRecords: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onToggleMode,
  onOpenHistory,
  onOpenExport,
  onOpenApi,
  onOpenSettings,
  onOpenDiff,
  historyCount,
  hasRecords
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Blinking Dot Status */}
        <div className="flex items-center gap-3 group cursor-pointer select-none">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 text-[#ff4400] group-hover:border-[#ff4400]/60 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,68,0,0.3)] transition-all duration-200">
            <MorphIcon 
              icon={CpuData} 
              size={20} 
              spring="bouncy" 
              className="group-hover:rotate-6 transition-transform duration-200" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-brand text-2xl sm:text-[26px] text-white group-hover:text-[#ff4400] transition-colors leading-none tracking-wide">
                Provenance
              </h1>
              {/* Operational blinking dot only — no text */}
              <span 
                className="flex items-center justify-center w-3 h-3 rounded-full bg-zinc-900 border border-zinc-800 transition-colors group-hover:border-zinc-700" 
                title="Operational"
                aria-label="Operational status indicator"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4400] animate-pulse" />
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 hidden sm:block">
              Autonomous Data Intelligence &amp; Lineage Machine
            </p>
          </div>
        </div>

        {/* Right: Mode Switcher & Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Dual-Mode Selector with MorphIcon physics */}
          <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-lg p-0.5 text-xs font-mono shadow-inner">
            <div className="pl-2 pr-1 flex items-center justify-center text-[#ff4400]">
              <MorphIcon 
                icon={mode === 'demo' ? ShieldCheckData : GlobeData} 
                size={14} 
                spring="snappy" 
                className="transition-colors" 
              />
            </div>
            <button
              onClick={() => onToggleMode('demo')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-150 active:scale-95 ${
                mode === 'demo'
                  ? 'bg-zinc-800 text-white font-medium shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Guaranteed zero-lag cached snapshot execution for hackathon presentation"
            >
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
              <span className="hidden md:inline">Live Web Agent</span>
              <span className="md:hidden">Live</span>
            </button>
          </div>

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

          {/* Change Detection & Diff Engine Button */}
          {onOpenDiff && historyCount > 1 && (
            <button
              onClick={onOpenDiff}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 text-zinc-300 text-xs font-mono transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-sm"
              title="Compare runs & detect changed entities"
            >
              <GitCompare className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline">Diff</span>
            </button>
          )}

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

          {/* Settings / BYOK Button */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:border-[#ff4400]/40 text-zinc-400 hover:text-[#ff4400] text-xs font-mono transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-sm"
              title="Configure LLM providers, API keys, and crawler engine"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
