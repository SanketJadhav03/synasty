'use client';

import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import { ToolLayout } from '@/components/ToolLayout';
import { Upload, Camera, Copy, Check, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

export default function QrScannerPage() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setPreviewUrl(img.src);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('Could not initialize canvas context.');
          return;
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setResult(code.data);
        } else {
          setError('No QR code could be detected in this image. Try an image with higher contrast or sharper focus.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        requestAnimationFrame(tickCamera);
      }
    } catch {
      setError('Camera access denied or not available on this device.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const tickCamera = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setResult(code.data);
          stopCamera();
          return;
        }
      }
    }
    if (isCameraActive) {
      requestAnimationFrame(tickCamera);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    stopCamera();
    setResult(null);
    setError(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isUrl = result && (result.startsWith('http://') || result.startsWith('https://'));

  return (
    <ToolLayout
      slug="qr-scanner"
      title="Client-Side QR Code Scanner"
      category="Media & Barcodes"
      description="Scan and decode QR codes instantly from uploaded screenshots, saved images, or live webcam. Zero server uploads."
      tips={[
        'All barcode parsing occurs purely in client-side memory using Web Assembly and HTML5 Canvas.',
        'If scanning a Wi-Fi code, your parsed SSID and credentials will appear directly in the output box.',
      ]}
    >
      <div className="space-y-6">
        {/* Upload & Camera Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-violet-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 dark:bg-slate-950/40 hover:bg-violet-500/5 transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500 group-hover:scale-110 transition-transform mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Upload Image or Screenshot
            </span>
            <span className="text-xs text-slate-400 mt-1">PNG, JPG, WebP, GIF supported</span>
          </div>

          <div
            onClick={isCameraActive ? stopCamera : startCamera}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
              isCameraActive
                ? 'border-rose-500 bg-rose-500/5'
                : 'border-slate-300 dark:border-slate-700 hover:border-violet-500 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-violet-500/5'
            }`}
          >
            <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500 mb-3">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {isCameraActive ? 'Stop Live Camera' : 'Scan via Device Camera'}
            </span>
            <span className="text-xs text-slate-400 mt-1">Direct camera viewfinder decoding</span>
          </div>
        </div>

        {/* Live Camera Viewfinder */}
        {isCameraActive && (
          <div className="relative max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-700 bg-black">
            <video ref={videoRef} className="w-full h-auto" playsInline />
            <div className="absolute inset-0 border-2 border-violet-500 rounded-2xl pointer-events-none opacity-60 animate-pulse" />
          </div>
        )}

        {/* Uploaded Image Preview */}
        {previewUrl && !isCameraActive && (
          <div className="flex justify-center p-4 bg-slate-100 dark:bg-slate-950/60 rounded-2xl">
            <img src={previewUrl} alt="Preview" className="max-h-60 rounded-xl object-contain shadow-md" />
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Decoded Output */}
        {result && (
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Successfully Decoded Result
              </span>
              <div className="flex gap-2">
                {isUrl && (
                  <a
                    href={result}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open URL
                  </a>
                )}
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Text
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-800 dark:text-slate-100 break-all select-all whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}

        {(result || previewUrl) && (
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear & Scan Another
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
