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
    'Synasty unifies verified public domain movies, powerful free online developer utilities, curated digital services, and technology tutorials under one modern destination.',
  keywords: [
    'Synasty',
    'Synasty Movies',
    'Free Online Tools',
    'Developer Utilities',
    'QR Code Generator',
    'JSON Formatter',
    'JWT Decoder',
    'Password Generator',
    'Digital Services',
    'Tech Blogs',
    'Public Domain Movies',
    'Free Web Utilities',
  ],
  authors: [{ name: 'Synasty Team', url: 'https://synasty.xyz' }],
  creator: 'Synasty',
  publisher: 'Synasty',
  alternates: {
    canonical: 'https://synasty.xyz',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        url: '/images/synasty-logo-dark.png',
        width: 940,
        height: 325,
        alt: 'Synasty Official Brand Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synasty – Everything Digital. One Destination.',
    description:
      'Discover movies, explore powerful free online tools, access useful services, and learn something new with Synasty.',
    images: ['/images/synasty-logo-dark.png'],
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://synasty.xyz/#organization',
        name: 'Synasty',
        url: 'https://synasty.xyz',
        logo: {
          '@type': 'ImageObject',
          url: 'https://synasty.xyz/images/synasty-logo-dark.png',
          width: 940,
          height: 325,
          caption: 'Synasty Brand Logo',
        },
        description:
          'Everything Digital. One Destination. Unified movie discovery, free online developer utilities, curated digital services, and technology tutorials.',
        sameAs: ['https://github.com/SanketJadhav03/synasty'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://synasty.xyz/#website',
        url: 'https://synasty.xyz',
        name: 'Synasty',
        description: 'Everything Digital. One Destination.',
        publisher: {
          '@id': 'https://synasty.xyz/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://synasty.xyz/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SiteNavigationElement',
        name: ['Movies', 'Tools', 'Services', 'Blogs', 'About'],
        url: [
          'https://synasty.xyz/movies',
          'https://synasty.xyz/tools',
          'https://synasty.xyz/services',
          'https://synasty.xyz/blogs',
          'https://synasty.xyz/about',
        ],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
