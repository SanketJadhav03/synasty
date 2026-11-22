'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Check, X, Star, ExternalLink, RefreshCw } from 'lucide-react';
import { INITIAL_TOOLS } from '@/lib/initialData';

export default function AdminToolsPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tools');
      if (res.ok) {
        const json = await res.json();
        setTools(json.tools || INITIAL_TOOLS);
      }
    } catch {
      setTools(INITIAL_TOOLS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleToggle = async (tool: any, field: 'isEnabled' | 'isFeatured') => {
    try {
      const updatedValue = !tool[field];
      setTools((prev) =>
        prev.map((t) => (t.slug === tool.slug ? { ...t, [field]: updatedValue } : t))
      );

      if (tool._id) {
        await fetch('/api/admin/tools', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: tool._id, [field]: updatedValue }),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
            Platform Utilities
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tool Management
          </h1>
          <p className="text-xs text-slate-400">
            Enable, disable, and configure the 13 free online utility applications.
          </p>
        </div>

        <button
          onClick={fetchTools}
          className="p-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tool Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {tools.map((t) => (
                <tr key={t.slug} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{t.name}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{t.description}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">/tools/{t.slug}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggle(t, 'isFeatured')}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.isFeatured
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {t.isFeatured ? 'Featured' : 'Standard'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggle(t, 'isEnabled')}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        t.isEnabled !== false
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {t.isEnabled !== false ? (
                        <>
                          <Check className="w-3 h-3" /> Enabled
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" /> Disabled
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`/tools/${t.slug}`}
                      target="_blank"
                      className="text-violet-400 hover:text-violet-300"
                    >
                      <ExternalLink className="w-4 h-4 inline" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
