'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Film,
  Wrench,
  Layers,
  BookOpen,
  Users,
  Settings,
  DollarSign,
  Inbox,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { SynastyLogo } from '@/components/SynastyLogo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  // If on /admin/login, render without admin navigation frame
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;

    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.authenticated || data.user?.role !== 'admin') {
          router.push('/admin/login');
        } else {
          setAdminUser(data.user);
        }
      })
      .catch(() => router.push('/admin/login'));
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Movies', href: '/admin/movies', icon: Film },
    { label: 'Tools', href: '/admin/tools', icon: Wrench },
    { label: 'Services', href: '/admin/services', icon: Layers },
    { label: 'Blogs & Articles', href: '/admin/blogs', icon: BookOpen },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Settings & APIs', href: '/admin/settings', icon: Settings },
    { label: 'Advertisements', href: '/admin/ads', icon: DollarSign },
    { label: 'Submissions', href: '/admin/submissions', icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
        <SynastyLogo size="sm" subBrand="Admin" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-slate-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 border-r border-slate-800/80 bg-slate-900/95 md:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between p-4 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="px-2 pt-2">
            <SynastyLogo size="md" subBrand="Admin" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="px-2 flex items-center justify-between text-xs">
            <div className="truncate">
              <span className="font-bold text-white block truncate">{adminUser?.name || 'Administrator'}</span>
              <span className="text-slate-500 text-[10px] truncate">{adminUser?.email || 'admin@synasty.xyz'}</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 border border-violet-500/30">
              Admin
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="p-2 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Site
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs flex items-center justify-center gap-1.5 transition-colors font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
