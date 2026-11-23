'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SynastyLogo } from './SynastyLogo';
import { ThemeToggle } from './ThemeToggle';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#070a12] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & Newsletter Column (Desktop: spans 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <SynastyLogo size="md" showTagline={true} />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Synasty unifies legal cinema discovery, powerful free online developer utilities, curated digital services, and insightful technology tutorials in one modern destination.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-1 max-w-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
                Stay updated with Synasty
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  Thank you for subscribing to Synasty updates!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email for product updates"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links Columns: 3 columns on desktop, compact 2-column or 3-column grid on mobile */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Platform Navigation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
                Platform
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/movies" className="hover:text-rose-500 transition-colors">
                    Synasty Movies
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="hover:text-violet-500 transition-colors">
                    Synasty Tools
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-emerald-500 transition-colors">
                    Synasty Services
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="hover:text-amber-500 transition-colors">
                    Synasty Blogs
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-cyan-500 transition-colors">
                    About Synasty
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular Developer Utilities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
                Popular Tools
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/tools/qr-generator" className="hover:text-violet-500 transition-colors">
                    QR Generator
                  </Link>
                </li>
                <li>
                  <Link href="/tools/json-formatter" className="hover:text-violet-500 transition-colors">
                    JSON Formatter
                  </Link>
                </li>
                <li>
                  <Link href="/tools/jwt-decoder" className="hover:text-violet-500 transition-colors">
                    JWT Decoder
                  </Link>
                </li>
                <li>
                  <Link href="/tools/password-generator" className="hover:text-violet-500 transition-colors">
                    Password Generator
                  </Link>
                </li>
                <li>
                  <Link href="/tools/hash-generator" className="hover:text-violet-500 transition-colors">
                    Hash Generator
                  </Link>
                </li>
                <li>
                  <Link href="/tools/url-shortener" className="hover:text-violet-500 transition-colors">
                    URL Shortener
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Policy (No Admin Sign In) */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
                Legal & Policy
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/privacy-policy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Disclaimer
                  </Link>
                </li>
                <li>
                  <Link href="/dmca" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    DMCA Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Compact Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <p>© 2026 Synasty (https://synasty.xyz). All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Crafted with precision for the modern digital web</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
