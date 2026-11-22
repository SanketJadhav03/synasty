'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Film, Wrench, Layers, BookOpen, ArrowRight } from 'lucide-react';
import { INITIAL_TOOLS } from '@/lib/initialData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    movies: any[];
    tools: any[];
    services: any[];
    blogs: any[];
  }>({
    movies: [],
    tools: [],
    services: [],
    blogs: [],
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults({
        movies: [],
        tools: INITIAL_TOOLS.slice(0, 4),
        services: [],
        blogs: [],
      });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const q = query.toLowerCase().trim();

        // Search tools locally
        const matchedTools = INITIAL_TOOLS.filter(
          (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
        );

        // Search movies
        const movieRes = await fetch(`/api/movies?q=${encodeURIComponent(query)}`);
        const movieData = await movieRes.json();

        // Search services
        const serviceRes = await fetch(`/api/services?q=${encodeURIComponent(query)}`);
        const serviceData = await serviceRes.json();

        // Search blogs
        const blogRes = await fetch(`/api/blogs?q=${encodeURIComponent(query)}`);
        const blogData = await blogRes.json();

        setSearchResults({
          movies: (movieData.movies || []).slice(0, 4),
          tools: matchedTools.slice(0, 4),
          services: (serviceData.services || []).slice(0, 4),
          blogs: (blogData.blogs || []).slice(0, 4),
        });
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  const hasResults =
    searchResults.movies.length > 0 ||
    searchResults.tools.length > 0 ||
    searchResults.services.length > 0 ||
    searchResults.blogs.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, free tools, services, tutorials..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-8 text-center text-sm text-slate-400 animate-pulse">
              Searching Synasty platform...
            </div>
          )}

          {!loading && !hasResults && query && (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No matching results found for &ldquo;{query}&rdquo;.
            </div>
          )}

          {/* Tools Results */}
          {searchResults.tools.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-500 mb-2">
                <Wrench className="w-3.5 h-3.5" /> Synasty Tools
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {searchResults.tools.map((tool) => (
                  <button
                    key={tool.slug}
                    onClick={() => navigateTo(`/tools/${tool.slug}`)}
                    className="flex items-start p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-violet-500/10 dark:hover:bg-violet-500/10 hover:border-violet-500/30 text-left transition-all group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-violet-500">
                        {tool.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {tool.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Movies Results */}
          {searchResults.movies.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-500 mb-2">
                <Film className="w-3.5 h-3.5" /> Synasty Movies
              </div>
              <div className="space-y-1.5">
                {searchResults.movies.map((movie) => (
                  <button
                    key={movie.slug}
                    onClick={() => navigateTo(`/movies/${movie.slug}`)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-10 rounded bg-slate-800 overflow-hidden flex-shrink-0">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {movie.title}
                        </div>
                        <div className="text-xs text-slate-400">
                          {movie.releaseYear} • Rating: ★ {movie.rating}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Services Results */}
          {searchResults.services.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2">
                <Layers className="w-3.5 h-3.5" /> Free Services
              </div>
              <div className="space-y-1.5">
                {searchResults.services.map((svc) => (
                  <button
                    key={svc.slug}
                    onClick={() => navigateTo('/services')}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-left transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {svc.name}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">{svc.description}</div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {svc.pricingType}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Blogs Results */}
          {searchResults.blogs.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
                <BookOpen className="w-3.5 h-3.5" /> Articles & Tutorials
              </div>
              <div className="space-y-1.5">
                {searchResults.blogs.map((blog) => (
                  <button
                    key={blog.slug}
                    onClick={() => navigateTo(`/blogs/${blog.slug}`)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-left transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {blog.title}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">{blog.excerpt}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Quick shortcut: <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">Ctrl+K</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">⌘K</kbd></span>
          <span>Synasty All-in-One Digital Platform</span>
        </div>
      </div>
    </div>
  );
}

export default GlobalSearchModal;
