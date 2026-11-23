'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Film,
  Wrench,
  Layers,
  BookOpen,
  Info,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { SynastyLogo } from './SynastyLogo';
import { ThemeToggle } from './ThemeToggle';
import { GlobalSearchModal } from './GlobalSearchModal';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Movies', href: '/movies', icon: Film, color: 'text-rose-500' },
    { label: 'Tools', href: '/tools', icon: Wrench, color: 'text-violet-500' },
    { label: 'Services', href: '/services', icon: Layers, color: 'text-emerald-500' },
    { label: 'Blogs', href: '/blogs', icon: BookOpen, color: 'text-amber-500' },
    { label: 'About', href: '/about', icon: Info, color: 'text-cyan-500' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-[#070a12]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo with Professional Left Alignment */}
          <div className="flex-shrink-0">
            <SynastyLogo size="md" showTagline={false} priority />
          </div>

          {/* Clean, Breathable Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 select-none group ${
                    isActive
                      ? 'text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {/* Subtle Translucent Floating Pill on Active Tab Only */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-slate-900/[0.05] dark:bg-white/[0.08] border border-slate-900/10 dark:border-white/10 rounded-xl shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Signature Color Icon */}
                  {link.icon && (
                    <link.icon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isActive
                          ? `${link.color} scale-110`
                          : 'text-slate-400 dark:text-slate-500 group-hover:scale-105 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}
                    />
                  )}

                  <span>{link.label}</span>

                  {/* Out-of-the-box Glowing Bottom Accent Line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavAccent"
                      className="absolute -bottom-1 left-2.5 right-2.5 h-[2px] rounded-full bg-gradient-to-r from-violet-600 via-pink-500 to-rose-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search & Theme Toggle with Crisp Spacing */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search Synasty"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all text-xs cursor-pointer shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl animate-in slide-in-from-top-2">
            <div className="px-4 pt-3 pb-6 space-y-1.5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {link.icon && <link.icon className={`w-4 h-4 ${link.color}`} />}
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:underline px-2 py-1"
                >
                  Contact Support
                </Link>
                <span className="text-[11px] text-slate-400">Everything Digital. One Destination.</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default Header;
