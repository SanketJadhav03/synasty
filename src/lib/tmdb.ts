import { CURATED_LEGAL_MOVIES, CuratedMovie } from './curatedMovies';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export interface TMDBMovieSummary {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  original_language: string;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
  original_language: string;
  spoken_languages: { english_name: string; iso_639_1: string }[];
  tagline: string;
  status: string;
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
    }[];
  };
}

export function getTmdbImageUrl(path: string | null, size: 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) {
    return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80';
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export async function fetchTrendingMovies(page: number = 1): Promise<{
  results: CuratedMovie[];
  isExternalApi: boolean;
  totalPages: number;
}> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return {
      results: CURATED_LEGAL_MOVIES,
      isExternalApi: false,
      totalPages: 1,
    };
  }

  try {
    const res = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${apiKey}&page=${page}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`TMDB API returned ${res.status}, falling back to curated movies.`);
      return { results: CURATED_LEGAL_MOVIES, isExternalApi: false, totalPages: 1 };
    }

    const data = await res.json();
    const mapped: CuratedMovie[] = (data.results || []).map((m: TMDBMovieSummary) => ({
      title: m.title,
      slug: `${m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${m.id}`,
      tmdbId: m.id,
      overview: m.overview || 'No overview available.',
      posterUrl: getTmdbImageUrl(m.poster_path, 'w500'),
      backdropUrl: getTmdbImageUrl(m.backdrop_path, 'original'),
      releaseYear: m.release_date ? parseInt(m.release_date.substring(0, 4), 10) : new Date().getFullYear(),
      runtime: 120,
      genres: ['Discovery'],
      rating: Math.round(m.vote_average * 10) / 10,
      languages: [m.original_language?.toUpperCase() || 'EN'],
      isFeatured: false,
      isPublished: true,
      sources: [
        {
          sourceName: 'Official Theatrical / Digital Distributor Information',
          sourceType: 'official',
          url: `https://www.themoviedb.org/movie/${m.id}/watch`,
          quality: 'Official Licensed Providers',
          isLegalAuthorizationVerified: true,
          licenseNote: 'Check licensed local regional platforms via JustWatch & TMDB official partners.',
        },
      ],
    }));

    return {
      results: mapped,
      isExternalApi: true,
      totalPages: Math.min(data.total_pages || 1, 10),
    };
  } catch (err) {
    console.error('Error fetching TMDB trending:', err);
    return { results: CURATED_LEGAL_MOVIES, isExternalApi: false, totalPages: 1 };
  }
}

export async function searchTmdbMovies(query: string): Promise<CuratedMovie[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || !query.trim()) {
    const q = query.toLowerCase().trim();
    return CURATED_LEGAL_MOVIES.filter(
      (m) => m.title.toLowerCase().includes(q) || m.genres.some((g) => g.toLowerCase().includes(q))
    );
  }

  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || []).map((m: TMDBMovieSummary) => ({
      title: m.title,
      slug: `${m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${m.id}`,
      tmdbId: m.id,
      overview: m.overview || 'No description provided.',
      posterUrl: getTmdbImageUrl(m.poster_path, 'w500'),
      backdropUrl: getTmdbImageUrl(m.backdrop_path, 'original'),
      releaseYear: m.release_date ? parseInt(m.release_date.substring(0, 4), 10) : new Date().getFullYear(),
      runtime: 110,
      genres: ['Film'],
      rating: Math.round(m.vote_average * 10) / 10,
      languages: [m.original_language?.toUpperCase() || 'EN'],
      isFeatured: false,
      isPublished: true,
      sources: [
        {
          sourceName: 'Official Licensed Viewing Source (TMDB)',
          sourceType: 'official',
          url: `https://www.themoviedb.org/movie/${m.id}/watch`,
          quality: 'Official Licensing',
          isLegalAuthorizationVerified: true,
          licenseNote: 'Refer to authorized regional streaming partners.',
        },
      ],
    }));
  } catch (err) {
    console.error('Error searching TMDB:', err);
    return [];
  }
}
