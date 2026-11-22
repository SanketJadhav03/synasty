'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Check,
  BookOpen,
  User,
} from 'lucide-react';
import { INITIAL_BLOGS } from '@/lib/initialData';
import { AdBanner } from '@/components/AdBanner';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const found = INITIAL_BLOGS.find((b) => b.slug === slug);
    if (found) {
      setBlog(found);
      setLoading(false);
    } else {
      fetch(`/api/blogs?q=${encodeURIComponent(slug.replace(/-/g, ' '))}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.blogs && data.blogs.length > 0) {
            setBlog(data.blogs[0]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center text-sm text-slate-400 animate-pulse">
        Loading article...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen py-24 text-center px-4 max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Article Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested article could not be located.
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Blogs
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const related = INITIAL_BLOGS.filter((b) => b.slug !== slug).slice(0, 2);

  // Render markdown text to styled elements
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, idx) => {
      if (block.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-8 mb-4 tracking-tight"
          >
            {block.replace('## ', '')}
          </h2>
        );
      }
      if (block.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-3 tracking-tight"
          >
            {block.replace('### ', '')}
          </h3>
        );
      }
      if (block.startsWith('- ') || block.startsWith('1. ')) {
        const items = block.split('\n');
        return (
          <ul key={idx} className="space-y-2 my-4 list-disc list-inside text-slate-700 dark:text-slate-300">
            {items.map((it, i) => (
              <li key={i}>{it.replace(/^[-*]|\d+\.\s*/, '')}</li>
            ))}
          </ul>
        );
      }
      return (
        <p
          key={idx}
          className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed my-4"
        >
          {block}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-amber-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Articles
        </Link>
      </div>

      {/* Article Header */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
            {blog.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {blog.readingTime || 4} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {blog.title}
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Author Bio Row & Share */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                SY
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {blog.author?.name || 'Synasty Editorial'}
              </div>
              <div className="text-xs text-slate-400">
                {blog.author?.role || 'Core Team'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 flex items-center gap-1.5 shadow-sm transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Copied Link' : 'Share Article'}
            </button>
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      {blog.coverImageUrl && (
        <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 mb-10 bg-slate-950">
          <img
            src={blog.coverImageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Body */}
      <article className="prose dark:prose-invert max-w-none mb-12">
        {renderContent(blog.content)}
      </article>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-200 dark:border-slate-800 mb-10">
          <span className="text-xs font-bold text-slate-400">Tags:</span>
          {blog.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* In-content Advertisement banner */}
      <AdBanner placement="in-content" />

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Continue Reading
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/blogs/${item.slug}`}
                className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-amber-500/50 hover:shadow-lg transition-all"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block mb-1">
                  {item.category}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {item.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
