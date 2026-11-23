'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Search,
  Sparkles,
  ArrowRight,
  QrCode,
  Scan,
  Braces,
  Binary,
  Link2,
  ShieldCheck,
  Fingerprint,
  Hash,
  FileText,
  Type,
  Palette,
  KeyRound,
} from 'lucide-react';
import { INITIAL_TOOLS } from '@/lib/initialData';
import { AdBanner } from '@/components/AdBanner';

export default function ToolsCatalogPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Developer Utilities',
    'Security & Crypto',
    'Media & Barcodes',
    'Text & Writing',
    'Design & Colors',
    'Web Utilities',
  ];

  const iconMap: Record<string, React.ReactNode> = {
    QrCode: <QrCode className="w-5 h-5 text-violet-500" />,
    Scan: <Scan className="w-5 h-5 text-violet-500" />,
    Braces: <Braces className="w-5 h-5 text-violet-500" />,
    Binary: <Binary className="w-5 h-5 text-violet-500" />,
    Link2: <Link2 className="w-5 h-5 text-violet-500" />,
    ShieldCheck: <ShieldCheck className="w-5 h-5 text-violet-500" />,
    Fingerprint: <Fingerprint className="w-5 h-5 text-violet-500" />,
    Hash: <Hash className="w-5 h-5 text-violet-500" />,
    FileText: <FileText className="w-5 h-5 text-violet-500" />,
    Type: <Type className="w-5 h-5 text-violet-500" />,
    Palette: <Palette className="w-5 h-5 text-violet-500" />,
    KeyRound: <KeyRound className="w-5 h-5 text-violet-500" />,
    Sparkles: <Sparkles className="w-5 h-5 text-violet-500" />,
  };

  const filteredTools = INITIAL_TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-500 border border-violet-500/20 mb-4">
          <Wrench className="w-4 h-4" />
          Synasty Free Utilities
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Powerful Online Tools.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-600 to-rose-500">
            100% Free Forever.
          </span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Fast, client-side, privacy-first web utilities designed for developers, creators, and digital professionals. No tracking, zero sign-up friction.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-10 space-y-4">
        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools by name, utility, or keyword..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-md text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md shadow-violet-500/25 scale-[1.02]'
                    : 'bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 shadow-sm'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group relative flex flex-col justify-between p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-violet-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 group-hover:scale-110 transition-transform">
                  {iconMap[tool.icon] || <Wrench className="w-5 h-5 text-violet-500" />}
                </div>
                {tool.isFeatured && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20">
                    Popular
                  </span>
                )}
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-500 block mb-1">
                {tool.category}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-500 transition-colors">
                {tool.name}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-violet-500 group-hover:translate-x-1 transition-transform">
              <span>Open Tool</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="py-16 text-center text-slate-500 dark:text-slate-400">
          No tools found matching your search.
        </div>
      )}

      {/* In-content Advertisement banner */}
      <AdBanner placement="in-content" />
    </div>
  );
}
