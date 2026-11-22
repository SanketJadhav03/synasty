'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Clock, Calendar, ArrowRight, User } from 'lucide-react';
import { INITIAL_BLOGS } from '@/lib/initialData';
import { AdBanner } from '@/components/AdBanner';

export default function BlogsListingPage() {
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = [
    'All',
    'Technology',
    'Artificial Intelligence',
    'Web Development',
    'Programming',
    'Entertainment',
    'Tutorials',
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('q', search);
        if (selectedCategory !== 'All') queryParams.set('category', selectedCategory);

        const res = await fetch(`/api/blogs?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.blogs) setBlogs(data.blogs);
        }
      } catch (e) {
        console.error('Fetch blogs error:', e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchBlogs, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  const featuredBlog = blogs.find((b) => b.isFeatured) || blogs[0];
  const regularBlogs = blogs.filter((b) => b.slug !== featuredBlog?.slug);

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-4">
          <BookOpen className="w-4 h-4" />
          Synasty Editorial & Insights
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Articles, Engineering &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
            Digital Perspectives
          </span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          In-depth tutorials, full-stack architecture discussions, film history, and privacy breakdowns authored by the Synasty team.
        </p>
      </div>

      {/* Featured Hero Article */}
      {featuredBlog && !search && selectedCategory === 'All' && (
        <div className="mb-12">
          <Link
            href={`/blogs/${featuredBlog.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 sm:p-8 hover:border-amber-500/50 hover:shadow-2xl transition-all duration-300"
          >
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Featured Story
                </span>
                <span className="text-xs text-slate-400">• {featuredBlog.category}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors leading-tight">
                {featuredBlog.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {featuredBlog.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> {featuredBlog.author?.name || 'Synasty Team'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {featuredBlog.readingTime || 4} min read
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md">
              <img
                src={featuredBlog.coverImageUrl}
                alt={featuredBlog.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-10 space-y-4">
        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs by topic, keyword, or title..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-md text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-400 animate-pulse">
          Loading articles...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {(search || selectedCategory !== 'All' ? blogs : regularBlogs).map((blog) => (
            <Link
              key={blog.slug}
              href={`/blogs/${blog.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-amber-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={blog.coverImageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-amber-400 border border-white/10 shadow-sm">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {blog.readingTime || 3} min read
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
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
      )}

      {blogs.length === 0 && !loading && (
        <div className="py-20 text-center text-slate-500 dark:text-slate-400">
          No articles match your search criteria.
        </div>
      )}

      {/* Ad Banner */}
      <AdBanner placement="in-content" />
    </div>
  );
}
