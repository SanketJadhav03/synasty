'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Sparkles, Check, Copy } from 'lucide-react';
import { AdBanner } from './AdBanner';
import { INITIAL_TOOLS } from '@/lib/initialData';

interface ToolLayoutProps {
  slug: string;
  title: string;
  category: string;
  description: string;
  children: React.ReactNode;
  tips?: string[];
}

export function ToolLayout({
  slug,
  title,
  category,
  description,
  children,
  tips = [],
}: ToolLayoutProps) {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedTools = INITIAL_TOOLS.filter((t) => t.slug !== slug).slice(0, 4);

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-violet-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools Directory
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 hover:text-violet-500 transition-all shadow-sm"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied Link
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" /> Share Tool
            </>
          )}
        </button>
      </div>

      {/* Tool Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-500 border border-violet-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          {category}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl">
          {description}
        </p>
      </div>

      {/* Main Tool Interactive Sandbox */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl overflow-hidden p-4 sm:p-8 mb-10">
        {children}
      </div>

      {/* Header Advertisement banner */}
      <AdBanner placement="in-content" />

      {/* Tool Guides & Tips */}
      {tips.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-6 mb-12">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            Tips & Best Practices
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Related Tools */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Other Useful Synasty Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all group shadow-sm"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-500 mb-1 block">
                {tool.category}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-500 transition-colors">
                {tool.name}
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ToolLayout;
