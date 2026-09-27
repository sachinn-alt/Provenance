import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-zinc-100 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-xl bg-[#ff4400]/10 border border-[#ff4400]/30 flex items-center justify-center text-[#ff4400]">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <Terminal className="w-3 h-3 text-[#ff4400]" />
            <span>HTTP 404 &bull; ROUTE UNDEFINED</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 font-display uppercase">
            Entity Node Not Found
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            The requested workflow lineage or resource path does not exist on the Provenance cluster. Verify the address or return to the active workbench.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#ff4400] hover:bg-[#ff5511] text-xs font-bold text-black shadow-lg shadow-[#ff4400]/20 transition-all group uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Workbench</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
