'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Bot, 
  ShieldCheck, 
  Zap, 
  Database, 
  Cpu, 
  CheckCircle2
} from 'lucide-react';

interface SideRailsProps {
  isRunning?: boolean;
  hasRecords?: boolean;
  totalRecords?: number;
}

/**
 * Left Caricature Rail: The Web Harvester & Crawling Realm
 * Pinned to the left viewport gutter to turn empty blank space into rich project art.
 */
export const LeftCaricatureRail: React.FC<SideRailsProps> = ({ isRunning = false }) => {
  return (
    <aside 
      className="hidden min-[1380px]:flex flex-col gap-2.5 fixed left-3 2xl:left-5 top-20 w-36 min-[1500px]:w-44 2xl:w-52 z-30 select-none pointer-events-none"
      aria-label="Harvester Caricature Rail"
    >
      <div className="flex flex-col gap-2.5 pointer-events-auto">
        
        {/* Header Telemetry Pill */}
        <div className="flex items-center justify-between px-2 py-1 rounded-md border border-[#ff4400]/40 bg-zinc-950/90 backdrop-blur-md shadow-[0_0_15px_rgba(255,68,0,0.15)] text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4400] animate-pulse" />
            <span className="text-[#ff4400] font-bold">HARVESTER</span>
            <span className="text-zinc-500">{'// 02'}</span>
          </div>
          <span className="text-[9px] text-zinc-400 font-mono">
            {isRunning ? 'CRAWLING' : 'ONLINE'}
          </span>
        </div>

        {/* The Caricature Art Card: Spider Crawlers & DOM Blocks */}
        <div className="relative group rounded-xl border border-[#ff4400]/30 hover:border-[#ff4400]/70 bg-zinc-950/90 backdrop-blur-md overflow-hidden shadow-[0_0_20px_rgba(255,68,0,0.12)] hover:shadow-[0_0_30px_rgba(255,68,0,0.25)] transition-all duration-300">
          
          {/* Subtle Orange Gradient Sheen */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#ff4400]/10 via-transparent to-black/60 pointer-events-none z-10" />

          {/* Top Industrial Overlay Badge */}
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/85 border border-[#ff4400]/50 text-[9px] font-mono text-[#ff4400] shadow-sm">
            <Bot className="w-2.5 h-2.5 text-[#ff4400]" />
            <span>SPIDERS</span>
          </div>

          {/* 403 Forbidden Stamp Overlay */}
          <div className="absolute top-2 right-2 z-20 px-1.5 py-0.5 rounded bg-[#ff4400]/25 border border-[#ff4400] text-[8px] font-mono font-bold text-orange-200 shadow-sm animate-pulse">
            403 BYPASS
          </div>

          {/* Main Caricature Graphic */}
          <div className="p-1 pt-6 pb-1 relative">
            <Image 
              src="/images/caricature_left_crawler.jpg" 
              alt="Caricature of robotic spider crawlers harvesting HTML tables"
              width={360}
              height={640}
              priority
              className="w-full h-auto max-h-[260px] 2xl:max-h-[310px] object-contain rounded-lg filter contrast-125 brightness-105 group-hover:scale-102 transition-transform duration-300"
            />
          </div>

          {/* Bottom Card Caption */}
          <div className="px-2 py-1 border-t border-zinc-800/80 bg-black/75 text-[9px] font-mono text-zinc-400 flex items-center justify-between">
            <span className="truncate">DOM &rarr; Clean</span>
            <span className="text-[#ff4400] font-bold">NOISELESS</span>
          </div>
        </div>

        {/* Small Thing #1: Crawler Policy & Noise Filter Meter */}
        <div className="p-2 rounded-lg border border-zinc-800/90 bg-zinc-950/90 backdrop-blur-md shadow-sm space-y-1 text-xs font-mono">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-400 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-[#ff4400]" />
              Noise Filter
            </span>
            <span className="text-[#ff4400] font-bold">99.4%</span>
          </div>
          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div className="h-full bg-gradient-to-r from-[#ff4400] to-orange-400 rounded-full w-[94%]" />
          </div>
          <div className="flex justify-between text-[8px] text-zinc-500 pt-0.5">
            <span>&lt;script&gt; stripped</span>
            <span>Robots.txt ok</span>
          </div>
        </div>

        {/* Small Thing #2: Editorial Tape Doodle Note */}
        <div className="relative p-2 rounded-lg bg-orange-950/25 border border-[#ff4400]/40 rotate-[-1deg] hover:rotate-0 transition-transform duration-200 shadow-[0_0_15px_rgba(255,68,0,0.08)]">
          {/* Faux Tape Corner */}
          <div className="absolute -top-1 left-3 w-5 h-1.5 bg-orange-400/40 rounded-sm rotate-2 border border-orange-300/30" />
          <p className="font-mono text-[9px] text-orange-200 leading-tight">
            &ldquo;Manual web scraping is dead. The spider bots have taken over.&rdquo;
          </p>
          <div className="mt-1 flex items-center justify-between text-[8px] font-mono text-[#ff4400]">
            <span>- HARVESTER</span>
            <span>#SPIDER-04</span>
          </div>
        </div>

        {/* Small Thing #3: Scraped Data Jar Indicator */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-lg border border-zinc-800/80 bg-black/75 text-[9px] font-mono text-zinc-400">
          <div className="w-6 h-6 rounded bg-[#ff4400]/15 border border-[#ff4400]/40 flex items-center justify-center text-[#ff4400] shrink-0">
            <Database className="w-3 h-3" />
          </div>
          <div className="min-w-0">
            <div className="text-zinc-200 font-semibold truncate text-[9px]">Data Jar Buffer</div>
            <div className="text-[8px] text-[#ff4400] truncate">Structured Nodes</div>
          </div>
        </div>

      </div>
    </aside>
  );
};

/**
 * Right Caricature Rail: The AI Intelligence & Lineage Realm
 * Pinned to the right viewport gutter to turn empty blank space into rich project art.
 */
export const RightCaricatureRail: React.FC<SideRailsProps> = ({ 
  isRunning = false,
  totalRecords = 0
}) => {
  return (
    <aside 
      className="hidden min-[1380px]:flex flex-col gap-2.5 fixed right-3 2xl:right-5 top-20 w-36 min-[1500px]:w-44 2xl:w-52 z-30 select-none pointer-events-none"
      aria-label="Lineage Caricature Rail"
    >
      <div className="flex flex-col gap-2.5 pointer-events-auto">
        
        {/* Header Telemetry Pill */}
        <div className="flex items-center justify-between px-2 py-1 rounded-md border border-[#ff4400]/40 bg-zinc-950/90 backdrop-blur-md shadow-[0_0_15px_rgba(255,68,0,0.15)] text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4400] animate-pulse" />
            <span className="text-[#ff4400] font-bold">AUDIT AGENT</span>
            <span className="text-zinc-500">{'// 06'}</span>
          </div>
          <span className="text-[9px] text-zinc-400 font-mono">
            {isRunning ? 'AUDITING' : 'VERIFIED'}
          </span>
        </div>

        {/* The Caricature Art Card: AI Fact-Checkers & Truth Stamp */}
        <div className="relative group rounded-xl border border-[#ff4400]/30 hover:border-[#ff4400]/70 bg-zinc-950/90 backdrop-blur-md overflow-hidden shadow-[0_0_20px_rgba(255,68,0,0.12)] hover:shadow-[0_0_30px_rgba(255,68,0,0.25)] transition-all duration-300">
          
          {/* Subtle Orange Gradient Sheen */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#ff4400]/10 via-transparent to-black/60 pointer-events-none z-10" />

          {/* Top Industrial Overlay Badge */}
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/85 border border-[#ff4400]/50 text-[9px] font-mono text-[#ff4400] shadow-sm">
            <ShieldCheck className="w-2.5 h-2.5 text-[#ff4400]" />
            <span>TRUTH INDEX</span>
          </div>

          {/* Certified Stamp Overlay */}
          <div className="absolute top-2 right-2 z-20 px-1.5 py-0.5 rounded bg-[#ff4400]/25 border border-[#ff4400] text-[8px] font-mono font-bold text-orange-200 shadow-sm animate-pulse">
            CERTIFIED
          </div>

          {/* Main Caricature Graphic */}
          <div className="p-1 pt-6 pb-1 relative">
            <Image 
              src="/images/caricature_right_lineage.jpg" 
              alt="Caricature of AI agent robot fact-checkers inspecting citation anchors"
              width={360}
              height={640}
              priority
              className="w-full h-auto max-h-[260px] 2xl:max-h-[310px] object-contain rounded-lg filter contrast-125 brightness-105 group-hover:scale-102 transition-transform duration-300"
            />
          </div>

          {/* Bottom Card Caption */}
          <div className="px-2 py-1 border-t border-zinc-800/80 bg-black/75 text-[9px] font-mono text-zinc-400 flex items-center justify-between">
            <span className="truncate">Verbatim Links</span>
            <span className="text-[#ff4400] font-bold">100% TRUTH</span>
          </div>
        </div>

        {/* Small Thing #1: Ground Truth Indexer Gauge */}
        <div className="p-2 rounded-lg border border-zinc-800/90 bg-zinc-950/90 backdrop-blur-md shadow-sm space-y-1 text-xs font-mono">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-400 flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5 text-[#ff4400]" />
              Anchor Accuracy
            </span>
            <span className="text-[#ff4400] font-bold">100%</span>
          </div>
          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div className="h-full bg-gradient-to-r from-orange-400 to-[#ff4400] rounded-full w-full" />
          </div>
          <div className="flex justify-between text-[8px] text-zinc-500 pt-0.5">
            <span>Hallucination: 0%</span>
            <span>Anchor: Exact</span>
          </div>
        </div>

        {/* Small Thing #2: Editorial Tape Doodle Note */}
        <div className="relative p-2 rounded-lg bg-orange-950/25 border border-[#ff4400]/40 rotate-[1deg] hover:rotate-0 transition-transform duration-200 shadow-[0_0_15px_rgba(255,68,0,0.08)]">
          {/* Faux Tape Corner */}
          <div className="absolute -top-1 right-3 w-5 h-1.5 bg-orange-400/40 rounded-sm -rotate-2 border border-orange-300/30" />
          <p className="font-mono text-[9px] text-orange-200 leading-tight">
            &ldquo;If an LLM claims a fact without a URL anchor, it never happened.&rdquo;
          </p>
          <div className="mt-1 flex items-center justify-between text-[8px] font-mono text-[#ff4400]">
            <span>- AUDIT AGENT</span>
            <span>#PROVENANCE</span>
          </div>
        </div>

        {/* Small Thing #3: Live Lineage Counter Seal */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-lg border border-zinc-800/80 bg-black/75 text-[9px] font-mono text-zinc-400">
          <div className="w-6 h-6 rounded bg-[#ff4400]/15 border border-[#ff4400]/40 flex items-center justify-center text-[#ff4400] shrink-0">
            <Cpu className="w-3 h-3" />
          </div>
          <div className="min-w-0">
            <div className="text-zinc-200 font-semibold truncate text-[9px]">Deterministic DAG</div>
            <div className="text-[8px] text-[#ff4400] truncate">
              {totalRecords > 0 ? `${totalRecords} Canonical Rows` : 'Zero Hallucinations'}
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};
