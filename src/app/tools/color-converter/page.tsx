'use client';

import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Copy, Check, Palette, Eye } from 'lucide-react';

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#8B5CF6');
  const [rgb, setRgb] = useState({ r: 139, g: 92, b: 246 });
  const [hsl, setHsl] = useState({ h: 258, s: 90, l: 66 });
  const [cmyk, setCmyk] = useState({ c: 43, m: 63, y: 0, k: 4 });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Convert Hex to RGB
  const hexToRgb = (hexStr: string) => {
    let clean = hexStr.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    if (clean.length !== 6) return null;
    const num = parseInt(clean, 16);
    if (isNaN(num)) return null;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Convert RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;
    const k = Math.min(c, Math.min(m, y));
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    return { c, m, y, k: Math.round(k * 100) };
  };

  const updateFromHex = (newHex: string) => {
    setHex(newHex);
    const parsedRgb = hexToRgb(newHex);
    if (parsedRgb) {
      setRgb(parsedRgb);
      setHsl(rgbToHsl(parsedRgb.r, parsedRgb.g, parsedRgb.b));
      setCmyk(rgbToCmyk(parsedRgb.r, parsedRgb.g, parsedRgb.b));
    }
  };

  // Calculate Relative Luminance and WCAG Contrast
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const lum = getLuminance(rgb.r, rgb.g, rgb.b);
  const contrastWithWhite = (1 + 0.05) / (lum + 0.05);
  const contrastWithBlack = (lum + 0.05) / (0 + 0.05);

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formats = [
    { label: 'HEX', value: hex.toUpperCase(), key: 'hex' },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, key: 'rgb' },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, key: 'hsl' },
    { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, key: 'cmyk' },
    { label: 'CSS Variable', value: `--color: ${hex};`, key: 'css' },
  ];

  return (
    <ToolLayout
      slug="color-converter"
      title="Color Converter & Contrast Checker"
      category="Design & Colors"
      description="Convert colors across HEX, RGB, HSL, and CMYK with a visual color picker, luminance measurement, and WCAG accessibility contrast calculation."
      tips={[
        'WCAG AA compliance requires at least a 4.5:1 contrast ratio for normal body text and 3:1 for large headlines.',
        'CMYK color codes represent 4-color process inks used in offset printing.',
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Color Picker & Live Swatch */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div
            className="w-full h-44 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors duration-200"
            style={{ backgroundColor: hex }}
          >
            <span
              className="text-sm font-bold font-mono px-3 py-1 rounded-full shadow-md backdrop-blur-md"
              style={{
                color: contrastWithWhite > contrastWithBlack ? '#ffffff' : '#000000',
                backgroundColor: 'rgba(0,0,0,0.2)',
              }}
            >
              {hex.toUpperCase()}
            </span>
          </div>

          <div className="w-full flex items-center gap-3">
            <input
              type="color"
              value={hex.startsWith('#') && hex.length === 7 ? hex : '#8b5cf6'}
              onChange={(e) => updateFromHex(e.target.value)}
              className="w-12 h-12 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0"
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
              placeholder="#8B5CF6"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-sm uppercase font-semibold"
            />
          </div>

          {/* WCAG Contrast check */}
          <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              WCAG Accessibility Contrast
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span>vs White:</span>
                <span className={`font-mono font-bold ${contrastWithWhite >= 4.5 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {contrastWithWhite.toFixed(2)}:1
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span>vs Black:</span>
                <span className={`font-mono font-bold ${contrastWithBlack >= 4.5 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {contrastWithBlack.toFixed(2)}:1
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Formats Outputs */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Color Representations
          </span>

          {formats.map((fmt) => (
            <div
              key={fmt.key}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-sm"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {fmt.label}
                </span>
                <span className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {fmt.value}
                </span>
              </div>
              <button
                onClick={() => handleCopy(fmt.key, fmt.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold hover:text-violet-500 flex items-center gap-1 transition-colors"
              >
                {copiedKey === fmt.key ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
