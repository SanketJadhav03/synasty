'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Film,
  Wrench,
  Layers,
  BookOpen,
  Users,
  Inbox,
  Link2,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    metrics: {
      totalMovies: number;
      totalTools: number;
      totalServices: number;
      totalBlogs: number;
      totalUsers: number;
      pendingSubmissions: number;
      unreadMessages: number;
      totalShortUrls: number;
    };
    recentActivity: any[];
    systemStatus: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Fetch dashboard error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const metricsCards = [
    {
      label: 'Movies Indexed',
      value: data?.metrics.totalMovies ?? 0,
      icon: Film,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10 border-rose-500/20',
      href: '/admin/movies',
    },
    {
      label: 'Active Tools',
      value: data?.metrics.totalTools ?? 13,
      icon: Wrench,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10 border-violet-500/20',
      href: '/admin/tools',
    },
    {
      label: 'Curated Services',
      value: data?.metrics.totalServices ?? 0,
      icon: Layers,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      href: '/admin/services',
    },
    {
      label: 'Articles & Blogs',
      value: data?.metrics.totalBlogs ?? 0,
      icon: BookOpen,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
      href: '/admin/blogs',
    },
    {
      label: 'Registered Users',
      value: data?.metrics.totalUsers ?? 1,
      icon: Users,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      href: '/admin/users',
    },
    {
      label: 'Pending Submissions',
      value: data?.metrics.pendingSubmissions ?? 0,
      icon: Inbox,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10 border-pink-500/20',
      href: '/admin/submissions',
    },
    {
      label: 'Unread Messages',
      value: data?.metrics.unreadMessages ?? 0,
      icon: Inbox,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10 border-orange-500/20',
      href: '/admin/submissions',
    },
    {
      label: 'Short Links Generated',
      value: data?.metrics.totalShortUrls ?? 0,
      icon: Link2,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      href: '/admin/tools',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
            Synasty Administrative Suite
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Platform Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time analytics and management for Synasty all-in-one ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {data?.systemStatus || 'Online & Synchronized'}
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh dashboard metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsCards.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl border ${card.bg}`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {card.value}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions Bar */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Fast Operations
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/movies"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Add Movie
          </Link>
          <Link
            href="/admin/blogs"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Write Article
          </Link>
          <Link
            href="/admin/services"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Add Service
          </Link>
          <Link
            href="/admin/ads"
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all"
          >
            Configure AdSense
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all"
          >
            API & Settings
          </Link>
        </div>
      </div>

      {/* Recent Activity Logs Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Activity className="w-4 h-4 text-violet-400" /> Recent Administrative Activity
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time DB logs</span>
        </div>

        {data?.recentActivity && data.recentActivity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {data.recentActivity.map((act, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-semibold text-violet-400">{act.action}</td>
                    <td className="py-2.5 px-3 truncate max-w-xs">{act.details}</td>
                    <td className="py-2.5 px-3 text-slate-400">{act.userEmail}</td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {new Date(act.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            No recent activity logged yet. Operations will appear here automatically.
          </div>
        )}
      </div>
    </div>
  );
}
