import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Globe, Cpu, Heart, CheckCircle2 } from 'lucide-react';
import { SynastyLogo } from '@/components/SynastyLogo';

export const metadata = {
  title: 'About Synasty – The All-in-One Digital Platform',
  description:
    'Learn about Synasty vision, engineering principles, and our commitment to free digital utilities, legal cinema discovery, and accessible technology education.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="flex justify-center">
          <SynastyLogo size="xl" showTagline={true} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-6">
          Everything Digital.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-600 to-rose-500">
            One Unified Destination.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Synasty was conceived with a clear mission: replace fragmented, ad-cluttered web utilities and piracy-driven websites with a clean, fast, privacy-first all-in-one ecosystem.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-lg space-y-4">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            100% Legal Cinema & Film Preservation
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Synasty Movies celebrates cinema history by indexing only legally verified public-domain films and authorized rights-holder sources. We never scrape piracy websites or host copyright-infringing content.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-lg space-y-4">
          <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500 w-fit">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Privacy-First Client-Side Utilities
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlike legacy utility portals that upload user inputs to backend servers, Synasty Tools run cryptographic hashes, QR generation, and JSON formatting directly in your local browser memory using modern Web APIs.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-lg space-y-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 w-fit">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Curated Free & Freemium Services
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Our services directory cuts through marketing hype to highlight genuinely generous free tiers, open-source AI models, and student perks that help developers build without prohibitive initial costs.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-lg space-y-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 w-fit">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Independent Editorial & Tutorials
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Synasty Blogs delivers hands-on engineering tutorials, deep architectural case studies, and digital culture essays authored by experienced developers who care about code quality.
          </p>
        </div>
      </div>

      {/* Technology Architecture */}
      <div className="p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Built for Speed & Reliability
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Synasty is architected as a modern serverless application deployed on Vercel with MongoDB Atlas document storage, Next.js App Router, Tailwind CSS, and strict TypeScript types. Every page is optimized for sub-100ms response times globally.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-center">
            Next.js App Router
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-center">
            TypeScript 5
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-center">
            MongoDB Atlas
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-center">
            Vercel Serverless
          </div>
        </div>
      </div>

      {/* CTA Row */}
      <div className="text-center pt-6">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-600 to-rose-500 text-white font-bold text-sm shadow-xl hover:opacity-95 transition-all"
        >
          Explore Synasty Platform
        </Link>
      </div>
    </div>
  );
}
