'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ChevronDown, ChevronUp, Check, AlertTriangle, XCircle, Info, Trash2 } from 'lucide-react';
import { WorkflowLog } from '@/types';

interface ExecutionConsoleProps {
  logs: WorkflowLog[];
  isRunning: boolean;
  onClearLogs?: () => void;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({
  logs,
  isRunning,
  onClearLogs
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'success' | 'warn' | 'error'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  const filteredLogs = logs.filter(l => filterLevel === 'all' || l.level === filterLevel);

  return (
    <div className="w-full bg-zinc-950 border border-zinc-800/90 rounded-xl overflow-hidden shadow-2xl">
      {/* Console Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-mono font-medium text-zinc-200">
            Agent Execution Stream
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
            {logs.length} events
          </span>
          {isRunning && (
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#ff4400]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4400] animate-ping" />
              LIVE TELEMETRY
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-950 p-0.5 rounded border border-zinc-800 text-[10px] font-mono">
            {(['all', 'info', 'success', 'warn', 'error'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded uppercase transition-colors ${
                  filterLevel === lvl
                    ? 'bg-zinc-800 text-[#ff4400] font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Toggle Accordion */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      {isOpen && (
        <div
          ref={scrollRef}
          className="p-3 max-h-52 overflow-y-auto font-mono text-xs space-y-1.5 bg-zinc-950/95"
        >
          {filteredLogs.length === 0 ? (
            <div className="text-zinc-600 italic py-3 text-center">
              No telemetry events recorded yet. Execute a prompt to stream agent logs.
            </div>
          ) : (
            filteredLogs.map(log => {
              const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour12: false });
              
              let badgeColor = 'bg-zinc-900 text-zinc-300 border-zinc-700';
              if (log.level === 'success') badgeColor = 'bg-[#ff4400]/10 text-[#ff4400] border-[#ff4400]/30';
              if (log.level === 'warn') badgeColor = 'bg-zinc-800 text-zinc-200 border-zinc-600';
              if (log.level === 'error') badgeColor = 'bg-white text-black border-white font-bold';

              return (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed text-zinc-300 hover:bg-zinc-900/40 px-1 py-0.5 rounded transition-colors">
                  <span className="text-zinc-600 shrink-0 select-none" suppressHydrationWarning>{timeStr}</span>
                  <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded border font-semibold shrink-0 ${badgeColor}`}>
                    {log.phase}
                  </span>
                  <span className="break-all">{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
