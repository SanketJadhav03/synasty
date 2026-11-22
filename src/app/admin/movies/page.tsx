'use client';

import React, { useState, useEffect } from 'react';
import {
  Film,
  PlusCircle,
  Search,
  Trash2,
  CheckCircle2,
  Star,
  ExternalLink,
  Download,
  Play,
  X,
  Edit2,
} from 'lucide-react';
import { CURATED_LEGAL_MOVIES } from '@/lib/curatedMovies';

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Movie Form State
  const [form, setForm] = useState({
    title: '',
    releaseYear: 2026,
    overview: '',
    posterUrl: '',
    backdropUrl: '',
    genres: 'Classic, Drama',
    rating: 8.0,
    trailerUrl: '',
    isFeatured: false,
    sourceName: 'Internet Archive Public Domain',
    sourceType: 'download' as 'stream' | 'download' | 'official',
    sourceUrl: '',
  });

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/movies?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const json = await res.json();
        setMovies(json.movies || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [search]);

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        releaseYear: Number(form.releaseYear),
        overview: form.overview,
        posterUrl: form.posterUrl,
        backdropUrl: form.backdropUrl,
        genres: form.genres.split(',').map((g) => g.trim()),
        rating: Number(form.rating),
        trailerUrl: form.trailerUrl,
        isFeatured: form.isFeatured,
        sources: form.sourceUrl
          ? [
              {
                sourceName: form.sourceName,
                sourceType: form.sourceType,
                url: form.sourceUrl,
                quality: '1080p',
                isLegalAuthorizationVerified: true,
                licenseNote: 'Public Domain / Free Rights-Holder Authorized Distribution',
              },
            ]
          : [],
      };

      const res = await fetch('/api/admin/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchMovies();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create movie');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this movie listing?')) return;
    try {
      const res = await fetch(`/api/admin/movies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMovies();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/admin/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !current }),
      });
      fetchMovies();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
            Catalog Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Movie Management
          </h1>
          <p className="text-xs text-slate-400">
            Manage movie listings, verified external streams, and legal public-domain download links.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Add New Movie
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or genre..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Movies Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Movie</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Genres</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {movies.map((m) => (
                <tr key={m._id || m.slug} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={m.posterUrl}
                      alt={m.title}
                      className="w-8 h-10 rounded object-cover flex-shrink-0 bg-slate-950"
                    />
                    <div>
                      <div className="font-bold text-white line-clamp-1">{m.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{m.slug}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono">{m.releaseYear}</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">★ {m.rating}</td>
                  <td className="py-3 px-4">{m.genres?.join(', ')}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => m._id && handleToggleFeatured(m._id, m.isFeatured)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        m.isFeatured
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.isFeatured ? 'Featured' : 'Standard'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <a
                      href={`/movies/${m.slug}`}
                      target="_blank"
                      className="text-slate-400 hover:text-white"
                      title="View public page"
                    >
                      <ExternalLink className="w-4 h-4 inline" />
                    </a>
                    {m._id && (
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="text-rose-400 hover:text-rose-300 ml-2"
                        title="Delete movie"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Movie Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">Add New Movie</h3>
            <p className="text-xs text-slate-400">
              Enter movie information and legitimate authorized streaming or download links.
            </p>

            <form onSubmit={handleCreateMovie} className="space-y-3 pt-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. A Trip to the Moon"
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Release Year</label>
                  <input
                    type="number"
                    required
                    value={form.releaseYear}
                    onChange={(e) => setForm({ ...form, releaseYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Synopsis / Overview</label>
                <textarea
                  rows={3}
                  required
                  value={form.overview}
                  onChange={(e) => setForm({ ...form, overview: e.target.value })}
                  placeholder="Plot summary..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Poster Image URL</label>
                  <input
                    type="url"
                    required
                    value={form.posterUrl}
                    onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Backdrop Image URL</label>
                  <input
                    type="url"
                    value={form.backdropUrl}
                    onChange={(e) => setForm({ ...form, backdropUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Genres (comma-separated)</label>
                  <input
                    type="text"
                    value={form.genres}
                    onChange={(e) => setForm({ ...form, genres: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Rating (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
              </div>

              {/* Source Link Section */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase text-emerald-400 block">
                  Verified Legal Source Link
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="url"
                      value={form.sourceUrl}
                      onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                      placeholder="e.g. https://archive.org/download/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                    />
                  </div>
                  <div>
                    <select
                      value={form.sourceType}
                      onChange={(e) => setForm({ ...form, sourceType: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                    >
                      <option value="download">Legal Download</option>
                      <option value="stream">Authorized Stream</option>
                      <option value="official">Official Distributor</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Add Movie to Platform'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
