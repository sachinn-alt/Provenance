'use client';

import React, { useState } from 'react';
import { X, Download, Copy, Check, FileSpreadsheet, FileJson, FileText, Code2, Database } from 'lucide-react';
import { ExtractedRecord, GeneratedSchema } from '@/types';
import { exportToCSV, exportToJSON, exportToMarkdownTable, exportToTSV, exportToPandasPython, exportToSQLiteSQL } from '@/lib/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: ExtractedRecord[];
  schema: GeneratedSchema;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  records,
  schema
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (content: string, format: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const entitySlug = (schema.entityName || 'dataset').toLowerCase();

  const formats = [
    {
      id: 'csv',
      title: 'Comma-Separated Values (CSV)',
      desc: 'Standard spreadsheet format compatible with Excel, Google Sheets, and pandas.',
      ext: '.csv',
      icon: FileSpreadsheet,
      mime: 'text/csv;charset=utf-8;',
      getter: () => exportToCSV(records, schema)
    },
    {
      id: 'pandas',
      title: 'Pandas Sandbox Snippet (Python)',
      desc: 'Ready-to-run Python code snippet for Jupyter Notebooks, Google Colab, and ML pipelines.',
      ext: '.py',
      icon: Code2,
      mime: 'text/x-python',
      getter: () => exportToPandasPython(records, schema)
    },
    {
      id: 'sqlite',
      title: 'SQLite Database Script (SQL)',
      desc: 'Self-contained DDL table schema and INSERT statements ready for relational querying.',
      ext: '.sql',
      icon: Database,
      mime: 'application/sql',
      getter: () => exportToSQLiteSQL(records, schema)
    },
    {
      id: 'json',
      title: 'Structured JSON & Lineage',
      desc: 'Complete relational dataset including cell-level source citations and confidence scores.',
      ext: '.json',
      icon: FileJson,
      mime: 'application/json',
      getter: () => exportToJSON(records, schema)
    },
    {
      id: 'markdown',
      title: 'Markdown Table',
      desc: 'Formatted GitHub-flavored markdown table for README files and PR comments.',
      ext: '.md',
      icon: FileText,
      mime: 'text/markdown',
      getter: () => exportToMarkdownTable(records, schema)
    },
    {
      id: 'tsv',
      title: 'Tab-Separated Values (TSV)',
      desc: 'Clipboard-friendly format for quick pasting into database consoles and notebooks.',
      ext: '.tsv',
      icon: FileSpreadsheet,
      mime: 'text/tab-separated-values',
      getter: () => exportToTSV(records, schema)
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff4400]/10 border border-[#ff4400]/30 flex items-center justify-center text-[#ff4400]">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 font-display uppercase tracking-wider">Export Verified Dataset</h3>
              <p className="text-[11px] font-mono text-zinc-500">
                {records.length} records • {schema.entityName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 hover:rotate-90 active:scale-90 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formats Grid */}
        <div className="p-4 sm:p-5 space-y-3">
          {formats.map((fmt) => {
            const Icon = fmt.icon;
            const isCopied = copiedFormat === fmt.id;

            return (
              <div
                key={fmt.id}
                className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40 flex items-center justify-between gap-3 hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-150 select-none shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-200">{fmt.title}</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{fmt.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(fmt.getter(), fmt.id)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white active:scale-90 transition-all duration-150"
                    title="Copy to clipboard"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-[#ff4400] animate-badge-pop" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => downloadFile(fmt.getter(), `${entitySlug}-${Date.now()}${fmt.ext}`, fmt.mime)}
                    className="px-3 py-1.5 rounded-lg bg-[#ff4400] hover:bg-[#ff5511] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-black text-xs font-bold flex items-center gap-1.5 transition-all duration-150 shadow-md shadow-[#ff4400]/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 active:scale-95 transition-all duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
