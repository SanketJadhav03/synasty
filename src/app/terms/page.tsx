import React from 'react';

export const metadata = {
  title: 'Terms and Conditions',
  description: 'Synasty terms of service, platform rules, and intellectual property conditions.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-violet-500">Legal Documentation</span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs text-slate-400">Effective Date: January 1, 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Synasty platform at <a href="https://synasty.xyz/" className="text-violet-500 underline">https://synasty.xyz/</a>, you agree to comply with and be legally bound by these Terms and Conditions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Acceptable Use of Utilities</h2>
          <p>
            Synasty Tools are provided for legitimate developer, personal, and educational use. You agree not to abuse or automate harmful requests against the URL shortener, contact endpoints, or administrative APIs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Movie Discovery & Legal Compliance</h2>
          <p>
            Synasty Movies operates strictly as an informational discovery and cataloging platform. Download links are provided only for content verified to be in the public domain or authorized by rights holders. Synasty strictly prohibits the uploading, hosting, or linking of unauthorized copyrighted media.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Disclaimer of Warranties</h2>
          <p>
            All tools, services, articles, and content on Synasty are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, either express or implied.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable international web and digital platform standards.
          </p>
        </section>
      </div>
    </div>
  );
}
