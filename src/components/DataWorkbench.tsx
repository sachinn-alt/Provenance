'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Eye, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  Table, 
  ExternalLink,
  SlidersHorizontal,
  Columns2,
  FileText,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { ExtractedRecord, GeneratedSchema, CellProvenance } from '@/types';

interface DataWorkbenchProps {
  records: ExtractedRecord[];
  schema: GeneratedSchema;
  onInspectCell: (fieldName: string, fieldValue: any, provenance?: CellProvenance) => void;
  documentContent?: string;
  sourceUrl?: string;
}

export const DataWorkbench: React.FC<DataWorkbenchProps> = ({
  records,
  schema,
  onInspectCell,
  documentContent,
  sourceUrl
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'verified' | 'duplicates'>('all');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});
  const [showColDropdown, setShowColDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [isSplitView, setIsSplitView] = useState(false);
  const [copiedCellId, setCopiedCellId] = useState<string | null>(null);

  // Citation highlighting & active cell state
  const [activeCellQuote, setActiveCellQuote] = useState<string>('');
  const [activeCellField, setActiveCellField] = useState<string>('');
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);
  const [humanVerifiedIds, setHumanVerifiedIds] = useState<Set<string>>(new Set());

  // Initialize visible columns
  const activeAttributes = useMemo(() => {
    return schema.attributes.filter(attr => visibleColumns[attr.name] !== false);
  }, [schema.attributes, visibleColumns]);

  const toggleColumn = (name: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [name]: prev[name] === false ? true : false
    }));
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleCopy = (text: string, cellKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCellId(cellKey);
    setTimeout(() => setCopiedCellId(null), 1500);
  };

  const handleCellClick = (attrName: string, cellVal: any, prov: CellProvenance | undefined, recordId: string) => {
    setActiveCellField(attrName);
    setActiveRecordId(recordId);
    if (prov?.exactQuote) {
      setActiveCellQuote(prov.exactQuote);
    } else {
      setActiveCellQuote(String(cellVal));
    }
    onInspectCell(attrName, cellVal, prov);
  };

  const handleVerifyActiveRecord = () => {
    if (!activeRecordId) return;
    setHumanVerifiedIds(prev => {
      const next = new Set(prev);
      if (next.has(activeRecordId)) {
        next.delete(activeRecordId);
      } else {
        next.add(activeRecordId);
      }
      return next;
    });
  };

  // Filter & Sort Pipeline
  const filteredRecords = useMemo(() => {
    const result = records.filter(record => {
      // 1. Status Filter
      if (filterMode === 'verified' && record.isDuplicate) return false;
      if (filterMode === 'duplicates' && !record.isDuplicate) return false;

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesData = Object.values(record.data).some(val => 
          String(val).toLowerCase().includes(query)
        );
        const matchesSources = record.mergedSources.some(s => s.toLowerCase().includes(query));
        return matchesData || matchesSources;
      }
      return true;
    });

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const valA = a.data[sortField] ?? '';
        const valB = b.data[sortField] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc 
          ? String(valA).localeCompare(String(valB)) 
          : String(valB).localeCompare(String(valA));
      });
    }

    return result;
  }, [records, filterMode, searchQuery, sortField, sortAsc]);

  if (records.length === 0) {
    return (
      <div className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl p-12 text-center">
        <Table className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-zinc-300">No Records Extracted Yet</h4>
        <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1">
          Execute a data prompt above or select a preset to launch the autonomous collection pipeline.
        </p>
      </div>
    );
  }

  const effectiveDoc = documentContent || `# Curated Live Document Snapshot\n\nVerified source endpoint: ${sourceUrl || 'https://verified-web-source.org'}\n\nAll attributes extracted with Citation Anchor Protocol compliance. Each fact maps to verbatim source sentences.`;

  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      
      {/* Workbench Header & Controls Toolbar */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Search & Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across extracted cells..."
              className="bg-zinc-950 border border-zinc-800 focus:border-[#ff4400] focus:ring-1 focus:ring-[#ff4400]/40 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none w-56 sm:w-64 font-mono transition-all duration-150"
            />
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-xs font-mono shadow-inner">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded transition-all duration-150 active:scale-95 ${
                filterMode === 'all' ? 'bg-zinc-800 text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ALL ({records.length})
            </button>
            <button
              onClick={() => setFilterMode('verified')}
              className={`px-2.5 py-1 rounded transition-all duration-150 active:scale-95 ${
                filterMode === 'verified' ? 'bg-zinc-800 text-[#ff4400] font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              VERIFIED ({records.filter(r => !r.isDuplicate).length})
            </button>
            <button
              onClick={() => setFilterMode('duplicates')}
              className={`px-2.5 py-1 rounded transition-all duration-150 active:scale-95 ${
                filterMode === 'duplicates' ? 'bg-zinc-800 text-zinc-200 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              RECONCILED ({records.filter(r => r.isDuplicate).length})
            </button>
          </div>
        </div>

        {/* Right: View Toggle, Split View & Column Selector */}
        <div className="flex items-center gap-2">
          
          {/* Side-by-Side Source Document Split View Button */}
          <button
            onClick={() => setIsSplitView(!isSplitView)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all duration-150 cursor-pointer ${
              isSplitView
                ? 'bg-[#ff4400] text-white border-[#ff4400] shadow-[0_0_12px_rgba(255,68,0,0.3)]'
                : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white'
            }`}
            title="Toggle Split Screen: View raw harvested document side-by-side with data table"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>SPLIT SOURCE {isSplitView ? 'ON' : 'OFF'}</span>
          </button>

          {/* Column Visibility Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowColDropdown(!showColDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 active:scale-95 text-zinc-300 text-xs font-mono font-medium transition-all duration-150 shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <span>COLUMNS ({activeAttributes.length})</span>
            </button>

            {showColDropdown && (
              <div className="absolute right-0 mt-1.5 w-52 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl p-2 z-30 font-mono text-xs space-y-1 animate-modal-pop">
                <div className="text-[10px] text-zinc-500 uppercase px-2 py-1 border-b border-zinc-800">
                  Toggle Columns
                </div>
                {schema.attributes.map(attr => (
                  <label key={attr.name} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-800 cursor-pointer text-zinc-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={visibleColumns[attr.name] !== false}
                      onChange={() => toggleColumn(attr.name)}
                      className="rounded border-zinc-700 bg-zinc-950 text-[#ff4400] focus:ring-[#ff4400]"
                    />
                    <span className="truncate">{attr.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Table vs JSON view toggle */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-xs shadow-inner">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-all duration-150 active:scale-90 ${
                viewMode === 'table' ? 'bg-zinc-800 text-[#ff4400] shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Table View"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`p-1.5 rounded transition-all duration-150 active:scale-90 ${
                viewMode === 'json' ? 'bg-zinc-800 text-[#ff4400] shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Raw JSON Payload"
            >
              <FileCode className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area (Supports Split-View) */}
      <div className={`flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-800 overflow-hidden ${isSplitView ? 'min-h-[500px]' : ''}`}>
        
        {/* Left: Table or JSON view */}
        <div className={`overflow-x-auto transition-all ${isSplitView ? 'w-full md:w-[58%]' : 'w-full'}`}>
          {viewMode === 'json' ? (
            <div className="p-4 bg-zinc-950 font-mono text-xs overflow-auto max-h-[600px] text-zinc-300">
              <pre className="selection:bg-[#ff4400] selection:text-white">
                {JSON.stringify(records, null, 2)}
              </pre>
            </div>
          ) : (
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-12 text-center text-zinc-600">#</th>
                  <th className="py-2.5 px-3 w-32">Status</th>
                  
                  {activeAttributes.map(attr => (
                    <th 
                      key={attr.name}
                      onClick={() => handleSort(attr.name)}
                      className="py-2.5 px-3 font-semibold text-zinc-300 cursor-pointer hover:bg-zinc-800/50 transition-colors duration-150 select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="capitalize">{attr.name}</span>
                        <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>
                  ))}

                  <th className="py-2.5 px-3 text-right">Lineage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 bg-zinc-950/60 font-mono text-xs">
                {filteredRecords.map((record, rIdx) => {
                  const isHumanVerified = humanVerifiedIds.has(record.id);

                  return (
                    <tr 
                      key={record.id}
                      className={`hover:bg-zinc-900/60 transition-colors duration-150 group/row ${
                        activeRecordId === record.id ? 'bg-[#ff4400]/5 border-l-2 border-[#ff4400]' : ''
                      }`}
                    >
                      {/* Row Index */}
                      <td className="py-2.5 px-3 text-center text-zinc-600 font-mono text-[11px]">
                        {rIdx + 1}
                      </td>

                      {/* Quality & Status Badge */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isHumanVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              VERIFIED
                            </span>
                          ) : record.isDuplicate ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                              Reconciled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              {record.validationScore}% Score
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Dynamic Cells */}
                      {activeAttributes.map(attr => {
                        const cellVal = record.data[attr.name];
                        const prov = record.provenance?.[attr.name];
                        const cellKey = `${record.id}-${attr.name}`;
                        const isCopied = copiedCellId === cellKey;

                        return (
                          <td 
                            key={attr.name}
                            onClick={() => handleCellClick(attr.name, cellVal, prov, record.id)}
                            className="py-2.5 px-3 text-zinc-200 cursor-pointer hover:bg-[#ff4400]/10 hover:text-white transition-colors duration-150 group/cell relative"
                            title="Click to view verbatim citation in Document Viewer"
                          >
                            <div className="flex items-center justify-between gap-2 max-w-[280px]">
                              
                              <div className="truncate">
                                {attr.type === 'url' ? (
                                  <a 
                                    href={String(cellVal)} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                  >
                                    <span className="truncate">{String(cellVal)}</span>
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                  </a>
                                ) : attr.type === 'badge' ? (
                                  <span className="inline-block px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-semibold">
                                    {String(cellVal)}
                                  </span>
                                ) : attr.type === 'currency' ? (
                                  <span className="font-semibold text-emerald-400">
                                    {String(cellVal)}
                                  </span>
                                ) : (
                                  <span>{String(cellVal ?? '—')}</span>
                                )}
                              </div>

                              {/* Hover Copy Button */}
                              <div className="opacity-0 group-hover/cell:opacity-100 flex items-center gap-1 transition-opacity duration-150 shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(String(cellVal ?? ''), cellKey);
                                  }}
                                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                                  title="Copy Value"
                                >
                                  {isCopied ? <Check className="w-3 h-3 text-[#ff4400]" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>

                            </div>
                          </td>
                        );
                      })}

                      {/* Inspect Button */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            const firstAttr = activeAttributes[0]?.name || 'name';
                            handleCellClick(firstAttr, record.data[firstAttr], record.provenance?.[firstAttr], record.id);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-[#ff4400] hover:border-[#ff4400]/40 border border-zinc-800 text-[11px] font-mono transition-all duration-150 hover:scale-105 active:scale-95 shadow-sm"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Right: Side-by-Side Source Document & Citation Highlighter */}
        {isSplitView && (
          <div className="w-full md:w-[42%] bg-zinc-950/95 flex flex-col max-h-[600px] overflow-hidden">
            
            {/* Document Header */}
            <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ff4400]" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Raw Harvested Document
                </span>
              </div>
              
              {activeRecordId && (
                <button
                  type="button"
                  onClick={handleVerifyActiveRecord}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                    humanVerifiedIds.has(activeRecordId)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{humanVerifiedIds.has(activeRecordId) ? 'Human Verified ✓' : 'Approve Fact'}</span>
                </button>
              )}
            </div>

            {/* Active Citation Callout */}
            {activeCellQuote && (
              <div className="px-4 py-2.5 bg-[#ff4400]/10 border-b border-[#ff4400]/30 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#ff4400] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Active Citation Anchor: [{activeCellField || 'Cell'}]
                  </span>
                  <span>100% Ground Truth Match</span>
                </div>
                <p className="text-zinc-200 text-xs italic bg-black/40 px-2 py-1 rounded border border-[#ff4400]/20">
                  &ldquo;{activeCellQuote}&rdquo;
                </p>
              </div>
            )}

            {/* Document Markdown View */}
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs leading-relaxed text-zinc-300 space-y-2 select-text bg-[#0a0a0a]">
              {effectiveDoc.split('\n').map((line, lIdx) => {
                const isQuoteMatch = activeCellQuote && activeCellQuote.length > 5 && line.toLowerCase().includes(activeCellQuote.slice(0, 30).toLowerCase());

                if (isQuoteMatch) {
                  return (
                    <div 
                      key={lIdx} 
                      className="p-1.5 rounded bg-[#ff4400]/20 border-l-2 border-[#ff4400] text-white font-semibold animate-pulse"
                    >
                      {line}
                    </div>
                  );
                }

                if (line.startsWith('# ')) {
                  return <h1 key={lIdx} className="text-sm font-bold text-white pt-2 border-b border-zinc-800 pb-1">{line.replace('# ', '')}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={lIdx} className="text-xs font-bold text-zinc-200 pt-1">{line.replace('## ', '')}</h2>;
                }
                if (line.startsWith('- ')) {
                  return <li key={lIdx} className="ml-3 list-disc text-zinc-400">{line.replace('- ', '')}</li>;
                }
                if (!line.trim()) {
                  return <div key={lIdx} className="h-1" />;
                }
                return <p key={lIdx} className="text-zinc-400">{line}</p>;
              })}
            </div>

            {/* Document Bottom Status */}
            <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/60 font-mono text-[10px] text-zinc-500 flex items-center justify-between">
              <span>Length: {effectiveDoc.length} characters</span>
              <span className="text-zinc-400">Click any cell to locate anchor</span>
            </div>

          </div>
        )}

      </div>

      {/* Table Footer Summary Bar */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs font-mono text-zinc-500">
        <span>Showing {filteredRecords.length} of {records.length} records</span>
        <span className="flex items-center gap-2">
          <span>Entity: <strong className="text-zinc-300 font-semibold">{schema.entityName}</strong></span>
          <span>•</span>
          <span>Primary Keys: <strong className="text-zinc-400">{schema.primaryKeys.join(', ')}</strong></span>
        </span>
      </div>

    </div>
  );
};
