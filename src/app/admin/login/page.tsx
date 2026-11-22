'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SynastyLogo } from '@/components/SynastyLogo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@synasty.xyz');
  const [password, setPassword] = useState('SynastyAdmin2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials.');
      } else {
        router.push('/admin');
      }
    } catch {
      setError('Connection error: Unable to verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeDb = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert('Database initialized! You can now log in with the default administrator credentials.');
      } else {
        alert(`Seed error: ${data.error || 'Failed to seed'}`);
      }
    } catch (e: any) {
      alert(`Error initializing database: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <SynastyLogo size="lg" subBrand="Admin" />
          <h1 className="text-2xl font-black text-white tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access the centralized Synasty platform management suite.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@synasty.xyz"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-rose-500 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                'Verifying Credentials...'
              ) : (
                <>
                  <Shield className="w-4 h-4" /> Secure Admin Login
                </>
              )}
            </button>
          </form>

          {/* Quick Initialize Helper */}
          <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
            <span className="text-[11px] text-slate-500 block">
              Default credentials: <code className="text-violet-400">admin@synasty.xyz</code> / <code className="text-pink-400">SynastyAdmin2026!</code>
            </span>
            <button
              type="button"
              onClick={handleInitializeDb}
              disabled={loading}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Initialize / Seed Database If Empty
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300">
            ← Return to Synasty Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}
