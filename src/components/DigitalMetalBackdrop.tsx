'use client';

import React from 'react';

export const DigitalMetalBackdrop: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0" 
      aria-hidden="true"
    >
      {/* 1. Technical Micro-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

      {/* 2. Top Specular Horizon Glow (Digital Metal Signature Light) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 flex items-center justify-center">
        {/* Cyan Ambient Glow */}
        <div className="absolute w-[90%] max-w-5xl h-64 bg-gradient-to-r from-transparent via-cyan-500/12 to-transparent blur-3xl -top-12" />
        
        {/* Orange Accent Specular Glow */}
        <div className="absolute w-[60%] max-w-3xl h-32 bg-gradient-to-r from-transparent via-[#ff4400]/10 to-transparent blur-2xl top-10" />

        {/* Specular Horizontal Laser Seam at upper boundary */}
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 via-sky-300/60 to-transparent top-28" />

        {/* Modular Monolith Architectural Columns across Top Horizon */}
        <div className="w-full px-6 grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1.5 h-36 opacity-30 top-10 absolute">
          {Array.from({ length: 16 }).map((_, i) => (
            <div 
              key={i} 
              className="relative h-full flex flex-col justify-between"
              style={{
                opacity: i % 2 === 0 ? 0.7 : 0.4,
                transform: `scaleY(${0.85 + (i % 3) * 0.1})`
              }}
            >
              {/* Upper Monolith Block */}
              <div className="h-[46%] w-full rounded-[1px] bg-gradient-to-b from-zinc-900/30 via-zinc-800/40 to-zinc-950/90 border border-zinc-800/30 border-b-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.15)]" />
              {/* Lower Monolith Block */}
              <div className="h-[46%] w-full rounded-[1px] bg-gradient-to-b from-zinc-950/90 via-zinc-900/40 to-black/90 border border-zinc-800/20 border-t-cyan-400/40 shadow-inner" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Deep Radial Vignette to keep text & tables razor sharp */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,5,0.85)_100%)]" />

      {/* 4. Subtle Bottom Horizon Reflection Anchor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-t from-cyan-950/10 via-transparent to-transparent blur-2xl" />
    </div>
  );
};
