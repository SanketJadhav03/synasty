'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, Search, Star, Download, Play, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { CURATED_LEGAL_MOVIES, CuratedMovie } from '@/lib/curatedMovies';
import { AdBanner } from '@/components/AdBanner';

export default function MoviesCatalogPage() {
  const [movies, setMovies] = useState<CuratedMovie[]>(CURATED_LEGAL_MOVIES);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');
  const [loading, setLoading] = useState(false);

  const genres = ['All', 'Horror', 'Mystery', 'Classic', 'Comedy', 'Action', 'Sci-Fi', 'Romance'];
  const years = ['All', '1968', '1963', '1940', '1926', '1922', '1962'];

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('q', search);
        if (selectedGenre !== 'All') queryParams.set('genre', selectedGenre);
        if (selectedYear !== 'All') queryParams.set('year', selectedYear);
        queryParams.set('sort', sortBy);

        const res = await fetch(`/api/movies?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.movies && data.movies.length > 0) {
            setMovies(data.movies);
          } else {
            setMovies([]);
          }
        }
      } catch (e) {
        console.error('Fetch movies error:', e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchMovies, 300);
    return () => clearTimeout(timer);
  }, [search, selectedGenre, selectedYear, selectedRating, sortBy]);

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-4">
          <Film className="w-4 h-4" />
          Synasty Movie Discovery
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore Cinema &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500">
            Authorized Legal Content
          </span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Discover cinema history, verified public domain film archives, and authorized distributor streaming links. Zero pirated hosting, zero copyright violations.
        </p>

        {/* Legal Compliance Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>100% Legal & Authorized: Download links provided strictly for verified public domain content.</span>
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
            placeholder="Search movie titles, directors, or descriptions..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-md text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          {/* Genre Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedGenre === g
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Year & Sort Controls */}
          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option value="All">All Years</option>
              {years.filter((y) => y !== 'All').map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option value="popular">Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Release Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-400 animate-pulse">
          Loading movie catalog...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {movies.map((movie) => {
            const hasDownload = movie.sources?.some((s) => s.sourceType === 'download');
            return (
              <Link
                key={movie.slug}
                href={`/movies/${movie.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-rose-500/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Poster Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{movie.rating}</span>
                  </div>

                  {/* Legal Source Badges */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                    {hasDownload && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold shadow-sm">
                        <Download className="w-2.5 h-2.5" /> Legal Download
                      </span>
                    )}
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-bold shadow-sm">
                      <Play className="w-2.5 h-2.5" /> Watch Stream
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>{movie.releaseYear}</span>
                      <span>{movie.runtime ? `${movie.runtime}m` : 'Feature'}</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors line-clamp-1">
                      {movie.title}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {movie.overview}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {movie.genres.map((g) => (
                      <span
                        key={g}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {movies.length === 0 && !loading && (
        <div className="py-20 text-center text-slate-500 dark:text-slate-400">
          No movies found matching your selected criteria.
        </div>
      )}

      {/* Ad Banner */}
      <AdBanner placement="in-content" />
    </div>
  );
}
