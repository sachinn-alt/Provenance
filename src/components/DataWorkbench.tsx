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
  Filter, 
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';
import { ExtractedRecord, GeneratedSchema, CellProvenance } from '@/types';

interface DataWorkbenchProps {
  records: ExtractedRecord[];
  schema: GeneratedSchema;
  onInspectCell: (fieldName: string, fieldValue: any, provenance?: CellProvenance) => void;
}

export const DataWorkbench: React.FC<DataWorkbenchProps> = ({
  records,
  schema,
  onInspectCell
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'verified' | 'duplicates'>('all');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});
  const [showColDropdown, setShowColDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [copiedCellId, setCopiedCellId] = useState<string | null>(null);

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

        {/* Right: View Toggle & Column Selector */}
        <div className="flex items-center gap-2">
          
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
              title="Raw JSON View"
            >
              <FileCode className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Main View Area */}
      {viewMode === 'json' ? (
        <div className="p-4 bg-zinc-950 overflow-x-auto max-h-[500px]">
          <pre className="font-mono text-xs text-zinc-300 leading-relaxed">
            {JSON.stringify({ schema, records: filteredRecords }, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[560px] relative">
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Table Sticky Header */}
            <thead className="sticky top-0 z-20 bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-3">Status</th>
                {activeAttributes.map(attr => (
                  <th 
                    key={attr.name} 
                    className="py-2.5 px-3 font-semibold text-zinc-300 cursor-pointer select-none hover:text-[#ff4400] transition-colors"
                    onClick={() => handleSort(attr.name)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{attr.name}</span>
                      <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                    </div>
                  </th>
                ))}
                <th className="py-2.5 px-3 text-right">Lineage</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {filteredRecords.map((record, index) => {
                const isDup = record.isDuplicate;

                return (
                  <tr 
                    key={record.id}
                    className={`group transition-colors ${
                      isDup ? 'bg-zinc-900/40 hover:bg-zinc-900/80' : 'hover:bg-zinc-900/60'
                    }`}
                  >
                    {/* Index */}
                    <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-500 text-center">
                      {index + 1}
                    </td>

                    {/* Status Pill */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {isDup ? (
                        <span 
                          onClick={() => {
                            const firstAttr = activeAttributes[0]?.name;
                            if (firstAttr) onInspectCell(firstAttr, record.data[firstAttr], record.provenance?.[firstAttr]);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 cursor-pointer transition-colors"
                          title="Fuzzy matched via Levenshtein distance (>0.88). Multi-source citations unified."
                        >
                          <AlertTriangle className="w-3 h-3 text-[#ff4400]" />
                          <span>Reconciled Match</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-zinc-200 border border-white/10">
                          <CheckCircle2 className="w-3 h-3 text-[#ff4400]" />
                          {record.validationScore}% Valid
                        </span>
                      )}
                    </td>

                    {/* Dynamic Attribute Cells */}
                    {activeAttributes.map(attr => {
                      const value = record.data[attr.name];
                      const prov = record.provenance?.[attr.name];
                      const cellKey = `${record.id}-${attr.name}`;
                      const isCopied = copiedCellId === cellKey;

                      return (
                        <td 
                          key={attr.name}
                          className="py-2.5 px-3 text-zinc-200 max-w-xs truncate relative group/cell cursor-pointer"
                          onClick={() => onInspectCell(attr.name, value, prov)}
                          title="Click to inspect source citation"
                        >
                          <div className="flex items-center justify-between gap-1">
                            {attr.type === 'url' && value ? (
                              <a
                                href={String(value)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[#ff4400] hover:text-[#ff6622] hover:underline flex items-center gap-1 font-mono text-[11px]"
                              >
                                <span>{String(value).replace(/^https?:\/\//, '').slice(0, 24)}...</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : attr.type === 'badge' ? (
                              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700/60">
                                {String(value ?? '-')}
                              </span>
                            ) : attr.type === 'currency' ? (
                              <span className="font-mono text-zinc-100 font-medium">
                                {String(value ?? '-')}
                              </span>
                            ) : (
                              <span className="truncate">{String(value ?? '-')}</span>
                            )}

                            {/* Cell Hover Actions (Copy / Inspect) */}
                            <div className="opacity-0 group-hover/cell:opacity-100 flex items-center gap-1 transition-opacity duration-150">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(String(value ?? ''), cellKey);
                                }}
                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 active:scale-90 transition-all duration-150 shadow-sm"
                                title="Copy Value"
                              >
                                {isCopied ? <Check className="w-3 h-3 text-[#ff4400] animate-badge-pop" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </td>
                      );
                    })}

                    {/* Lineage Trigger Button */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          const firstAttr = activeAttributes[0]?.name || 'name';
                          onInspectCell(firstAttr, record.data[firstAttr], record.provenance?.[firstAttr]);
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
        </div>
      )}

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
