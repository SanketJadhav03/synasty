'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  className = '',
  size = 'md',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-1.5 text-xs rounded-xl'
      : 'px-3.5 py-2 text-xs sm:text-sm rounded-xl';

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-all shadow-sm cursor-pointer ${sizeClasses}`}
      >
        <span className="truncate flex items-center gap-1.5">
          {selectedOption?.icon}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-violet-500' : ''
          }`}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[140px] max-h-60 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl p-1.5 animate-in fade-in-0 zoom-in-95">
          <ul role="listbox" className="space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {opt.icon}
                    {opt.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0 text-violet-500" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
