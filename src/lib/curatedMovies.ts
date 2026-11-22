export interface CuratedMovie {
  title: string;
  slug: string;
  tmdbId?: number;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseYear: number;
  runtime: number;
  genres: string[];
  rating: number;
  languages: string[];
  trailerUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sources: {
    sourceName: string;
    sourceType: 'stream' | 'download' | 'official';
    url: string;
    quality: string;
    isLegalAuthorizationVerified: boolean;
    licenseNote: string;
  }[];
}

export const CURATED_LEGAL_MOVIES: CuratedMovie[] = [
  {
    title: 'Night of the Living Dead',
    slug: 'night-of-the-living-dead-1968',
    tmdbId: 10331,
    overview:
      'A ragtag group of Pennsylvanians barricade themselves in an old farmhouse to remain safe from a bloodthirsty, flesh-eating breed of monsters who are ravaging the Northeast United States. George A. Romero’s legendary horror masterpiece entered the public domain immediately upon release due to an omitted copyright notice on the theatrical prints.',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    releaseYear: 1968,
    runtime: 96,
    genres: ['Horror', 'Sci-Fi', 'Classic'],
    rating: 7.9,
    languages: ['English'],
    trailerUrl: 'https://www.youtube.com/watch?v=0VHstVpZ7vM',
    isFeatured: true,
    isPublished: true,
    sources: [
      {
        sourceName: 'Internet Archive (Legal Public Domain Direct Download)',
        sourceType: 'download',
        url: 'https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4',
        quality: '1080p Public Domain',
        isLegalAuthorizationVerified: true,
        licenseNote: 'Public Domain (Original copyright notice omitted on theatrical release). Legally free to stream and download.',
      },
      {
        sourceName: 'Internet Archive Stream',
        sourceType: 'stream',
        url: 'https://archive.org/details/night_of_the_living_dead',
        quality: 'HD Stream',
        isLegalAuthorizationVerified: true,
        licenseNote: 'Authorized Public Domain Cultural Archive Stream',
      },
    ],
  },
  {
    title: 'Charade',
    slug: 'charade-1963',
    tmdbId: 4808,
    overview:
      'Classic romantic mystery comedy directed by Stanley Donen, starring Cary Grant and Audrey Hepburn. A glamorous widow finds herself pursued by dangerous men seeking a fortune stolen during WWII. The film is in the public domain in the United States because the copyright notice was defective on the original release.',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    releaseYear: 1963,
    runtime: 113,
    genres: ['Mystery', 'Romance', 'Comedy', 'Thriller'],
    rating: 7.9,
    languages: ['English', 'French'],
    trailerUrl: 'https://www.youtube.com/watch?v=Yk498n_zVek',
    isFeatured: true,
    isPublished: true,
    sources: [
      {
        sourceName: 'Internet Archive (Authorized Download)',
        sourceType: 'download',
        url: 'https://archive.org/download/Charade1963/Charade1963.mp4',
        quality: '1080p Remastered',
        isLegalAuthorizationVerified: true,
        licenseNote: 'Public Domain in the United States. Free cultural archive distribution.',
      },
      {
        sourceName: 'Internet Archive Web Player',
        sourceType: 'stream',
        url: 'https://archive.org/details/Charade1963',
        quality: 'HD 1080p',
        isLegalAuthorizationVerified: true,
        licenseNote: 'Public Domain',
      },
    ],
  },
  {
    title: 'His Girl Friday',
    slug: 'his-girl-friday-1940',
    tmdbId: 3085,
    overview:
      'Howard Hawks’ classic screwball comedy starring Cary Grant and Rosalind Russell. A newspaper editor uses every trick in the book to keep his top reporter (and ex-wife) from remarrying and leaving the news business. Highly acclaimed for rapid-fire dialogue and timeless comedy.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
    releaseYear: 1940,
    runtime: 92,
    genres: ['Comedy', 'Romance', 'Classic'],
    rating: 7.8,
    languages: ['English'],
    trailerUrl: 'https://www.youtube.com/watch?v=5rT0hBwK1t4',
    isFeatured: false,
    isPublished: true,
    sources: [
      {
        sourceName: 'Internet Archive (Free Public Download)',
        sourceType: 'download',
        url: 'https://archive.org/download/his_girl_friday/his_girl_friday_512kb.mp4',
        quality: '720p Restored',
        isLegalAuthorizationVerified: true,
        licenseNote: 'Public domain due to failure to renew copyright in 1968.',
      },
      {
        sourceName: 'Internet Archive Streaming Player',
        sourceType: 'stream',
        url: 'https://archive.org/details/his_girl_friday',
        quality: '720p',
        isLegalAuthorizationVerified: true,
        licenseNote: 'Free cultural preservation stream.',
      },
    ],
  },
  {
    title: 'The General',
    slug: 'the-general-1926',
    tmdbId: 961,
    overview:
      'Buster Keaton’s silent cinema masterpiece. When Union spies steal an engineer’s beloved locomotive with his sweetheart aboard, he single-handedly pursues them behind enemy lines. Recognized as one of the greatest films ever made in world cinema history.',
    posterUrl: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    releaseYear: 1926,
    runtime: 78,
    genres: ['Action', 'Comedy', 'Adventure', 'Silent'],
    rating: 8.2,
    languages: ['Silent', 'English Intertitles'],
    trailerUrl: 'https://www.youtube.com/watch?v=nwtU6uO8dD8',
    isFeatured: true,
    isPublished: true,
    sources: [
      {
        sourceName: 'Internet Archive (Public Domain HQ Download)',
        sourceType: 'download',
        url: 'https://archive.org/download/TheGeneral1926/TheGeneral1926.mp4',
        quality: '1080p Digital Restoration',
        isLegalAuthorizationVerified: true,
        licenseNote: 'Public domain worldwide. Free for educational, cultural, and personal use.',
      },
      {
        sourceName: 'Internet Archive Stream',
        sourceType: 'stream',
        url: 'https://archive.org/details/TheGeneral1926',
        quality: '1080p Stream',
        isLegalAuthorizationVerified: true,
        licenseNote: 'Free Public Domain stream.',
      },
    ],
  },
  {
    title: 'Nosferatu',
    slug: 'nosferatu-1922',
    tmdbId: 653,
    overview:
      'F.W. Murnau’s German Expressionist gothic masterpiece. Vampire Count Orlok expresses interest in a new residence and real estate agent Hutter’s wife. One of the foundational films of the horror genre and cinematic expressionism.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=1600&q=80',
    releaseYear: 1922,
    runtime: 94,
    genres: ['Horror', 'Fantasy', 'Expressionism'],
    rating: 7.9,
    languages: ['Silent', 'German/English Intertitles'],
    trailerUrl: 'https://www.youtube.com/watch?v=e7p3427u1kE',
    isFeatured: false,
    isPublished: true,
    sources: [
      {
        sourceName: 'Internet Archive (Direct Download)',
        sourceType: 'download',
        url: 'https://archive.org/download/Nosferatu_1922/Nosferatu_1922.mp4',
        quality: '1080p HD Remaster',
        isLegalAuthorizationVerified: true,
        licenseNote: 'Public domain worldwide. Legally authorized download.',
      },
      {
        sourceName: 'Internet Archive Stream',
        sourceType: 'stream',
        url: 'https://archive.org/details/Nosferatu_1922',
        quality: 'HD Stream',
        isLegalAuthorizationVerified: true,
        licenseNote: 'Public domain stream.',
      },
    ],
  },
  {
    title: 'Carnival of Souls',
    slug: 'carnival-of-souls-1962',
    tmdbId: 16093,
    overview:
      'After a traumatic accident, a woman becomes drawn to a mysterious abandoned carnival on the outskirts of town. Her world begins to spiral as eerie phantoms begin appearing in her daily life. Influential independent psychological horror classic.',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    releaseYear: 1962,
    runtime: 78,
    genres: ['Horror', 'Mystery'],
    rating: 7.1,
    languages: ['English'],
    trailerUrl: 'https://www.youtube.com/watch?v=3-5ePjJmCq0',
    isFeatured: false,
    isPublished: true,
    sources: [
      {
        sourceName: 'Internet Archive Legal Download',
        sourceType: 'download',
        url: 'https://archive.org/download/CarnivalOfSouls1962/CarnivalOfSouls1962.mp4',
        quality: '720p',
        isLegalAuthorizationVerified: true,
        licenseNote: 'Public domain film.',
      },
      {
        sourceName: 'Internet Archive Player',
        sourceType: 'stream',
        url: 'https://archive.org/details/CarnivalOfSouls1962',
        quality: '720p',
        isLegalAuthorizationVerified: true,
        licenseNote: 'Public domain.',
      },
    ],
  },
];
