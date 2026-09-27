import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://provenance-zeta.vercel.app'),
  title: 'Provenance — Autonomous Data Intelligence Platform',
  description: 'Prompt-driven web data collection, schema synthesis, and verifiable lineage platform with autonomous agent pipelines.',
  alternates: {
    canonical: 'https://provenance-zeta.vercel.app',
  },
  openGraph: {
    title: 'Provenance — Autonomous Data Intelligence Platform',
    description: 'Prompt-driven web data collection, schema synthesis, and verifiable lineage platform with autonomous agent pipelines.',
    url: 'https://provenance-zeta.vercel.app',
    siteName: 'Provenance',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Provenance — Autonomous Data Intelligence Platform',
    description: 'Prompt-driven web data collection, schema synthesis, and verifiable lineage platform with autonomous agent pipelines.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Provenance',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All',
  description: 'Autonomous multi-stage DAG agent pipeline for prompt-driven web data intelligence, entity extraction, and verifiable lineage.',
  url: 'https://provenance-zeta.vercel.app',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Natural Language Intent & Schema Planner',
    'Human-in-the-Loop Interactive Schema Refiner',
    'Robots.txt & WAF Sandbox Routing Agent',
    'Multimodal Layout-Agnostic Visual AI Scraper Fallback',
    'Verifiable Citation Anchor Protocol with DOM Snapshot Audit',
    'Levenshtein Deduplication & Format Normalization',
    'Pandas Python Sandbox & SQLite Database DDL Export',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} min-h-full flex flex-col bg-[#09090b] text-zinc-100 font-sans selection:bg-blue-600 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
