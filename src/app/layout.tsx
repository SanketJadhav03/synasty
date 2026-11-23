import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://synasty.xyz'),
  title: {
    default: 'Synasty – Everything Digital. One Destination.',
    template: '%s | Synasty',
  },
  description:
    'Discover movies, explore powerful free online tools, access useful services, and learn something new with Synasty.',
  keywords: [
    'Synasty',
    'Synasty Movies',
    'Free Online Tools',
    'Developer Utilities',
    'QR Code Generator',
    'JSON Formatter',
    'Digital Services',
    'Tech Blogs',
    'Public Domain Movies',
  ],
  authors: [{ name: 'Synasty Team', url: 'https://synasty.xyz' }],
  creator: 'Synasty',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://synasty.xyz',
    siteName: 'Synasty',
    title: 'Synasty – Everything Digital. One Destination.',
    description:
      'Discover movies, explore powerful free online tools, access useful services, and learn something new with Synasty.',
    images: [
      {
        url: '/images/synasty-logo.png',
        width: 1200,
        height: 630,
        alt: 'Synasty Brand Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synasty – Everything Digital. One Destination.',
    description:
      'Discover movies, explore powerful free online tools, access useful services, and learn something new with Synasty.',
    images: ['/images/synasty-logo.png'],
    creator: '@synasty',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/synasty-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#070a12] text-slate-900 dark:text-slate-100 selection:bg-pink-500 selection:text-white transition-colors duration-150`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
