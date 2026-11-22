'use client';

import React, { useState, useEffect } from 'react';
import { Inbox, Mail, CheckCircle, XCircle, Trash2, ExternalLink, RefreshCw } from 'lucide-react';

export default function AdminSubmissionsPage() {
  const [tab, setTab] = useState<'messages' | 'submissions'>('messages');
  const [messages, setMessages] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/submissions');
      if (res.ok) {
        const json = await res.json();
        setMessages(json.messages || []);
        setSubmissions(json.submissions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpdateStatus = async (targetType: 'message' | 'submission', id: string, status: string) => {
    try {
      await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, id, status }),
      });
      fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (targetType: 'message' | 'submission', id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await fetch(`/api/admin/submissions?targetType=${targetType}&id=${id}`, {
        method: 'DELETE',
      });
      fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
            Inbox & Moderation
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Submissions & Inbound Messages
          </h1>
          <p className="text-xs text-slate-400">
            Review user feedback, contact form messages, and community resource submissions.
          </p>
        </div>

        <button
          onClick={fetchItems}
          className="p-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit">
        <button
          onClick={() => setTab('messages')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            tab === 'messages' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" /> Contact Messages ({messages.length})
        </button>
        <button
          onClick={() => setTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            tab === 'submissions' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Inbox className="w-4 h-4" /> Resource Submissions ({submissions.length})
        </button>
      </div>

      {/* Messages Table */}
      {tab === 'messages' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {messages.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{m.email}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{m.subject}</td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{m.message}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          m.status === 'unread'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : m.status === 'replied'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() =>
                          handleUpdateStatus('message', m._id, m.status === 'unread' ? 'read' : 'replied')
                        }
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px]"
                      >
                        Mark {m.status === 'unread' ? 'Read' : 'Replied'}
                      </button>
                      <button
                        onClick={() => handleDelete('message', m._id)}
                        className="text-rose-400 hover:text-rose-300 ml-2"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {messages.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              No contact messages received yet.
            </div>
          )}
        </div>
      )}

      {/* Submissions Table */}
      {tab === 'submissions' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">URL</th>
                  <th className="py-3 px-4">Submitter</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-violet-400 text-[10px] uppercase font-mono">
                        {sub.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{sub.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{sub.details}</div>
                    </td>
                    <td className="py-3 px-4">
                      {sub.url ? (
                        <a
                          href={sub.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-violet-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3" /> Link
                        </a>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      <div>{sub.submitterName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{sub.submitterEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          sub.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : sub.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleUpdateStatus('submission', sub._id, 'approved')}
                        className="p-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus('submission', sub._id, 'rejected')}
                        className="p-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('submission', sub._id)}
                        className="text-slate-500 hover:text-rose-400 ml-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {submissions.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              No user submissions in queue.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
