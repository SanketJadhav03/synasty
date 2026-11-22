'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 animate-pulse" />
    );
  }

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <button
      onClick={cycleTheme}
      title={`Current: ${theme || 'system'}. Click to toggle`}
      aria-label="Toggle display theme"
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 transition-all duration-200 hover:scale-105 shadow-sm"
    >
      {theme === 'dark' ? (
        <Moon className="w-4 h-4 text-violet-400" />
      ) : theme === 'light' ? (
        <Sun className="w-4 h-4 text-amber-500" />
      ) : (
        <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      )}
    </button>
  );
}
