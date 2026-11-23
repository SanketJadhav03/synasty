'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Search,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/initialData';
import { AdBanner } from '@/components/AdBanner';

export default function ServicesDirectoryPage() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPricing, setSelectedPricing] = useState('All');
  const [loading, setLoading] = useState(false);

  // In-memory cache for instant 0ms category switching without buffering
  const cacheRef = useRef<Record<string, typeof INITIAL_SERVICES>>({
    'All_All_': INITIAL_SERVICES,
  });

  // Submit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    title: '',
    url: '',
    details: '',
  });

  const categories = [
    'All',
    'Developer Resources',
    'Free AI Resources',
    'Educational Resources',
    'Productivity Services',
    'Design Resources',
    'Free Hosting Resources',
  ];

  useEffect(() => {
    const cacheKey = `${selectedCategory}_${selectedPricing}_${search.trim().toLowerCase()}`;

    // If cached, switch instantly with ZERO buffering or layout disturbance
    if (cacheRef.current[cacheKey]) {
      setServices(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('q', search);
        if (selectedCategory !== 'All') queryParams.set('category', selectedCategory);
        if (selectedPricing !== 'All') queryParams.set('pricing', selectedPricing);

        const res = await fetch(`/api/services?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          const items = data.services || [];
          cacheRef.current[cacheKey] = items;
          setServices(items);
        }
      } catch (e) {
        console.error('Fetch services error:', e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchServices, 150);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedPricing]);

  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'service',
          submitterName: form.name,
          submitterEmail: form.email,
          title: form.title,
          url: form.url,
          details: form.details,
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setForm({ name: '', email: '', title: '', url: '', details: '' });
        setTimeout(() => {
          setSubmitSuccess(false);
          setModalOpen(false);
        }, 3000);
      }
    } catch (e) {
      console.error('Submit service error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* High-Protein JSON-LD Structured Data for Services Directory */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Synasty Curated Free Digital Services Directory',
            description: 'Curated developer infrastructure, free AI tiers, student perks, and productivity software without hidden costs.',
            url: 'https://synasty.xyz/services',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: services.slice(0, 10).map((svc, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                name: svc.name,
                description: svc.description,
                url: svc.officialUrl,
              })),
            },
          }),
        }}
      />

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4 shadow-sm">
          <Layers className="w-4 h-4 text-emerald-500" />
          Synasty Free Services Directory
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Curated Free & Freemium{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
            Digital Services
          </span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Hand-picked developer infrastructure, free AI tiers, student perks, and productivity software that empower creators without hidden costs.
        </p>

        {/* Submit Resource CTA */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Suggest a Free Resource
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-10 space-y-4">
        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services by name, keywords, or tags..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-md text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Modern Out-of-the-Box Category & Pricing Selection Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 shadow-sm backdrop-blur-md">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 scale-[1.02]'
                      : 'bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Pricing Selector */}
          <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Pricing:</span>
            {['All', 'Free', 'Freemium'].map((p) => {
              const isSelected = selectedPricing === p;
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPricing(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services Grid with YouTube-style Future Buffering Shimmer Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-4"
            >
              <div>
                {/* Logo box & Badge skeleton */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl shimmer-box" />
                  <div className="w-16 h-6 rounded-full shimmer-box" />
                </div>
                {/* Category label skeleton */}
                <div className="w-24 h-3 rounded shimmer-box mb-2" />
                {/* Title line skeleton */}
                <div className="w-44 h-5 rounded shimmer-box mb-3" />
                {/* Description lines skeleton */}
                <div className="space-y-2">
                  <div className="w-full h-3 rounded shimmer-box" />
                  <div className="w-4/5 h-3 rounded shimmer-box" />
                </div>
                {/* Tags skeleton */}
                <div className="flex gap-1.5 mt-4">
                  <div className="w-12 h-4 rounded shimmer-box" />
                  <div className="w-16 h-4 rounded shimmer-box" />
                </div>
              </div>

              {/* Action Button Skeleton */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-full h-9 rounded-xl shimmer-box" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((svc) => (
            <div
              key={svc.slug}
              className="flex flex-col justify-between p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 p-2 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
                    {svc.logoUrl ? (
                      <img src={svc.logoUrl} alt={svc.name} className="w-full h-full object-contain" />
                    ) : (
                      <Layers className="w-6 h-6 text-emerald-500" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      svc.pricingType === 'Free'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
                    }`}
                  >
                    {svc.pricingType}
                  </span>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 block mb-1">
                  {svc.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {svc.name}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {svc.description}
                </p>

                {/* Tags */}
                {svc.tags && svc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {svc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={svc.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Visit Official Website
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {services.length === 0 && !loading && (
        <div className="py-20 text-center text-slate-500 dark:text-slate-400">
          No services match your selected filters.
        </div>
      )}

      {/* Ad Banner */}
      <AdBanner placement="in-content" />

      {/* Submit Resource Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-4">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Suggest a Free Digital Resource
            </h3>
            <p className="text-xs text-slate-500">
              Know of an exceptional developer API, free AI playground, or learning resource? Submit it for inclusion in the Synasty directory.
            </p>

            {submitSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                Thank you! Your suggestion has been queued for editorial review.
              </div>
            ) : (
              <form onSubmit={handleSubmitService} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Resource / Service Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Supabase Free Tier"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Official Website URL
                  </label>
                  <input
                    type="url"
                    required
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Why is this resource useful?
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    placeholder="Describe what the free tier offers and who benefits..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Submitting...' : 'Submit Resource'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
