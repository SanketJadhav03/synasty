'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  Clock,
  Globe,
  Play,
  Download,
  ShieldCheck,
  ExternalLink,
  Film,
  AlertTriangle,
} from 'lucide-react';
import { CURATED_LEGAL_MOVIES, CuratedMovie } from '@/lib/curatedMovies';
import { AdBanner } from '@/components/AdBanner';

export default function MovieDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [movie, setMovie] = useState<CuratedMovie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Look up movie from curated list or API
    const found = CURATED_LEGAL_MOVIES.find((m) => m.slug === slug);
    if (found) {
      setMovie(found);
      setLoading(false);
    } else {
      // Fetch from API
      fetch(`/api/movies?q=${encodeURIComponent(slug.replace(/-/g, ' '))}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.movies && data.movies.length > 0) {
            setMovie(data.movies[0]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center text-sm text-slate-400 animate-pulse">
        Loading movie presentation...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen py-24 text-center px-4 max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Movie Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested movie listing could not be found or has been updated.
        </p>
        <Link
          href="/movies"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Movies
        </Link>
      </div>
    );
  }

  const downloadSources = movie.sources?.filter((s) => s.sourceType === 'download') || [];
  const streamSources = movie.sources?.filter((s) => s.sourceType === 'stream' || s.sourceType === 'official') || [];

  return (
    <div className="min-h-screen pb-16">
      {/* Backdrop Header with Gradient Overlay */}
      <div className="relative w-full h-[320px] sm:h-[460px] bg-slate-950 overflow-hidden">
        {movie.backdropUrl ? (
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-center opacity-40 blur-sm scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] dark:from-[#070a12] via-slate-950/70 to-transparent" />

        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-xs font-semibold text-white border border-white/20 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Movies
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 sm:-mt-64 relative z-20 space-y-10">
        {/* Movie Info Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Poster */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative aspect-[2/3] w-64 sm:w-80 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 flex-shrink-0">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10 shadow-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>★ {movie.rating} / 10</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-8 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  {movie.releaseYear}
                </span>
                {movie.runtime ? (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5" /> {movie.runtime} min
                  </span>
                ) : null}
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Globe className="w-3.5 h-3.5" /> {movie.languages?.join(', ')}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {movie.title}
              </h1>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20 text-xs font-semibold"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis Overview */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Synopsis & Background
              </h3>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {movie.overview}
              </p>
            </div>

            {/* Legal Status Notice */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Legally Authorized & Verified Listing
              </div>
              <p className="text-emerald-700 dark:text-emerald-300/80 leading-relaxed">
                Synasty is committed to intellectual property rights. Download links are strictly provided for verified public-domain or distributor-authorized content. No pirated media is stored or hosted on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Legitimate Viewing & Download Sources */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Legitimate Viewing & Download Sources
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Access official distributor streams or legal public-domain downloads directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stream Sources */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-rose-500" /> Authorized Streaming Options
              </h3>
              {streamSources.length > 0 ? (
                streamSources.map((src, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {src.sourceName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 font-semibold">
                        {src.quality}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {src.licenseNote}
                    </p>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-400 pt-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Watch on Authorized Platform
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-400 text-center">
                  No online streams currently registered.
                </div>
              )}
            </div>

            {/* Download Sources */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-500" /> Authorized Free Downloads
              </h3>
              {downloadSources.length > 0 ? (
                downloadSources.map((src, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {src.sourceName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold">
                        {src.quality}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {src.licenseNote}
                    </p>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                    >
                      <Download className="w-4 h-4" /> Download Public Domain Film
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                    <Download className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    No Authorized Download Available
                  </span>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    This movie is protected by copyright. Synasty only provides direct download links for verified public-domain films.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ad Placement */}
        <AdBanner placement="in-content" />
      </div>
    </div>
  );
}
