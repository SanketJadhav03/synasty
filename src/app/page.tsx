'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Film,
  Wrench,
  Layers,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star,
  CheckCircle2,
  ChevronDown,
  Download,
  Play,
  ExternalLink,
  Cpu,
  Lock,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { SynastyLogo } from '@/components/SynastyLogo';
import { INITIAL_TOOLS, INITIAL_SERVICES, INITIAL_BLOGS } from '@/lib/initialData';
import { CURATED_LEGAL_MOVIES } from '@/lib/curatedMovies';
import { AdBanner } from '@/components/AdBanner';

export default function HomePage() {
  const [stats, setStats] = useState({
    movies: CURATED_LEGAL_MOVIES.length,
    tools: INITIAL_TOOLS.length,
    services: INITIAL_SERVICES.length,
    blogs: INITIAL_BLOGS.length,
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setStats({
            movies: data.movies || CURATED_LEGAL_MOVIES.length,
            tools: data.tools || INITIAL_TOOLS.length,
            services: data.services || INITIAL_SERVICES.length,
            blogs: data.blogs || INITIAL_BLOGS.length,
          });
        }
      })
      .catch(() => {});
  }, []);

  const trendingMovies = CURATED_LEGAL_MOVIES.slice(0, 4);
  const popularTools = INITIAL_TOOLS.filter((t) => t.isFeatured).slice(0, 6);
  const featuredServices = INITIAL_SERVICES.filter((s) => s.isFeatured).slice(0, 3);
  const latestBlogs = INITIAL_BLOGS.slice(0, 3);

  const faqs = [
    {
      q: 'What is Synasty?',
      a: 'Synasty is an all-in-one digital platform unifying movie discovery, powerful free online developer utilities, curated digital services, and insightful technology tutorials under one modern destination (https://synasty.xyz/).',
    },
    {
      q: 'Are the movie download links legally compliant?',
      a: 'Yes, 100%. Synasty Movies strictly complies with copyright law and only provides download links for verified public-domain films (via recognized preservation archives like the Internet Archive) or authorized rights-holder sources. We never scrape piracy websites or host copyrighted video files.',
    },
    {
      q: 'Do Synasty Tools upload my private data to a server?',
      a: 'No. Synasty Tools (such as our Hash Generator, Password Generator, QR Scanner, JSON Formatter, and JWT Decoder) execute client-side inside your browser memory using hardware-accelerated Web APIs. Zero tool payloads are logged or stored on our servers.',
    },
    {
      q: 'Are all services in the directory free?',
      a: 'Yes. Every listing in our Services directory clearly distinguishes between 100% Free resources and generous Freemium tiers with no credit card required. We never falsely advertise paid services as free.',
    },
    {
      q: 'Can community members suggest new tools or resources?',
      a: 'Absolutely! Users can submit suggestions via our contact form or the "Suggest a Resource" button in the Services directory, which are reviewed by our moderation team.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen space-y-20 sm:space-y-28 pb-16 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-24 pb-8 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Glow backdrop decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-tr from-violet-600/20 via-pink-600/20 to-rose-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 mb-8 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Next-Generation All-in-One Digital Platform</span>
        </div>

        {/* Official Brand Logo Presentation */}
        <div className="flex justify-center mb-8">
          <SynastyLogo size="xl" showTagline={false} priority />
        </div>

        {/* Main Heading as per Requirement 4B */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Everything Digital.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-500 to-rose-500">
            One Destination.
          </span>
        </h1>

        {/* Supporting text as per Requirement 4B */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Discover movies, explore powerful free tools, access useful services, and learn something new with Synasty.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/movies"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl hover:shadow-rose-500/25 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Film className="w-5 h-5" /> Explore Movies
          </Link>
          <Link
            href="/tools"
            className="px-8 py-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <Wrench className="w-5 h-5 text-violet-500" /> Explore Free Tools
          </Link>
        </div>

        {/* Quick Feature Badges */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Legal Public Domain</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-violet-500" />
            <span>Client-Side Privacy</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Globe className="w-4 h-4 text-cyan-500" />
            <span>Global Edge CDN</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Cpu className="w-4 h-4 text-pink-500" />
            <span>Free Forever Utilities</span>
          </div>
        </div>
      </section>

      {/* 2. REAL DATABASE-DERIVED PLATFORM STATISTICS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-500">
              Live Platform Metrics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Derived Directly from Our Database
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-rose-500 tracking-tight">
                {stats.movies}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                Verified Legal Films
              </div>
              <p className="text-[11px] text-slate-400">Archived & Public Domain</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-violet-500 tracking-tight">
                {stats.tools}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                Free Online Utilities
              </div>
              <p className="text-[11px] text-slate-400">Client-Side In-Browser</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-emerald-500 tracking-tight">
                {stats.services}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                Curated Free Services
              </div>
              <p className="text-[11px] text-slate-400">Dev & AI Resources</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-amber-500 tracking-tight">
                {stats.blogs}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tech Articles & Tutorials
              </div>
              <p className="text-[11px] text-slate-400">Editorial Engineering Guides</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRENDING MOVIES SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">
              <Film className="w-4 h-4" /> Synasty Movies
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trending & Legal Cinema Discovery
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Authorized public domain films and legitimate streaming links.
            </p>
          </div>

          <Link
            href="/movies"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors"
          >
            Browse Full Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingMovies.map((movie) => (
            <Link
              key={movie.slug}
              href={`/movies/${movie.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-rose-500/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{movie.rating}</span>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold shadow-md">
                  <Download className="w-2.5 h-2.5" /> Legal Public Domain
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {movie.releaseYear} • {movie.genres[0]}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors line-clamp-1">
                    {movie.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {movie.overview}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. POPULAR FREE TOOLS SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-500 mb-1">
              <Wrench className="w-4 h-4" /> Synasty Tools
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Popular Online Utilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Fast, privacy-first, client-side tools with instant results.
            </p>
          </div>

          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-500 hover:text-violet-400 transition-colors"
          >
            View All 13 Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-violet-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-500">
                    {tool.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500 font-semibold">
                    Free
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-500 transition-colors">
                  {tool.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-violet-500 group-hover:translate-x-1 transition-transform">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. FEATURED SERVICES DIRECTORY */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1">
              <Layers className="w-4 h-4" /> Synasty Services
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Free & Freemium Resources
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Curated cloud platforms, free AI models, and student perks.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Explore Directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredServices.map((svc) => (
            <div
              key={svc.slug}
              className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 p-2 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <Layers className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {svc.pricingType}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase text-emerald-500 block mb-1">
                  {svc.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{svc.name}</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {svc.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={svc.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-500 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-slate-800 dark:text-slate-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Visit Official Site
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LATEST BLOGS & ARTICLES */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">
              <BookOpen className="w-4 h-4" /> Synasty Blogs
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Latest Technology Articles & Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Deep dives into modern full-stack development, cinema history, and web security.
            </p>
          </div>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors"
          >
            Read All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestBlogs.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blogs/${blog.slug}`}
              className="group overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex flex-col justify-between hover:border-amber-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={blog.coverImageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/70 backdrop-blur-md text-amber-400 border border-white/10">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between text-xs font-semibold text-amber-500 group-hover:translate-x-1 transition-transform">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. WHY SYNASTY SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-14 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-500">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Choose Synasty?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Designed from the ground up for transparency, performance, and legal compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500 w-fit">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Privacy-First Architecture
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculations for tokens, passwords, and hashes execute purely in your local browser runtime. Zero unnecessary telemetry or background tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Strict Intellectual Property Respect
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Synasty Movies explicitly excludes piracy or DRM evasion. We provide direct access exclusively to verified public-domain and rights-holder content.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500 w-fit">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Unified Ecosystem
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No more bouncing across dozens of sketchy utility sites. Synasty consolidates cinema discovery, developer tools, services, and blogs under one roof.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-500">
            Answers & Clarity
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-violet-500 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-violet-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* In-content Advertisement banner */}
      <AdBanner placement="in-content" />
    </div>
  );
}
