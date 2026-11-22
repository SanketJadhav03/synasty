'use client';

import React, { useEffect, useState } from 'react';

interface AdBannerProps {
  placement: 'header' | 'sidebar' | 'in-content' | 'footer';
  className?: string;
}

export function AdBanner({ placement, className = '' }: AdBannerProps) {
  const [adConfig, setAdConfig] = useState<{
    isEnabled: boolean;
    adClient: string;
    adSlot: string;
    customHtml?: string;
  } | null>(null);

  useEffect(() => {
    // In production, fetch config from API or settings
    // Default: placeholder or hidden if not enabled
    fetch('/api/admin/ads')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.ads) {
          const found = data.ads.find((a: any) => a.placement === placement);
          if (found) setAdConfig(found);
        }
      })
      .catch(() => {});
  }, [placement]);

  // If explicitly disabled or not configured, return null to avoid blank unsightly spaces
  if (!adConfig || !adConfig.isEnabled) {
    return null;
  }

  return (
    <div
      className={`my-6 mx-auto overflow-hidden rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 text-center ${className}`}
      data-ad-placement={placement}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
        Advertisement
      </div>

      {adConfig.customHtml ? (
        <div dangerouslySetInnerHTML={{ __html: adConfig.customHtml }} />
      ) : adConfig.adClient && adConfig.adSlot ? (
        <div className="min-h-[90px] flex items-center justify-center text-xs text-slate-400">
          {/* Google AdSense ins container */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adConfig.adClient}
            data-ad-slot={adConfig.adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        <div className="min-h-[80px] flex items-center justify-center text-xs text-slate-400">
          Sponsored Space
        </div>
      )}
    </div>
  );
}

export default AdBanner;
