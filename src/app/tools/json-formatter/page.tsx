'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Copy, Download, RefreshCw, Check, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';

export default function JsonFormatterPage() {
  const [input, setInput] = useState(`{\n  "platform": "Synasty",\n  "domain": "https://synasty.xyz",\n  "status": "operational",\n  "services": ["movies", "tools", "services", "blogs"],\n  "version": 2026\n}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState<number | 'tab'>(2);

  const formatJson = (minify = false) => {
    setError(null);
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setIsValid(true);
      if (minify) {
        setOutput(JSON.stringify(parsed));
      } else {
        const space = indentSize === 'tab' ? '\t' : Number(indentSize);
        setOutput(JSON.stringify(parsed, null, space));
      }
    } catch (err: any) {
      setIsValid(false);
      setError(err.message || 'Invalid JSON syntax');
      setOutput('');
    }
  };

  const handleValidate = () => {
    setError(null);
    try {
      JSON.parse(input);
      setIsValid(true);
    } catch (err: any) {
      setIsValid(false);
      setError(err.message || 'Invalid JSON syntax');
    }
  };

  const handleCopy = () => {
    const textToCopy = output || input;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const content = output || input;
    if (!content) return;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `synasty-formatted-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    const sample = {
      project: 'Synasty Platform',
      features: {
        movies: 'TMDB & Legal Public Domain Archive',
        tools: 13,
        blogs: 'Tech & Digital tutorials',
      },
      verified: true,
      timestamp: new Date().toISOString(),
    };
    setInput(JSON.stringify(sample, null, 2));
    setOutput('');
    setError(null);
    setIsValid(null);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setIsValid(null);
  };

  return (
    <ToolLayout
      slug="json-formatter"
      title="JSON Formatter, Validator & Minifier"
      category="Developer Utilities"
      description="Format, prettify, compact, and validate raw JSON with instant syntax error detection and downloadable JSON files."
      tips={[
        'JSON keys and string values must strictly use double quotes (").',
        'Trailing commas in objects and arrays are forbidden in valid standard JSON (RFC 8259).',
        'All parsing is done natively in browser V8 engine for instant, lag-free performance.',
      ]}
    >
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => formatJson(false)}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-sm transition-all"
            >
              Beautify JSON
            </button>
            <button
              onClick={() => formatJson(true)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs text-slate-800 dark:text-slate-200 transition-all"
            >
              Minify / Compact
            </button>
            <button
              onClick={handleValidate}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs text-slate-800 dark:text-slate-200 transition-all"
            >
              Validate
            </button>
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500">Indent:</span>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(e.target.value === 'tab' ? 'tab' : Number(e.target.value))}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
                <option value="tab">Tabs</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadSample}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            >
              Load Sample
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Status banner */}
        {isValid === true && !error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Valid Standard JSON
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Syntax Error: {error}</span>
          </div>
        )}

        {/* Input & Output Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 tracking-wider">
              <span>Input Raw JSON</span>
              <span className="text-[11px] font-normal lowercase">{input.length} characters</span>
            </div>
            <textarea
              rows={16}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setIsValid(null);
                setError(null);
              }}
              placeholder="Paste unformatted or raw JSON here..."
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 tracking-wider">
              <span>Formatted Output</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2 py-0.5 rounded text-xs text-violet-500 hover:underline flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2 py-0.5 rounded text-xs text-violet-500 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Save File
                </button>
              </div>
            </div>
            <textarea
              readOnly
              rows={16}
              value={output || input}
              placeholder="Formatted output will appear here..."
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/80 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none resize-y"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
