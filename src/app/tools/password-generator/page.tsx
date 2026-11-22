'use client';

import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Copy, RefreshCw, Check, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);

  const [password, setPassword] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (useUpper) charset += excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) charset += excludeAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += excludeAmbiguous ? '23456789' : '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setPassword('');
      return;
    }

    const array = new Uint32Array(length);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);
    setHistory((prev) => [result, ...prev.slice(0, 4)]);
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous]);

  // Compute password strength score (0 to 100)
  const getStrength = () => {
    if (!password) return { score: 0, label: 'None', color: 'bg-slate-300' };
    let score = 0;
    if (password.length >= 8) score += 20;
    if (password.length >= 14) score += 20;
    if (password.length >= 20) score += 10;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[a-z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;

    if (score < 40) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score < 70) return { score, label: 'Fair', color: 'bg-amber-500' };
    if (score < 90) return { score, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 100, label: 'Extremely Strong', color: 'bg-purple-500' };
  };

  const strength = getStrength();

  const handleCopy = (passToCopy?: string) => {
    const text = passToCopy || password;
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout
      slug="password-generator"
      title="Cryptographically Secure Password Generator"
      category="Security & Crypto"
      description="Generate high-entropy, mathematically unpredictable passwords using hardware-backed Web Crypto RNG."
      tips={[
        'Passphrases of 16 characters or longer containing letters, digits, and symbols require centuries to brute-force.',
        'Never reuse the same master password across multiple digital platforms.',
        'Generated purely inside your browser memory; zero secrets are ever transmitted over the network.',
      ]}
    >
      <div className="space-y-8 max-w-2xl mx-auto">
        {/* Password Display Box */}
        <div className="relative p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
          <div className="font-mono text-xl sm:text-2xl text-white font-bold tracking-wider break-all select-all py-2 min-h-[50px] flex items-center justify-center">
            {password || 'Select options below'}
          </div>

          {/* Strength Bar */}
          <div className="mt-4 flex items-center gap-3 justify-center">
            <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all duration-300`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-300">{strength.label}</span>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => handleCopy()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Password' : 'Copy Password'}
            </button>
            <button
              onClick={generatePassword}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Generate New Password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Configuration Options */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-6">
          {/* Length Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Password Length
              </span>
              <span className="text-sm font-mono font-bold text-violet-500 px-2 py-0.5 rounded bg-violet-500/10">
                {length} chars
              </span>
            </div>
            <input
              type="range"
              min={6}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-violet-600 cursor-pointer"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-violet-500/50">
              <input
                type="checkbox"
                checked={useUpper}
                onChange={(e) => setUseUpper(e.target.checked)}
                className="rounded text-violet-600 accent-violet-600"
              />
              <span className="font-medium text-slate-800 dark:text-slate-200">Uppercase Letters (A-Z)</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-violet-500/50">
              <input
                type="checkbox"
                checked={useLower}
                onChange={(e) => setUseLower(e.target.checked)}
                className="rounded text-violet-600 accent-violet-600"
              />
              <span className="font-medium text-slate-800 dark:text-slate-200">Lowercase Letters (a-z)</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-violet-500/50">
              <input
                type="checkbox"
                checked={useNumbers}
                onChange={(e) => setUseNumbers(e.target.checked)}
                className="rounded text-violet-600 accent-violet-600"
              />
              <span className="font-medium text-slate-800 dark:text-slate-200">Digits (0-9)</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-violet-500/50">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={(e) => setUseSymbols(e.target.checked)}
                className="rounded text-violet-600 accent-violet-600"
              />
              <span className="font-medium text-slate-800 dark:text-slate-200">Symbols (!@#$%)</span>
            </label>
            <label className="sm:col-span-2 flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-violet-500/50">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="rounded text-violet-600 accent-violet-600"
              />
              <span className="font-medium text-slate-800 dark:text-slate-200">
                Exclude Ambiguous Characters (e.g. 0, O, 1, l, I)
              </span>
            </label>
          </div>
        </div>

        {/* Recently Generated History */}
        {history.length > 1 && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Recent In-Session History
            </span>
            <div className="space-y-1.5">
              {history.slice(1).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono"
                >
                  <span className="truncate max-w-md text-slate-700 dark:text-slate-300">{item}</span>
                  <button
                    onClick={() => handleCopy(item)}
                    className="text-violet-500 hover:underline flex items-center gap-1 flex-shrink-0"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
