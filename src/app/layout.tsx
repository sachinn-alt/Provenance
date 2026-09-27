import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Provenance — Autonomous Data Intelligence Platform',
  description: 'Prompt-driven web data collection, schema synthesis, and verifiable lineage platform with autonomous agent pipelines.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#09090b] text-zinc-100 font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
