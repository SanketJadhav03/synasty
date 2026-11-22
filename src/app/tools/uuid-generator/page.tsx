'use client';

import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Copy, RefreshCw, Check, Download, Layers } from 'lucide-react';

export default function UuidGeneratorPage() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [includeHyphens, setIncludeHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateUuidV4 = () => {
    if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
      let id = window.crypto.randomUUID();
      if (!includeHyphens) id = id.replace(/-/g, '');
      return uppercase ? id.toUpperCase() : id.toLowerCase();
    }
    // Fallback RFC4122 v4 generator
    let dt = new Date().getTime();
    const template = includeHyphens
      ? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
    const raw = template.replace(/[xy]/g, (c) => {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uppercase ? raw.toUpperCase() : raw.toLowerCase();
  };

  const generateBulk = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(generateUuidV4());
    }
    setUuids(list);
  };

  useEffect(() => {
    generateBulk();
  }, [count, uppercase, includeHyphens]);

  const handleCopyAll = () => {
    if (uuids.length > 0) {
      navigator.clipboard.writeText(uuids.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synasty-uuids-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      slug="uuid-generator"
      title="UUID v4 Bulk Generator"
      category="Developer Utilities"
      description="Generate cryptographically random RFC 4122 Version-4 Universally Unique Identifiers (UUIDs) with bulk export capabilities."
      tips={[
        'UUID v4 has 122 bits of cryptographical entropy, making collisions statistically virtually impossible (1 in 5.3 x 10^36).',
        'Useful for database primary keys, distributed tracking tokens, and idempotency request keys.',
      ]}
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-500">Count:</span>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
              >
                <option value={1}>1 UUID</option>
                <option value={5}>5 UUIDs</option>
                <option value={10}>10 UUIDs</option>
                <option value={25}>25 UUIDs</option>
                <option value={50}>50 UUIDs</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded accent-violet-600"
              />
              <span>Uppercase</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={includeHyphens}
                onChange={(e) => setIncludeHyphens(e.target.checked)}
                className="rounded accent-violet-600"
              />
              <span>Include Hyphens</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateBulk}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate
            </button>
            <button
              onClick={handleCopyAll}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied All' : 'Copy All'}
            </button>
            <button
              onClick={handleDownloadTxt}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Save .TXT
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-2">
          {uuids.map((id, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 shadow-sm hover:border-violet-500/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-sans text-[11px] w-6">{idx + 1}.</span>
                <span className="select-all">{id}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(id);
                }}
                className="text-violet-500 hover:underline text-xs flex items-center gap-1 pl-2"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
