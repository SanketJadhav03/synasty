'use client';

import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Copy, Check, ShieldAlert, KeyRound, AlertTriangle, Clock } from 'lucide-react';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFseXNzYSBDb2RlciIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MjQ1NjAwMCwiZXhwIjoxNzg4MDAwMDAwfQ.g-8vP9B4oYlR9jG_92yOqM10N34h5V6b7Z8c9D0e1F2';

export default function JwtDecoderPage() {
  const [token, setToken] = useState(SAMPLE_JWT);
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [signature, setSignature] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const base64UrlDecode = (str: string) => {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Illegal base64url string!');
    }
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(output), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  };

  useEffect(() => {
    setError(null);
    if (!token.trim()) {
      setHeader(null);
      setPayload(null);
      setSignature('');
      return;
    }

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT structure: A valid JWT consists of three parts separated by dots (header.payload.signature).');
      setHeader(null);
      setPayload(null);
      setSignature('');
      return;
    }

    try {
      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));
      setHeader(decodedHeader);
      setPayload(decodedPayload);
      setSignature(parts[2]);
    } catch {
      setError('Malformed Base64Url data: Unable to decode token claims.');
      setHeader(null);
      setPayload(null);
      setSignature('');
    }
  }, [token]);

  const handleCopy = (key: string, data: any) => {
    navigator.clipboard.writeText(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Check expiration timestamp
  const getExpirationInfo = () => {
    if (!payload?.exp) return null;
    const expDate = new Date(payload.exp * 1000);
    const now = new Date();
    const isExpired = expDate < now;
    return {
      dateString: expDate.toLocaleString(),
      isExpired,
      raw: payload.exp,
    };
  };

  const expInfo = getExpirationInfo();

  return (
    <ToolLayout
      slug="jwt-decoder"
      title="JSON Web Token (JWT) Decoder"
      category="Security & Crypto"
      description="Decode and inspect JWT headers, payload claims, and token expiration timestamps in real time."
      tips={[
        'JWT tokens are encoded with Base64Url, meaning payloads can be read by anyone unless encrypted with JWE.',
        'Never store sensitive passwords or credentials inside an unencrypted JWT payload.',
      ]}
    >
      <div className="space-y-6">
        {/* Mandatory Security Disclaimer Alert */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Security Notice:</span> Decoding reads unencrypted Base64Url data directly in your browser. Decoding does <strong className="underline">NOT</strong> verify the cryptographic signature or validate whether the token was tampered with. Signature verification must be performed on the backend using the appropriate secret or public key.
          </div>
        </div>

        {/* Token Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Encoded JWT Token
            </label>
            <button
              onClick={() => setToken(SAMPLE_JWT)}
              className="text-xs text-violet-500 hover:underline"
            >
              Load Sample Token
            </button>
          </div>
          <textarea
            rows={4}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your eyJhbGci... token here"
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 break-all"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Expiration Details Card */}
        {expInfo && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
              expInfo.isExpired
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                Expiration ({expInfo.raw}): {expInfo.dateString}
              </span>
            </div>
            <span className="uppercase text-[10px] px-2.5 py-0.5 rounded-full border border-current">
              {expInfo.isExpired ? 'Token Expired' : 'Token Active'}
            </span>
          </div>
        )}

        {/* Header & Payload Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Header Panel */}
          <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                Header: Algorithm & Token Type
              </span>
              <button
                onClick={() => handleCopy('header', header)}
                disabled={!header}
                className="text-xs text-rose-500 hover:underline flex items-center gap-1 disabled:opacity-40"
              >
                {copiedKey === 'header' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedKey === 'header' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto min-h-[140px]">
              {header ? JSON.stringify(header, null, 2) : 'No valid header decoded.'}
            </pre>
          </div>

          {/* Payload Panel */}
          <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-500">
                Payload: Claims & Data
              </span>
              <button
                onClick={() => handleCopy('payload', payload)}
                disabled={!payload}
                className="text-xs text-violet-500 hover:underline flex items-center gap-1 disabled:opacity-40"
              >
                {copiedKey === 'payload' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedKey === 'payload' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto min-h-[140px]">
              {payload ? JSON.stringify(payload, null, 2) : 'No valid payload decoded.'}
            </pre>
          </div>
        </div>

        {/* Signature Box */}
        {signature && (
          <div className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">
                Raw Signature Component
              </span>
              <button
                onClick={() => handleCopy('signature', signature)}
                className="text-xs text-cyan-500 hover:underline flex items-center gap-1"
              >
                {copiedKey === 'signature' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedKey === 'signature' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
              {signature}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
