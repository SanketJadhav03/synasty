import React from 'react';
import { ShieldCheck, Mail, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'DMCA / Copyright Policy',
  description: 'Synasty Digital Millennium Copyright Act (DMCA) and Intellectual Property Complaint Policy.',
};

export default function DmcaPage() {
  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Copyright Compliance</span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          DMCA / Copyright Complaint Policy
        </h1>
        <p className="text-xs text-slate-400">Effective Date: January 1, 2026</p>
      </div>

      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 flex-shrink-0" />
        <span>Synasty strictly respects copyright laws and intellectual property rights worldwide.</span>
      </div>

      <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Policy Overview</h2>
          <p>
            Synasty (<a href="https://synasty.xyz/" className="text-violet-500 underline">https://synasty.xyz/</a>) complies with the Digital Millennium Copyright Act (&ldquo;DMCA&rdquo;) and equivalent international copyright directives. It is our policy to respond expeditiously to legitimate notices of alleged copyright infringement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Our Non-Hosting Architecture</h2>
          <p>
            Please note that Synasty does <strong>not</strong> host, store, or stream audio/video files on our infrastructure. Synasty Movies operates strictly as a discovery directory indexing external metadata and verified public-domain repositories. If you believe an external source link violates copyright, please note that the file is hosted on third-party servers outside of Synasty&rsquo;s control; however, we will promptly remove the hyperlink upon receipt of a valid notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Filing a Takedown Notice</h2>
          <p>
            To file a copyright infringement notification with Synasty, you must provide a written communication that substantially includes:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material on Synasty that is claimed to be infringing (including exact URL).</li>
            <li>Information reasonably sufficient to permit us to contact you (Name, mailing address, telephone number, and email address).</li>
            <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement under penalty of perjury that the information in the notification is accurate, and that you are authorized to act on behalf of the owner.</li>
            <li>A physical or electronic signature of the copyright owner or authorized representative.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Designated Copyright Agent</h2>
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Synasty Copyright Compliance Office</span>
            <span>Attn: DMCA Takedown Department</span>
            <span className="block">Email: <a href="mailto:dmca@synasty.xyz" className="text-rose-500 underline">dmca@synasty.xyz</a></span>
            <span>Domain: https://synasty.xyz/</span>
          </div>
        </section>
      </div>
    </div>
  );
}
