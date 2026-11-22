'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SynastyLogo } from './SynastyLogo';
import { ThemeToggle } from './ThemeToggle';
import { Mail, CheckCircle2, Shield, Heart } from 'lucide-react';

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
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <SynastyLogo size="lg" showTagline={true} />
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Synasty is an all-in-one digital platform unifying movie discovery, powerful free online developer utilities, curated digital services, and insightful technology tutorials under one modern destination.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 block mb-2">
                Stay updated with Synasty
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  Thank you for subscribing to Synasty updates!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 rounded-xl transition-all shadow-sm"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Platform Sections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
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

          {/* Popular Free Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Popular Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/tools/qr-generator" className="hover:text-violet-400 transition-colors">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/json-formatter" className="hover:text-violet-400 transition-colors">
                  JSON Formatter & Validator
                </Link>
              </li>
              <li>
                <Link href="/tools/jwt-decoder" className="hover:text-violet-400 transition-colors">
                  JWT Token Decoder
                </Link>
              </li>
              <li>
                <Link href="/tools/password-generator" className="hover:text-violet-400 transition-colors">
                  Password Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/hash-generator" className="hover:text-violet-400 transition-colors">
                  Hash Generator (SHA)
                </Link>
              </li>
              <li>
                <Link href="/tools/url-shortener" className="hover:text-violet-400 transition-colors">
                  Fast URL Shortener
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Legal & Policy
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
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
                  DMCA / Copyright Policy
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Admin Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 Synasty (https://synasty.xyz). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with precision for the open digital web
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
