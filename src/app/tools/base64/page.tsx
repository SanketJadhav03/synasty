'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { ArrowLeftRight, Copy, Check, RefreshCw, Upload, FileText } from 'lucide-react';

export default function Base64Page() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('Welcome to Synasty Platform!');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Unicode-safe Base64 conversion
  const utf8ToBase64 = (str: string) => {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  };

  const base64ToUtf8 = (str: string) => {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str.trim()), (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  };

  const handleConvert = () => {
    setError(null);
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(utf8ToBase64(input));
      } else {
        setOutput(base64ToUtf8(input));
      }
    } catch {
      setError(
        mode === 'decode'
          ? 'Invalid Base64 string format. Please verify your input characters.'
          : 'Could not encode input text.'
      );
      setOutput('');
    }
  };

  React.useEffect(() => {
    handleConvert();
  }, [input, mode]);

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setOutput(result);
      setInput(`[File: ${file.name} (${file.size} bytes)]`);
      setMode('encode');
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout
      slug="base64"
      title="Base64 Encoder & Decoder"
      category="Developer Utilities"
      description="Safely encode and decode UTF-8 text strings and binary files to Base64 format with live two-way preview."
      tips={[
        'Full UTF-8 support ensures international characters, emojis, and symbols are converted accurately without garbled outputs.',
        'File upload automatically constructs valid RFC 2397 Data URLs (e.g. data:image/png;base64,...).',
      ]}
    >
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('encode')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                mode === 'encode'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Encode (Text → Base64)
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                mode === 'decode'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Decode (Base64 → Text)
            </button>
            <button
              onClick={handleSwap}
              disabled={!output}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-all"
              title="Swap Input and Output"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <label className="cursor-pointer px-3.5 py-2 rounded-xl border border-dashed border-violet-400 bg-violet-500/5 hover:bg-violet-500/10 text-violet-500 text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5" /> File to Base64
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Input & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
            </label>
            <textarea
              rows={12}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste content here..."
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {mode === 'encode' ? 'Base64 Encoded Result' : 'Decoded Plain Text'}
              </label>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="text-xs text-violet-500 hover:underline flex items-center gap-1 disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Result'}
              </button>
            </div>
            <textarea
              readOnly
              rows={12}
              value={output}
              placeholder="Output will appear here automatically..."
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/80 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
