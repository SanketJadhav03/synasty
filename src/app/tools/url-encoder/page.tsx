'use client';

import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Copy, Check, ArrowLeftRight, Layers } from 'lucide-react';

export default function UrlEncoderPage() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('https://synasty.xyz/search?q=movie discovery & tools=free online utilities#trending');
  const [output, setOutput] = useState('');
  const [parsedUrl, setParsedUrl] = useState<{
    protocol: string;
    host: string;
    pathname: string;
    search: string;
    hash: string;
    params: [string, string][];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setParsedUrl(null);
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setOutput('Error: Malformed URI sequence');
    }

    // Try parsing as standard URL
    try {
      const u = new URL(mode === 'encode' ? input : decodeURIComponent(input));
      const params: [string, string][] = [];
      u.searchParams.forEach((val, key) => params.push([key, val]));
      setParsedUrl({
        protocol: u.protocol,
        host: u.host,
        pathname: u.pathname,
        search: u.search,
        hash: u.hash,
        params,
      });
    } catch {
      setParsedUrl(null);
    }
  }, [input, mode]);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout
      slug="url-encoder"
      title="URL Encoder, Decoder & Parameter Inspector"
      category="Developer Utilities"
      description="Encode special characters into percent-encoded URI components or decode escaped URLs with a structured query parameter inspector."
      tips={[
        'encodeURIComponent escapes all characters including ?, =, &, and / which makes query parameter values safe for transport.',
        'The parameter inspector below parses key-value pairs for easy debugging of tracking URLs and API query strings.',
      ]}
    >
      <div className="space-y-6">
        {/* Mode Selector */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'encode'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Encode URL
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'decode'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Decode URL
          </button>
        </div>

        {/* Textboxes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Input String
            </label>
            <textarea
              rows={8}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste URL or parameters here..."
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Processed Output
              </label>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="text-xs text-violet-500 hover:underline flex items-center gap-1 disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              rows={8}
              value={output}
              placeholder="Result will appear here..."
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/80 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* URL Component Inspector */}
        {parsedUrl && (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Layers className="w-4 h-4 text-violet-500" /> URL Breakdown Inspector
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Protocol</span>
                <span className="font-mono font-semibold">{parsedUrl.protocol}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Host / Domain</span>
                <span className="font-mono font-semibold">{parsedUrl.host}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Pathname</span>
                <span className="font-mono font-semibold">{parsedUrl.pathname}</span>
              </div>
            </div>

            {parsedUrl.params.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Parsed Query Parameters ({parsedUrl.params.length})
                </span>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-2.5">Key</th>
                        <th className="p-2.5">Decoded Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950">
                      {parsedUrl.params.map(([k, v], i) => (
                        <tr key={i}>
                          <td className="p-2.5 font-mono text-violet-500 font-semibold">{k}</td>
                          <td className="p-2.5 font-mono text-slate-700 dark:text-slate-300">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
