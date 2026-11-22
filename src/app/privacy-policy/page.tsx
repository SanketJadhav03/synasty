import React from 'react';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Synasty Privacy Policy detailing our client-side processing, data protection, and cookie compliance.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-violet-500">Legal Documentation</span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">Effective Date: January 1, 2026 • Last Updated: 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Introduction</h2>
          <p>
            Synasty (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), operating the digital platform at <a href="https://synasty.xyz/" className="text-violet-500 underline">https://synasty.xyz/</a>, values your privacy. This Privacy Policy details how we handle user information across Synasty Movies, Synasty Tools, Synasty Services, and Synasty Blogs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. In-Browser / Client-Side Processing</h2>
          <p>
            A cornerstone of Synasty Tools (such as our Hash Generator, Password Generator, QR Code Scanner, JSON Formatter, and JWT Decoder) is client-side execution. Sensitive inputs, generated passwords, private keys, and formatted payloads are processed directly inside your local browser memory using modern Web APIs. <strong>We do not transmit, log, or store your tool inputs on our servers.</strong>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Inbound Submissions & Contact:</strong> When you voluntarily submit a message or resource suggestion, we record your provided name, email address, and message content to fulfill your inquiry.</li>
            <li><strong>Short URL Mappings:</strong> When utilizing the Synasty URL shortener, we record the destination URL and a random short code identifier in MongoDB Atlas.</li>
            <li><strong>Server Logs:</strong> Standard HTTP request logs including IP address, user-agent, and request timestamp are recorded temporarily for rate-limiting, DDoS prevention, and security monitoring.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Cookies and Advertising</h2>
          <p>
            We may utilize essential first-party cookies for administrator authentication sessions. Third-party advertising vendors (such as Google AdSense) may utilize cookies and web beacons to serve ads based on your prior visits to this or other websites. You may opt out of personalized advertising by visiting Google Ads Settings or www.aboutads.info.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. External Links</h2>
          <p>
            Synasty indexes verified third-party links, including official streaming distributors and public-domain film archives (e.g. Internet Archive). We do not control or assume responsibility for the privacy practices of external websites.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. Contact for Privacy Inquiries</h2>
          <p>
            If you have questions regarding this Privacy Policy or your data, please contact our Data Protection Officer at: <a href="mailto:privacy@synasty.xyz" className="text-violet-500 underline">privacy@synasty.xyz</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
