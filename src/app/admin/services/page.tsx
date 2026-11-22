'use client';

import React, { useState, useEffect } from 'react';
import { Layers, PlusCircle, Search, Trash2, ExternalLink, X, RefreshCw } from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/initialData';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: 'Developer Resources',
    description: '',
    officialUrl: '',
    logoUrl: '',
    pricingType: 'Free' as 'Free' | 'Freemium',
    tags: 'API, Cloud, Free Tier',
    isFeatured: false,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      if (res.ok) {
        const json = await res.json();
        setServices(json.services || INITIAL_SERVICES);
      }
    } catch {
      setServices(INITIAL_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        officialUrl: form.officialUrl,
        logoUrl: form.logoUrl,
        pricingType: form.pricingType,
        tags: form.tags.split(',').map((t) => t.trim()),
        isFeatured: form.isFeatured,
      };

      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchServices();
        setForm({
          name: '',
          category: 'Developer Resources',
          description: '',
          officialUrl: '',
          logoUrl: '',
          pricingType: 'Free',
          tags: '',
          isFeatured: false,
        });
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create service');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this service?')) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (res.ok) fetchServices();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Directory Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Service Management
          </h1>
          <p className="text-xs text-slate-400">
            Manage curated free and freemium digital resources, dev tools, and learning services.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
        >
          <PlusCircle className="w-4 h-4" /> Add New Service
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {services.map((s) => (
                <tr key={s._id || s.slug} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{s.name}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{s.description}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                      {s.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                      {s.pricingType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px]">
                    {s.isFeatured ? '★ Featured' : 'Normal'}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <a
                      href={s.officialUrl}
                      target="_blank"
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      <ExternalLink className="w-4 h-4 inline" />
                    </a>
                    {s._id && (
                      <button
                        onClick={() => handleDelete(s._id)}
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
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-4">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">Add New Service</h3>

            <form onSubmit={handleCreate} className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Supabase"
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  >
                    <option value="Developer Resources">Developer Resources</option>
                    <option value="Free AI Resources">Free AI Resources</option>
                    <option value="Educational Resources">Educational Resources</option>
                    <option value="Productivity Services">Productivity Services</option>
                    <option value="Design Resources">Design Resources</option>
                    <option value="Free Hosting Resources">Free Hosting Resources</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Pricing Model</label>
                  <select
                    value={form.pricingType}
                    onChange={(e) => setForm({ ...form, pricingType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  >
                    <option value="Free">100% Free</option>
                    <option value="Freemium">Freemium Tier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Official Website URL</label>
                <input
                  type="url"
                  required
                  value={form.officialUrl}
                  onChange={(e) => setForm({ ...form, officialUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What generous free offerings does this service provide?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="Database, SQL, Serverless"
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
