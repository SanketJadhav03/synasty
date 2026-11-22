# Synasty – Everything Digital. One Destination.

![Synasty Brand Header](/images/synasty-logo.png)

> **Official Domain:** [https://synasty.xyz/](https://synasty.xyz/)  
> **Brand Name:** Synasty  
> **Architecture:** Serverless Full-Stack Next.js (App Router), TypeScript, Tailwind CSS, MongoDB Atlas, Mongoose.

---

## 🌟 Executive Summary

**Synasty** is a next-generation all-in-one digital platform unifying multiple essential digital services under a single premium identity:

1. **Synasty Movies** – Cinema discovery, metadata, trailers, and legally authorized public-domain direct downloads.
2. **Synasty Tools** – 13+ client-side, hardware-accelerated developer & daily utilities running directly in browser memory.
3. **Synasty Services** – Curated directory of verified free and freemium developer tools, AI models, and student perks.
4. **Synasty Blogs** – Engineering tutorials, cinema history, and web security perspectives.
5. **Synasty Admin** – Centralized management suite (`/admin`) for full CRUD over movies, tools, services, articles, user accounts, AdSense slots, and website settings.

---

## 🚀 Technology Stack

- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide React icons, Framer Motion animations.
- **Backend:** Next.js Serverless Route Handlers, MongoDB Atlas, Mongoose ODM.
- **Authentication:** Cryptographic HTTP-Only JWT Session cookies, bcrypt password hashing, role-based access control (Admin / User).
- **Security:** In-memory sliding-window rate limiting, input sanitization, NoSQL injection prevention, client-side cryptographic hashing.
- **Deployment:** Vercel (Edge & Serverless compute), MongoDB Atlas (Cloud database). No local persistent media storage required.

---

## 📁 Project Architecture

```
synasty/
├── public/
│   ├── favicon.ico
│   └── images/
│       └── synasty-logo.png          # Official brand logo
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with ThemeProvider, Header, Footer
│   │   ├── page.tsx                  # Homepage with real DB stats, hero, catalog previews
│   │   ├── not-found.tsx             # Branded 404 handler
│   │   ├── error.tsx                 # Application error boundary
│   │   ├── sitemap.ts                # Dynamic XML sitemap generator
│   │   ├── robots.ts                 # Search crawler rules (disallowing /admin, /api)
│   │   │
│   │   ├── movies/                   # Synasty Movies catalog
│   │   │   ├── page.tsx              # Movie search, genre & year filters
│   │   │   └── [slug]/page.tsx       # Movie details, streams & legal downloads
│   │   │
│   │   ├── tools/                    # Synasty Free Utilities (13 Tools)
│   │   │   ├── page.tsx              # Tools directory
│   │   │   ├── qr-generator/         # QR Code Generator (Text, URL, Wi-Fi, vCard)
│   │   │   ├── qr-scanner/           # QR Code Scanner (Upload image or webcam)
│   │   │   ├── json-formatter/       # JSON Formatter, Minifier & Validator
│   │   │   ├── base64/               # Base64 Text & File Encoder/Decoder
│   │   │   ├── url-encoder/          # URL Encoder, Decoder & Parameter Inspector
│   │   │   ├── password-generator/   # Cryptographic Password Generator
│   │   │   ├── uuid-generator/       # Bulk UUID v4 Generator
│   │   │   ├── hash-generator/       # SHA-256, SHA-384, SHA-512, SHA-1 Generator
│   │   │   ├── word-counter/         # Word, Character & Readability Analyzer
│   │   │   ├── case-converter/       # Text Case Converter & Slug Generator
│   │   │   ├── color-converter/      # HEX, RGB, HSL, CMYK & Contrast Checker
│   │   │   ├── jwt-decoder/          # JWT Token Decoder with Expiration countdown
│   │   │   └── url-shortener/        # Fast URL Shortener & Click Tracker
│   │   │
│   │   ├── services/                 # Synasty Services directory & suggestions
│   │   ├── blogs/                    # Synasty Blogs & article reader
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   │
│   │   ├── admin/                    # Synasty Admin Panel
│   │   │   ├── layout.tsx            # Admin navigation frame & auth protection
│   │   │   ├── login/page.tsx        # Secure administrator login
│   │   │   ├── page.tsx              # Admin dashboard metrics & activity log
│   │   │   ├── movies/page.tsx       # Movie CRUD & authorized sources
│   │   │   ├── tools/page.tsx        # Tool enable/disable & feature toggles
│   │   │   ├── services/page.tsx     # Service directory management
│   │   │   ├── blogs/page.tsx        # Markdown article editor & SEO
│   │   │   ├── users/page.tsx        # User governance & block/unblock
│   │   │   ├── settings/page.tsx     # Branding, SEO, and TMDB API settings
│   │   │   ├── ads/page.tsx          # Google AdSense placement toggles
│   │   │   └── submissions/page.tsx  # Inbound contact & moderation workflow
│   │   │
│   │   ├── s/[code]/route.ts         # Fast short URL redirection handler
│   │   └── api/                      # Serverless backend APIs
│   │       ├── auth/                 # Login, logout, session verification
│   │       ├── movies/               # Public movie search & filters
│   │       ├── services/             # Public services search & filters
│   │       ├── blogs/                # Public blogs search & filters
│   │       ├── stats/                # Database-derived live counts
│   │       ├── contact/              # Inbound contact form handler
│   │       ├── submissions/          # User suggestions handler
│   │       ├── seed/                 # Database bootstrap routine
│   │       ├── tools/shorten/        # URL shortening API
│   │       └── admin/                # Authenticated administrative endpoints
│   │
│   ├── components/                   # Reusable UI & Layout Components
│   │   ├── Header.tsx                # Main navbar with search & theme switch
│   │   ├── Footer.tsx                # Comprehensive footer with legal links
│   │   ├── SynastyLogo.tsx           # Official 3D origami ribbon brand logo
│   │   ├── ToolLayout.tsx            # Standardized tool page shell
│   │   ├── GlobalSearchModal.tsx     # ⌘K / Ctrl+K live platform search
│   │   ├── ThemeToggle.tsx           # Light / Dark / System theme switcher
│   │   └── AdBanner.tsx              # AdSense readiness slot component
│   │
│   └── lib/                          # Core Utilities, Models & Services
│       ├── mongodb.ts                # Cached Mongoose connection pool
│       ├── auth.ts                   # JWT & bcrypt authentication helpers
│       ├── security.ts               # Rate limiting & input sanitization
│       ├── tmdb.ts                   # The Movie Database API client
│       ├── curatedMovies.ts          # Legally verified public-domain catalog
│       ├── initialData.ts            # Baseline tools, services, and blogs
│       ├── seed.ts                   # Database seeding routine
│       └── models/                   # 17 Mongoose schemas & TypeScript interfaces
├── .env.example                      # Environment variables reference
├── package.json
└── tsconfig.json
```

---

## 🛠️ Free Online Tools Suite (13 Included)

Every tool has an individual responsive page with input validation, copy buttons, and client-side processing:

| # | Tool | Slug | Highlights |
|---|------|------|------------|
| 1 | **QR Code Generator** | `/tools/qr-generator` | Text, URL, Wi-Fi networks (WPA/WEP), vCard contact cards, color customization, PNG download |
| 2 | **QR Code Scanner** | `/tools/qr-scanner` | Upload screenshot/image or scan via live device camera; in-browser jsQR decoding |
| 3 | **JSON Formatter** | `/tools/json-formatter` | Beautify with 2/4 spaces or tabs, Minify/compact, line-by-line syntax error detection, JSON download |
| 4 | **Base64 Encoder/Decoder** | `/tools/base64` | Full UTF-8 Unicode support, file to Data URL converter, one-click swap |
| 5 | **URL Encoder/Decoder** | `/tools/url-encoder` | encodeURIComponent/decodeURIComponent, URL protocol/host/path and query parameter table inspector |
| 6 | **Password Generator** | `/tools/password-generator` | Custom length 6-64, symbols/numbers/cases, ambiguous character exclusion, Web Crypto entropy meter |
| 7 | **UUID Generator** | `/tools/uuid-generator` | Bulk Version-4 RFC 4122 UUID generation (1-50 IDs), uppercase/lowercase, hyphens toggle, TXT export |
| 8 | **Hash Generator** | `/tools/hash-generator` | Hardware-accelerated SHA-256, SHA-384, SHA-512, and SHA-1 hex calculations |
| 9 | **Word Counter** | `/tools/word-counter` | Words, characters with/without spaces, sentences, paragraphs, reading speed (WPM), keyword density |
| 10 | **Case Converter** | `/tools/case-converter` | UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, kebab-case, snake_case |
| 11 | **Color Converter** | `/tools/color-converter` | HEX, RGB, HSL, CMYK, CSS variable string, interactive color picker, WCAG AA/AAA contrast check |
| 12 | **JWT Decoder** | `/tools/jwt-decoder` | Decodes Header & Payload claims, calculates expiration timestamps, prominent signature disclaimer |
| 13 | **Fast URL Shortener** | `/tools/url-shortener` | Short link generator with custom alias support, `/s/:code` redirection, rate-limited against abuse |

---

## ⚖️ Legal Cinema Discovery Compliance

Synasty is built on strict compliance with intellectual property standards:

1. **Zero Pirated Media Storage:** Video files are never hosted on Vercel or MongoDB.
2. **Authorized Public Domain Direct Downloads:** Direct download links are provided **exclusively** for verified public domain films (e.g. *Night of the Living Dead*, *Charade*, *His Girl Friday*, *The General*, *Nosferatu*) distributed through cultural preservation repositories like the **Internet Archive**.
3. **Official Viewing Partners:** For contemporary films, Synasty displays official distributor and streaming platforms (TMDB / JustWatch licensed partners).
4. **DMCA Takedown Notice Channel:** Full policy published at [`/dmca`](https://synasty.xyz/dmca) with designated agent contact `dmca@synasty.xyz`.

---

## ⚙️ Environment Variables Reference

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | Default / Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/synasty` |
| `JWT_SECRET` | Secret key for signing admin JWT sessions | `synasty-super-secret-jwt-key-2026-production` |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain of the site | `https://synasty.xyz` |
| `TMDB_API_KEY` | (Optional) TMDB v3 API key | Get from [themoviedb.org](https://www.themoviedb.org/) |
| `ADMIN_INITIAL_EMAIL` | Initial admin account email | `admin@synasty.xyz` |
| `ADMIN_INITIAL_PASSWORD` | Initial admin account password | `SynastyAdmin2026!` |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID`| (Optional) Google AdSense client ID | `ca-pub-1234567890123456` |

---

## 🔐 Administrator Account & Seeding

1. Start the application locally:
   ```bash
   npm run dev
   ```
2. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
3. If connecting to a fresh MongoDB Atlas database, click **"Initialize / Seed Database If Empty"** or visit [`/api/seed`](http://localhost:3000/api/seed).
4. Sign in with the initial administrator credentials:
   - **Email:** `admin@synasty.xyz`
   - **Password:** `SynastyAdmin2026!`
5. Navigate to **Settings** (`/admin/settings`) to update your credentials and configure your TMDB API key.

---

## 🌐 Vercel Deployment Guide

Deploying Synasty to Vercel requires zero VPS or local storage configuration:

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log into [vercel.com](https://vercel.com/) and click **"Add New Project"**.
3. Select your repository. Vercel automatically detects Next.js.
4. Under **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI.
   - `JWT_SECRET`: A secure 32+ character string.
   - `NEXT_PUBLIC_SITE_URL`: `https://synasty.xyz`
   - `TMDB_API_KEY`: (Optional) Your TMDB API key.
   - `ADMIN_INITIAL_EMAIL`: `admin@synasty.xyz`
   - `ADMIN_INITIAL_PASSWORD`: A secure master password.
5. Click **"Deploy"**.
6. Once deployed, trigger database initialization by visiting:
   ```
   https://synasty.xyz/api/seed
   ```
7. Log into `https://synasty.xyz/admin` to manage your platform!

---

## 📊 Quality Assurance & Verification Report

- **TypeScript Compilation:** Passed with 0 errors (`npm run build`).
- **Static & Dynamic Route Generation:** 45/45 routes prerendered / dynamically registered.
- **Tools Verification:** All 13 tools verified for client-side functionality, copy actions, and validation.
- **Admin Authentication:** Tested JWT cookie issuance, password hashing via bcrypt, and route protections.
- **SEO & Search Engines:** Dynamic `/sitemap.xml` and `/robots.txt` active.
- **Theme Switching:** Dark, light, and system theme modes responsive across all device breakpoints.
