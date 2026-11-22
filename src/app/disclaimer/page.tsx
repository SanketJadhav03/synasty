import React from 'react';

export const metadata = {
  title: 'Disclaimer',
  description: 'Synasty legal and content disclaimer regarding external movie links, tools, and third-party services.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Legal Disclosures</span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Disclaimer
        </h1>
        <p className="text-xs text-slate-400">Effective Date: January 1, 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Entertainment & Media Discovery</h2>
          <p>
            Synasty (<a href="https://synasty.xyz/" className="text-rose-500 underline">https://synasty.xyz/</a>) does <strong>not</strong> host, encode, stream, upload, or store video files on our servers. All movie information, metadata, posters, and trailers are retrieved via legitimate free APIs (including TMDB) or curated public domain cultural preservation repositories (such as the Internet Archive).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Download Links Legality</h2>
          <p>
            Download links displayed on Synasty are provided exclusively for films that have entered the public domain (due to expired copyright terms, failure to renew under historical laws, or defect of notice) or are explicitly distributed freely by rights holders. Synasty strictly opposes piracy and will never knowingly facilitate access to unauthorized copyrighted works.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Third-Party Websites & Tools</h2>
          <p>
            Synasty Services directory provides links to third-party software, cloud platforms, and AI resources. We do not operate or endorse third-party platforms beyond cataloging their public offerings. Users should review each provider&rsquo;s individual terms and privacy policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Technical Utilities & Cryptography</h2>
          <p>
            Synasty Tools (including JWT Decoder and Hash Generator) provide client-side debugging calculations. Decoding a JWT token reads Base64Url data and does not constitute verification of signature or token issuance validity.
          </p>
        </section>
      </div>
    </div>
  );
}
