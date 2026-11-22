'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Copy, Check, Type } from 'lucide-react';

export default function CaseConverterPage() {
  const [input, setInput] = useState('Everything Digital. One Destination with Synasty Platform.');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Conversion algorithms
  const toUpper = (str: string) => str.toUpperCase();
  const toLower = (str: string) => str.toLowerCase();
  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };
  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };
  const toCamelCase = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, (c) => c.toLowerCase());
  };
  const toPascalCase = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, (c) => c.toUpperCase());
  };
  const toKebabCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  const toSnakeCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const cases = [
    { label: 'UPPERCASE', value: toUpper(input), key: 'upper' },
    { label: 'lowercase', value: toLower(input), key: 'lower' },
    { label: 'Title Case', value: toTitleCase(input), key: 'title' },
    { label: 'Sentence case', value: toSentenceCase(input), key: 'sentence' },
    { label: 'camelCase', value: toCamelCase(input), key: 'camel' },
    { label: 'PascalCase', value: toPascalCase(input), key: 'pascal' },
    { label: 'kebab-case', value: toKebabCase(input), key: 'kebab' },
    { label: 'snake_case', value: toSnakeCase(input), key: 'snake' },
  ];

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <ToolLayout
      slug="case-converter"
      title="Text Case Converter & Slug Generator"
      category="Text & Writing"
      description="Convert text strings into UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, kebab-case, or snake_case with 1-click clipboard copy."
      tips={[
        'camelCase and PascalCase are standard in JavaScript, TypeScript, React component names, and C#.',
        'kebab-case is ideal for URL slugs and CSS class conventions.',
      ]}
    >
      <div className="space-y-6">
        {/* Input box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Input Text
          </label>
          <textarea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text to convert..."
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-sans text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Variations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cases.map((item) => (
            <div
              key={item.key}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {item.label}
                </span>
                <button
                  onClick={() => handleCopy(item.key, item.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold hover:text-violet-500 flex items-center gap-1 transition-colors"
                >
                  {copiedKey === item.key ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 break-all select-all">
                {item.value || 'Waiting for text input...'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
