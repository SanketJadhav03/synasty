'use client';

import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Copy, Check, Hash, RefreshCw } from 'lucide-react';

export default function HashGeneratorPage() {
  const [input, setInput] = useState('Synasty All-in-One Digital Platform');
  const [uppercase, setUppercase] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [hashes, setHashes] = useState<{
    sha256: string;
    sha384: string;
    sha512: string;
    sha1: string;
  }>({
    sha256: '',
    sha384: '',
    sha512: '',
    sha1: '',
  });

  const computeHashes = async () => {
    if (!input) {
      setHashes({ sha256: '', sha384: '', sha512: '', sha1: '' });
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const hashBuffer = async (algo: string) => {
      const buffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(buffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return uppercase ? hashHex.toUpperCase() : hashHex.toLowerCase();
    };

    try {
      const [sha256, sha384, sha512, sha1] = await Promise.all([
        hashBuffer('SHA-256'),
        hashBuffer('SHA-384'),
        hashBuffer('SHA-512'),
        hashBuffer('SHA-1'),
      ]);

      setHashes({ sha256, sha384, sha512, sha1 });
    } catch (e) {
      console.error('Hashing error:', e);
    }
  };

  useEffect(() => {
    computeHashes();
  }, [input, uppercase]);

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const hashList = [
    { label: 'SHA-256', value: hashes.sha256, key: 'sha256', bits: '256-bit hash (Standard)' },
    { label: 'SHA-384', value: hashes.sha384, key: 'sha384', bits: '384-bit hash (High Security)' },
    { label: 'SHA-512', value: hashes.sha512, key: 'sha512', bits: '512-bit hash (Maximum Security)' },
    { label: 'SHA-1', value: hashes.sha1, key: 'sha1', bits: '160-bit hash (Legacy / Checksums)' },
  ];

  return (
    <ToolLayout
      slug="hash-generator"
      title="Cryptographic Hash Generator"
      category="Security & Crypto"
      description="Compute one-way cryptographic message digests (SHA-256, SHA-384, SHA-512) directly in browser memory."
      tips={[
        'Cryptographic hashes are deterministic one-way functions: even a 1-character difference in input produces a completely different digest.',
        'Calculated hardware-accelerated via window.crypto.subtle for instant zero-latency processing.',
      ]}
    >
      <div className="space-y-6">
        {/* Input box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Input String or Plaintext
            </label>
            <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded accent-violet-600"
              />
              <span>Uppercase HEX Output</span>
            </label>
          </div>
          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text to compute cryptographic hashes..."
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {hashList.map((item) => (
            <div
              key={item.key}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white mr-2">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">{item.bits}</span>
                </div>
                <button
                  onClick={() => handleCopy(item.key, item.value)}
                  className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold flex items-center gap-1 hover:text-violet-500 transition-colors"
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
              <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
                {item.value || 'Waiting for input...'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
