'use client';

import React from 'react';
import { Database, ShieldCheck, Globe, Percent, Clock, GitMerge, Award } from 'lucide-react';
import { WorkflowSummary, ExtractedRecord, GeneratedSchema } from '@/types';

interface AnalyticsViewProps {
  summary: WorkflowSummary;
  records: ExtractedRecord[];
  schema: GeneratedSchema;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  summary,
  records,
  schema
}) => {
  // Compute category/type distributions if any badge or categorical attribute exists
  const badgeAttr = schema.attributes.find(a => a.type === 'badge') || schema.attributes[1];
  const distributionMap: Record<string, number> = {};

  if (badgeAttr) {
    records.forEach(r => {
      const val = String(r.data[badgeAttr.name] || 'Other');
      distributionMap[val] = (distributionMap[val] || 0) + 1;
    });
  }

  return (
    <div className="w-full space-y-4">
      {/* 6 Key Performance Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* KPI 1: Records Harvested */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-950/60 group select-none">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono tracking-wider">
            <span>ENTITIES</span>
            <Database className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 group-hover:scale-110 transition-all duration-200" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">{summary.totalExtracted}</span>
            <span className="text-[10px] text-zinc-500 font-mono block">Published rows</span>
          </div>
        </div>

        {/* KPI 2: Validity Rate */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-950/60 group select-none">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono tracking-wider">
            <span>VALIDITY</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#ff4400] group-hover:scale-110 transition-all duration-200" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">{summary.validRate}%</span>
            <span className="text-[10px] text-zinc-500 font-mono block">Schema compliance</span>
          </div>
        </div>

        {/* KPI 3: Citation Confidence */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-950/60 group select-none">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono tracking-wider">
            <span>CONFIDENCE</span>
            <Award className="w-3.5 h-3.5 text-[#ff4400] group-hover:scale-110 transition-all duration-200" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-[#ff4400]">{summary.avgConfidence}%</span>
            <span className="text-[10px] text-zinc-500 font-mono block">Ground truth score</span>
          </div>
        </div>

        {/* KPI 4: Sources Consulted */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-950/60 group select-none">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono tracking-wider">
            <span>SOURCES</span>
            <Globe className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 group-hover:scale-110 transition-all duration-200" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">{summary.sourcesCount}</span>
            <span className="text-[10px] text-zinc-500 font-mono block">Permitted domains</span>
          </div>
        </div>

        {/* KPI 5: Deduplication Efficiency */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-950/60 group select-none">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono tracking-wider">
            <span>DEDUP MERGES</span>
            <GitMerge className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 group-hover:scale-110 transition-all duration-200" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">{summary.dedupCount}</span>
            <span className="text-[10px] text-zinc-500 font-mono block">Duplicates resolved</span>
          </div>
        </div>

        {/* KPI 6: Execution Latency */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-950/60 group select-none">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono tracking-wider">
            <span>LATENCY</span>
            <Clock className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 group-hover:scale-110 transition-all duration-200" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">
              {(summary.durationMs / 1000).toFixed(1)}s
            </span>
            <span className="text-[10px] text-zinc-500 font-mono block">End-to-end DAG</span>
          </div>
        </div>

      </div>

      {/* Distribution Breakdown Card */}
      {badgeAttr && Object.keys(distributionMap).length > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-zinc-300 uppercase font-display tracking-wider font-semibold">
              Distribution by {badgeAttr.name}
            </span>
            <span className="text-zinc-500">
              {Object.keys(distributionMap).length} categories
            </span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(distributionMap).map(([label, count]) => {
              const pct = Math.round((count / records.length) * 100);
              return (
                <div key={label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium truncate max-w-sm font-sans">{label}</span>
                    <span className="font-mono text-zinc-500">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-[#ff4400] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
