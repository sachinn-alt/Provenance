'use client';

import React, { useState } from 'react';
import { X, Download, Copy, Check, FileSpreadsheet, FileJson, FileText, CheckCircle2 } from 'lucide-react';
import { ExtractedRecord, GeneratedSchema } from '@/types';
import { exportToCSV, exportToJSON, exportToMarkdownTable, exportToTSV } from '@/lib/exportUtils';

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Export Verified Dataset</h3>
              <p className="text-[11px] font-mono text-zinc-500">
                {records.length} records • {schema.entityName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
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
                className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
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
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => downloadFile(fmt.getter(), `${entitySlug}-${Date.now()}${fmt.ext}`, fmt.mime)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
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
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
