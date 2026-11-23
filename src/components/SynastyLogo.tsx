'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface SynastyLogoProps {
  subBrand?: 'Movies' | 'Tools' | 'Services' | 'Blogs' | 'Admin';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'wordmark' | 'full' | 'icon';
  showTagline?: boolean;
  href?: string;
  className?: string;
  priority?: boolean;
}

export function SynastyLogo({
  subBrand,
  size = 'md',
  variant,
  showTagline = false,
  href = '/',
  className = '',
  priority = false,
}: SynastyLogoProps) {
  // If variant is not explicitly set: showTagline=true selects 'full', else 'wordmark'
  const resolvedVariant = variant ?? (showTagline ? 'full' : 'wordmark');

  // Height and aspect ratios for each size
  const sizeConfig = {
    sm: {
      heightClass: 'h-6 sm:h-7',
      iconClass: 'w-7 h-7',
      badgeClass: 'text-[10px] px-2 py-0.5 ml-1.5',
    },
    md: {
      heightClass: 'h-8 sm:h-9',
      iconClass: 'w-9 h-9',
      badgeClass: 'text-xs px-2.5 py-0.5 ml-2',
    },
    lg: {
      heightClass: 'h-11 sm:h-12',
      iconClass: 'w-12 h-12',
      badgeClass: 'text-xs px-3 py-1 ml-2.5',
    },
    xl: {
      heightClass: 'h-14 sm:h-16 lg:h-20',
      iconClass: 'w-16 h-16 sm:w-20 sm:h-20',
      badgeClass: 'text-sm px-3.5 py-1 ml-3',
    },
  }[size];

  const subBrandStyles: Record<string, string> = {
    Movies: 'bg-rose-500/10 text-rose-500 border-rose-500/25',
    Tools: 'bg-violet-500/10 text-violet-500 border-violet-500/25',
    Services: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25',
    Blogs: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
    Admin: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
  };

  const renderLogoGraphic = () => {
    if (resolvedVariant === 'icon') {
      return (
        <div className={`relative ${sizeConfig.iconClass} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
          <Image
            src="/images/synasty-icon.png"
            alt="Synasty Brand Mark"
            width={512}
            height={512}
            className="w-full h-full object-contain drop-shadow-md"
            priority={priority}
          />
        </div>
      );
    }

    const isFull = resolvedVariant === 'full';
    const darkSrc = isFull ? '/images/synasty-logo-dark.png' : '/images/synasty-wordmark-dark.png';
    const lightSrc = isFull ? '/images/synasty-logo-light.png' : '/images/synasty-wordmark-light.png';
    const aspectWidth = isFull ? 940 : 929;
    const aspectHeight = isFull ? 325 : 307;

    return (
      <div className="relative inline-flex items-center flex-shrink-0 transition-transform duration-300 group-hover:scale-[1.02]">
        {/* Dark Theme: Official glowing wordmark with white text */}
        <Image
          src={darkSrc}
          alt="Synasty"
          width={aspectWidth}
          height={aspectHeight}
          className={`hidden dark:block ${sizeConfig.heightClass} w-auto object-contain select-none pointer-events-none drop-shadow-sm`}
          priority={priority}
        />
        {/* Light Theme: Official glowing wordmark with dark slate text */}
        <Image
          src={lightSrc}
          alt="Synasty"
          width={aspectWidth}
          height={aspectHeight}
          className={`block dark:hidden ${sizeConfig.heightClass} w-auto object-contain select-none pointer-events-none drop-shadow-sm`}
          priority={priority}
        />
      </div>
    );
  };

  const logoContent = (
    <div className={`inline-flex items-center group cursor-pointer ${className}`}>
      {renderLogoGraphic()}

      {subBrand && (
        <span
          className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full border shadow-sm transition-colors ${sizeConfig.badgeClass} ${
            subBrandStyles[subBrand] || subBrandStyles.Admin
          }`}
        >
          {subBrand}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Synasty Home">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

export default SynastyLogo;
