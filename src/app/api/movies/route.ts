import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Movie, MovieSource } from '@/lib/models';
import { CURATED_LEGAL_MOVIES } from '@/lib/curatedMovies';
import { fetchTrendingMovies, searchTmdbMovies } from '@/lib/tmdb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const genre = searchParams.get('genre') || '';
    const year = searchParams.get('year') || '';
    const sort = searchParams.get('sort') || 'popular';

    const db = await connectToDatabase();

    if (!db) {
      let filtered = [...CURATED_LEGAL_MOVIES];
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter((m) => m.title.toLowerCase().includes(q));
      }
      if (genre && genre !== 'All') {
        filtered = filtered.filter((m) => m.genres.includes(genre));
      }
      if (year && year !== 'All') {
        filtered = filtered.filter((m) => m.releaseYear === parseInt(year, 10));
      }
      return NextResponse.json({ movies: filtered, isExternal: false });
    }

    // If search query is provided and no results in local DB, also check TMDB
    const filter: Record<string, unknown> = { isPublished: true };

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { overview: { $regex: query, $options: 'i' } },
      ];
    }
    if (genre && genre !== 'All') {
      filter.genres = genre;
    }
    if (year && year !== 'All') {
      filter.releaseYear = parseInt(year, 10);
    }

    let sortOptions: Record<string, 1 | -1> = { rating: -1 };
    if (sort === 'newest') sortOptions = { releaseYear: -1, createdAt: -1 };
    if (sort === 'title') sortOptions = { title: 1 };

    let movies = await Movie.find(filter).sort(sortOptions).limit(50).lean();

    if (movies.length === 0 && !query && !genre && !year) {
      // Auto-fallback to curated if database is freshly deployed
      movies = CURATED_LEGAL_MOVIES as any;
    }

    return NextResponse.json({ movies, isExternal: false });
  } catch (error) {
    console.error('Fetch public movies error:', error);
    return NextResponse.json({ movies: CURATED_LEGAL_MOVIES, isExternal: false });
  }
}
