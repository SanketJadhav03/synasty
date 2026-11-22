'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Search, Film, Wrench } from 'lucide-react';
import { SynastyLogo } from '@/components/SynastyLogo';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6 max-w-md mx-auto">
      <SynastyLogo size="lg" />

      <div className="space-y-2">
        <span className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-600 to-rose-500">
          404
        </span>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          The destination you requested does not exist or has been relocated within the Synasty ecosystem.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md transition-all"
        >
          <Home className="w-4 h-4" /> Go to Homepage
        </Link>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-violet-500 transition-all shadow-sm"
        >
          <Wrench className="w-4 h-4" /> Explore Tools
        </Link>
      </div>
    </div>
  );
}
