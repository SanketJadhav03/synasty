import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSessionFromRequest, isSessionAdmin } from '@/lib/auth';
import { Movie, MovieSource, ActivityLog } from '@/lib/models';
import { CURATED_LEGAL_MOVIES } from '@/lib/curatedMovies';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ movies: CURATED_LEGAL_MOVIES });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { genres: { $regex: search, $options: 'i' } },
      ];
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ movies });
  } catch (error) {
    console.error('Fetch admin movies error:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      overview,
      posterUrl,
      backdropUrl,
      releaseYear,
      runtime,
      genres,
      rating,
      languages,
      trailerUrl,
      isFeatured,
      isPublished,
      sources,
    } = body;

    if (!title || !overview || !posterUrl || !releaseYear) {
      return NextResponse.json(
        { error: 'Title, overview, poster URL, and release year are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${releaseYear}-${Date.now().toString().slice(-4)}`;

    const movie = await Movie.create({
      title,
      slug,
      overview,
      posterUrl,
      backdropUrl: backdropUrl || '',
      releaseYear: Number(releaseYear),
      runtime: Number(runtime) || 0,
      genres: Array.isArray(genres) ? genres : typeof genres === 'string' ? genres.split(',').map((g: string) => g.trim()) : [],
      rating: Number(rating) || 7.0,
      languages: Array.isArray(languages) ? languages : ['English'],
      trailerUrl: trailerUrl || '',
      isFeatured: Boolean(isFeatured),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      sourceCount: Array.isArray(sources) ? sources.length : 0,
    });

    if (Array.isArray(sources) && sources.length > 0) {
      for (const src of sources) {
        if (src.sourceName && src.url) {
          await MovieSource.create({
            movieId: movie._id,
            sourceName: src.sourceName,
            sourceType: src.sourceType || 'official',
            url: src.url,
            quality: src.quality || '1080p',
            isLegalAuthorizationVerified: true,
            licenseNote: src.licenseNote || 'Public Domain / Free Rights-Holder Authorized Distribution',
          });
        }
      }
    }

    await ActivityLog.create({
      action: 'CREATE_MOVIE',
      details: `Added movie: ${movie.title}`,
      userEmail: session!.email,
    }).catch(() => {});

    return NextResponse.json({ success: true, movie });
  } catch (error) {
    console.error('Create movie error:', error);
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
  }
}
