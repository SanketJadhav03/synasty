'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, PlusCircle, Trash2, ExternalLink, X, RefreshCw, Eye } from 'lucide-react';
import { INITIAL_BLOGS } from '@/lib/initialData';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const [form, setForm] = useState({
    title: '',
    category: 'Technology',
    excerpt: '',
    content: '## Section Title\n\nWrite your informative article content here using standard markdown.',
    coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    tags: 'Technology, Next.js, Architecture',
    authorName: 'Synasty Editorial',
    authorRole: 'Technology Editor',
    status: 'published' as 'draft' | 'published' | 'scheduled',
    seoTitle: '',
    seoDescription: '',
    isFeatured: false,
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blogs');
      if (res.ok) {
        const json = await res.json();
        setBlogs(json.blogs || INITIAL_BLOGS);
      }
    } catch {
      setBlogs(INITIAL_BLOGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()),
      };

      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchBlogs();
        setForm({
          title: '',
          category: 'Technology',
          excerpt: '',
          content: '',
          coverImageUrl: '',
          tags: '',
          authorName: 'Synasty Editorial',
          authorRole: 'Technology Editor',
          status: 'published',
          seoTitle: '',
          seoDescription: '',
          isFeatured: false,
        });
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create article');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBlogs();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Editorial Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Article Management
          </h1>
          <p className="text-xs text-slate-400">
            Publish, edit, and organize technology articles, film histories, and tutorials.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
        >
          <PlusCircle className="w-4 h-4" /> Create New Article
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {blogs.map((b) => (
                <tr key={b._id || b.slug} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{b.title}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{b.excerpt}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{b.author?.name || 'Synasty Team'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold uppercase">
                      {b.status || 'Published'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <a
                      href={`/blogs/${b.slug}`}
                      target="_blank"
                      className="text-amber-400 hover:text-amber-300"
                    >
                      <ExternalLink className="w-4 h-4 inline" />
                    </a>
                    {b._id && (
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="text-rose-400 hover:text-rose-300 ml-2"
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">Create New Article</h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-bold uppercase mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Modern Full-Stack Web Architecture"
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Programming">Programming</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Tutorials">Tutorials</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Short Excerpt / Teaser</label>
                <textarea
                  rows={2}
                  required
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Summary for cards and social previews..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-bold uppercase">Article Content (Markdown)</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('editor')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        activeTab === 'editor' ? 'bg-amber-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        activeTab === 'preview' ? 'bg-amber-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {activeTab === 'editor' ? (
                  <textarea
                    rows={8}
                    required
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Write in markdown (supports ## Headers, - Lists, etc.)..."
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono"
                  />
                ) : (
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 min-h-[160px] whitespace-pre-wrap">
                    {form.content}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={form.coverImageUrl}
                    onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="React, Nextjs, Tutorial"
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
