'use client';

import React from 'react';

interface FooterProps {
  onOpenApi?: () => void;
  onOpenHistory?: () => void;
  mode?: 'live' | 'demo';
  totalWorkflows?: number;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenApi,
  onOpenHistory,
  mode = 'demo',
  totalWorkflows = 1
}) => {
  return (
    <footer className="w-full bg-[#050505]/60 backdrop-blur-[2px] text-white border-t border-zinc-900/60 relative overflow-hidden select-none font-sans pt-16 pb-8 md:pt-24 md:pb-12 mt-16">
      
      {/* Architectural Monolith Grid Backdrop with Specular Horizon Light */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Ambient Cyan & Specular Orange Horizon Glow */}
        <div className="absolute w-full max-w-6xl h-48 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent blur-3xl -translate-y-6" />
        <div className="absolute w-full max-w-4xl h-24 bg-gradient-to-r from-transparent via-[#ff4400]/15 to-transparent blur-2xl translate-y-4" />
        
        {/* Specular Horizontal Laser Seam */}
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent top-1/2 -translate-y-10" />

        {/* 16-Column Modular Monolith Blocks */}
        <div className="w-full max-w-7xl px-4 grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1 h-56 opacity-45">
          {Array.from({ length: 16 }).map((_, i) => (
            <div 
              key={i}
              className="relative h-full flex flex-col justify-between"
            >
              {/* Upper Monolith Block */}
              <div className="h-[48%] w-full rounded-[2px] bg-gradient-to-b from-zinc-900/40 via-zinc-800/30 to-zinc-950/90 border border-zinc-800/30 border-b-cyan-400/50 shadow-inner" />
              {/* Lower Monolith Block */}
              <div className="h-[48%] w-full rounded-[2px] bg-gradient-to-b from-zinc-950/90 via-zinc-900/30 to-black/80 border border-zinc-800/20 border-t-cyan-400/30 shadow-inner" />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 md:space-y-16">
        
        {/* Top Editorial Row: Brand Thesis Statement + Minimal Navigation Links */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pt-2">
          
          {/* Left: Punchy Thesis Copy */}
          <div className="max-w-xl space-y-2">
            <p className="text-zinc-400 text-xs sm:text-sm md:text-[15px] leading-relaxed font-sans tracking-normal">
              Engineers waste weeks fixing broken scrapers, wrestling hallucinated data, and crawling messy DOM trees by hand. Provenance automates multi-stage extraction with 100% verifiable sentence-level citation anchors.
            </p>
          </div>

          {/* Right: Minimalist Uppercase Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono tracking-widest uppercase text-zinc-400">
            {onOpenApi && (
              <button
                type="button"
                onClick={onOpenApi}
                className="hover:text-white transition-colors cursor-pointer"
              >
                API Docs
              </button>
            )}

            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Runs</span>
                <span className="text-[10px] px-1 rounded bg-zinc-800 text-zinc-300">
                  {totalWorkflows}
                </span>
              </button>
            )}

            <a
              href="https://github.com/sachinn-alt/Provenance"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors cursor-pointer"
            >
              GitHub
            </a>

            <span className="text-zinc-600 hidden sm:inline">&bull;</span>

            <span className="text-zinc-500 font-mono text-[11px]">
              MODE: {mode.toUpperCase()}
            </span>
          </nav>

        </div>

        {/* Center / Hero: Giant Iconic Typographic Wordmark with Geometric Triple-Arc Mark ')))' */}
        <div className="pt-4 pb-2 border-b border-zinc-900/60">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 group">
            
            {/* The Geometric Triple-Arc Mark ')))' */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 text-white group-hover:text-[#ff4400] transition-colors duration-300">
              {/* Arc Blade 1 */}
              <svg 
                className="h-12 sm:h-16 md:h-24 lg:h-32 xl:h-36 w-auto fill-current" 
                viewBox="0 0 28 80"
                aria-hidden="true"
              >
                <path d="M4 4 C18 24 18 56 4 76 C11 76 24 56 24 40 C24 24 11 4 4 4 Z" />
              </svg>

              {/* Arc Blade 2 */}
              <svg 
                className="h-12 sm:h-16 md:h-24 lg:h-32 xl:h-36 w-auto fill-current" 
                viewBox="0 0 28 80"
                aria-hidden="true"
              >
                <path d="M4 4 C18 24 18 56 4 76 C11 76 24 56 24 40 C24 24 11 4 4 4 Z" />
              </svg>

              {/* Arc Blade 3 */}
              <svg 
                className="h-12 sm:h-16 md:h-24 lg:h-32 xl:h-36 w-auto fill-current" 
                viewBox="0 0 28 80"
                aria-hidden="true"
              >
                <path d="M4 4 C18 24 18 56 4 76 C11 76 24 56 24 40 C24 24 11 4 4 4 Z" />
              </svg>
            </div>

            {/* Monumental Hero Wordmark */}
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[115px] xl:text-[145px] font-black tracking-[-0.04em] text-white leading-none whitespace-nowrap overflow-hidden transition-all duration-300 group-hover:tracking-[-0.035em]">
              Provenance
            </h2>

          </div>
        </div>

        {/* Bottom Sub-Footer Bar: Copyright, Location, Legal Links */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono text-zinc-500 pt-2">
          
          {/* Left: Copyright */}
          <div>
            &copy; {new Date().getFullYear()} Provenance, Inc. All rights reserved.
          </div>

          {/* Center: Geo / Mission Coordinates */}
          <div className="tracking-widest uppercase text-zinc-400 hidden md:block">
            SF &bull; NYC &bull; BLR
          </div>

          {/* Right: Legal & Architecture */}
          <div className="flex items-center gap-6 uppercase tracking-wider">
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-[#ff4400] transition-colors cursor-pointer text-zinc-400">
              MIT License
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
};
