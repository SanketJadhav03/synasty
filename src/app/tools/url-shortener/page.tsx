'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Link2, Copy, Check, ExternalLink, ArrowRight, Sparkles, AlertCircle, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

export default function UrlShortenerPage() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortened, setShortened] = useState<{
    shortUrl: string;
    originalUrl: string;
    shortCode: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrModal, setQrModal] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError('Please enter a destination URL.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/tools/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), customCode: customCode.trim() || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to shorten link.');
      } else {
        setShortened(data);
        setUrl('');
        setCustomCode('');
      }
    } catch {
      setError('Network error: Unable to create short link.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (shortened) {
      navigator.clipboard.writeText(shortened.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShowQr = async () => {
    if (shortened) {
      const dataUrl = await QRCode.toDataURL(shortened.shortUrl, { width: 300, margin: 2 });
      setQrModal(dataUrl);
    }
  };

  return (
    <ToolLayout
      slug="url-shortener"
      title="Fast URL Shortener & Link Tracker"
      category="Web Utilities"
      description="Create concise, shareable short URLs with instant server-side 307 redirection, click counting, and abuse protection."
      tips={[
        'All shortened redirect links pass through serverless edge route handlers for sub-50ms redirect response times.',
        'Custom aliases must be between 3 and 16 characters containing letters, numbers, or dashes.',
      ]}
    >
      <div className="space-y-8 max-w-2xl mx-auto">
        {/* Shortener Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Long Destination URL
            </label>
            <div className="relative">
              <Link2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/path/name?params=123"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Custom Alias (Optional)
            </label>
            <div className="flex items-center">
              <span className="px-3 py-3 rounded-l-xl border border-r-0 border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-500 font-mono">
                synasty.xyz/s/
              </span>
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="my-link"
                className="flex-1 px-4 py-3 rounded-r-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-rose-500 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              'Creating Short Link...'
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Shorten URL
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Shortened Result Card */}
        {shortened && (
          <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Short Link Ready
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShowQr}
                  className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  title="Generate QR code for this link"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <a
                  href={shortened.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Visit Link
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-mono text-base font-bold text-violet-500 break-all select-all">
                {shortened.shortUrl}
              </span>
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm ml-2 flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>

            <div className="text-xs text-slate-500 truncate">
              Original: <span className="font-mono text-slate-400">{shortened.originalUrl}</span>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {qrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Short Link QR Code
              </h3>
              <div className="p-3 bg-white rounded-2xl shadow-inner inline-block">
                <img src={qrModal} alt="QR Code" className="w-48 h-48 mx-auto" />
              </div>
              <button
                onClick={() => setQrModal(null)}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
