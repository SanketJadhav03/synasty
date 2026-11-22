'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Copy, RefreshCw, Check, Clock, Mic, AlignLeft, BookOpen } from 'lucide-react';

export default function WordCounterPage() {
  const [text, setText] = useState(
    'Synasty is an all-in-one digital platform unifying movie discovery, powerful free online developer utilities, curated digital services, and insightful technology tutorials under one modern destination.'
  );
  const [copied, setCopied] = useState(false);

  // Statistics calculation
  const charactersWithSpaces = text.length;
  const charactersWithoutSpaces = text.replace(/\s+/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || (text.trim() ? 1 : 0) : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;

  // Reading time (average 200 words per minute)
  const readingTimeMinutes = Math.ceil(words / 200);
  // Speaking time (average 130 words per minute)
  const speakingTimeMinutes = Math.ceil(words / 130);

  // Keyword density
  const getTopKeywords = () => {
    if (!text.trim()) return [];
    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for', 'of', 'or', 'by', 'with', 'as']);
    const cleanWords = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));

    const freq: Record<string, number> = {};
    cleanWords.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({
        word,
        count,
        percent: ((count / (cleanWords.length || 1)) * 100).toFixed(1),
      }));
  };

  const topKeywords = getTopKeywords();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      slug="word-counter"
      title="Word, Character & Readability Analyzer"
      category="Text & Writing"
      description="Inspect comprehensive text metrics: words, characters, sentences, paragraphs, estimated reading time, and keyword density."
      tips={[
        'Standard editorial reading speed is calculated at 200 words per minute (WPM).',
        'Keyword density analysis excludes standard English stop words (the, is, and, of) to emphasize meaningful topics.',
      ]}
    >
      <div className="space-y-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Words</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-violet-500 mt-1">{words}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Characters</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-pink-500 mt-1">{charactersWithSpaces}</div>
            <span className="text-[10px] text-slate-400">({charactersWithoutSpaces} no spaces)</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sentences</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 mt-1">{sentences}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Paragraphs</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 mt-1">{paragraphs}</div>
          </div>
        </div>

        {/* Reading and Speaking Speed Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Estimated Reading Time:
            </span>
            <span className="font-bold text-violet-500">~{readingTimeMinutes} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-pink-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Estimated Speaking Time:
            </span>
            <span className="font-bold text-pink-500">~{speakingTimeMinutes} min</span>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Content Editor
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="text-xs text-violet-500 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
              <button
                onClick={() => setText('')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your article, essay, or text here..."
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-sans text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 leading-relaxed"
          />
        </div>

        {/* Keyword Density */}
        {topKeywords.length > 0 && (
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-3">
              Top Keywords Density
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {topKeywords.map((kw, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center"
                >
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {kw.word}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {kw.count}x ({kw.percent}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
