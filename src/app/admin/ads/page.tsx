'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Save, ShieldCheck, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';

interface AdSlot {
  placement: 'header' | 'sidebar' | 'in-content' | 'footer';
  isEnabled: boolean;
  adClient: string;
  adSlot: string;
  customHtml?: string;
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<AdSlot[]>([
    { placement: 'header', isEnabled: false, adClient: '', adSlot: '' },
    { placement: 'sidebar', isEnabled: false, adClient: '', adSlot: '' },
    { placement: 'in-content', isEnabled: false, adClient: '', adSlot: '' },
    { placement: 'footer', isEnabled: false, adClient: '', adSlot: '' },
  ]);

  const [savingSlot, setSavingSlot] = useState<string | null>(null);
  const [successSlot, setSuccessSlot] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/ads')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.ads && data.ads.length > 0) {
          const merged = ['header', 'sidebar', 'in-content', 'footer'].map((p) => {
            const found = data.ads.find((a: any) => a.placement === p);
            return (
              found || {
                placement: p,
                isEnabled: false,
                adClient: '',
                adSlot: '',
              }
            );
          });
          setAds(merged as any);
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdate = (placement: string, field: string, val: any) => {
    setAds((prev) =>
      prev.map((a) => (a.placement === placement ? { ...a, [field]: val } : a))
    );
  };

  const handleSaveSlot = async (slot: AdSlot) => {
    setSavingSlot(slot.placement);
    setSuccessSlot(null);

    try {
      const res = await fetch('/api/admin/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slot),
      });

      if (res.ok) {
        setSuccessSlot(slot.placement);
        setTimeout(() => setSuccessSlot(null), 3000);
      }
    } catch (e: any) {
      alert(`Error saving ad slot: ${e.message}`);
    } finally {
      setSavingSlot(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Monetization & Compliance
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Google AdSense & Ad Placements
        </h1>
        <p className="text-xs text-slate-400">
          Configure Google AdSense publisher IDs and independently toggle advertising placements.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
        <strong>AdSense Compliance Policy:</strong> Per Google Publisher Policies, advertisements must never appear on empty pages, misleading download buttons, or 404 error views. Synasty components automatically enforce these safety boundaries.
      </div>

      <div className="space-y-4">
        {ads.map((slot) => (
          <div
            key={slot.placement}
            className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Placement Slot
                </span>
                <h3 className="text-base font-bold text-white capitalize">
                  {slot.placement.replace('-', ' ')} Advertisement
                </h3>
              </div>

              <button
                type="button"
                onClick={() => handleUpdate(slot.placement, 'isEnabled', !slot.isEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  slot.isEnabled
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {slot.isEnabled ? 'Slot Active (Enabled)' : 'Slot Disabled'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">
                  Ad Client (e.g. ca-pub-XXXXXXXXXXXXXXXX)
                </label>
                <input
                  type="text"
                  value={slot.adClient}
                  onChange={(e) => handleUpdate(slot.placement, 'adClient', e.target.value)}
                  placeholder="ca-pub-1234567890123456"
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">
                  Ad Slot ID (Numeric)
                </label>
                <input
                  type="text"
                  value={slot.adSlot}
                  onChange={(e) => handleUpdate(slot.placement, 'adSlot', e.target.value)}
                  placeholder="1234567890"
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-500">
                Placement: <code className="text-violet-400">data-ad-placement=&quot;{slot.placement}&quot;</code>
              </span>

              <div className="flex items-center gap-2">
                {successSlot === slot.placement && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleSaveSlot(slot)}
                  disabled={savingSlot === slot.placement}
                  className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" /> Save Slot
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
