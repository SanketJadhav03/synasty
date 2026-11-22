'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SynastyLogoProps {
  subBrand?: 'Movies' | 'Tools' | 'Services' | 'Blogs' | 'Admin';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  href?: string;
  className?: string;
}

export function SynastyLogo({
  subBrand,
  size = 'md',
  showTagline = false,
  href = '/',
  className = '',
}: SynastyLogoProps) {
  const sizeMap = {
    sm: { imgWidth: 32, imgHeight: 32, textClass: 'text-lg', badgeClass: 'text-[10px] px-1.5 py-0.5' },
    md: { imgWidth: 38, imgHeight: 38, textClass: 'text-xl', badgeClass: 'text-xs px-2 py-0.5' },
    lg: { imgWidth: 48, imgHeight: 48, textClass: 'text-2xl', badgeClass: 'text-xs px-2.5 py-1' },
    xl: { imgWidth: 64, imgHeight: 64, textClass: 'text-3xl', badgeClass: 'text-sm px-3 py-1' },
  };

  const currentSize = sizeMap[size];

  const logoContent = (
    <div className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Official 3D Ribbon Play Mark from Image */}
      <div className="relative overflow-hidden rounded-xl p-0.5 bg-gradient-to-tr from-violet-600 via-pink-500 to-rose-500 shadow-md group-hover:shadow-violet-500/25 transition-all duration-300">
        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center p-1">
          <Image
            src="/images/synasty-logo.png"
            alt="Synasty Logo"
            width={currentSize.imgWidth}
            height={currentSize.imgHeight}
            className="object-contain transform group-hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight ${currentSize.textClass} text-slate-900 dark:text-white flex items-center`}>
            Syn<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">a</span>sty
          </span>

          {subBrand && (
            <span
              className={`rounded-full font-semibold uppercase tracking-wider border ${currentSize.badgeClass} ${
                subBrand === 'Movies'
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  : subBrand === 'Tools'
                  ? 'bg-violet-500/10 text-violet-500 border-violet-500/20'
                  : subBrand === 'Services'
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : subBrand === 'Blogs'
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              }`}
            >
              {subBrand}
            </span>
          )}
        </div>

        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-tight">
            Everything Digital.{' '}
            <span className="text-rose-500 font-semibold">One Destination.</span>
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{logoContent}</Link>;
  }

  return logoContent;
}

export default SynastyLogo;
