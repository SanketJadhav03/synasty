import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Movie, Tool, Service, Blog, User } from '@/lib/models';
import { INITIAL_TOOLS, INITIAL_SERVICES, INITIAL_BLOGS } from '@/lib/initialData';
import { CURATED_LEGAL_MOVIES } from '@/lib/curatedMovies';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (!db) {
      // Fallback to static catalog counts when DB connection is pending
      return NextResponse.json({
        movies: CURATED_LEGAL_MOVIES.length,
        tools: INITIAL_TOOLS.length,
        services: INITIAL_SERVICES.length,
        blogs: INITIAL_BLOGS.length,
        users: 1,
        source: 'catalogs',
      });
    }

    const [moviesCount, toolsCount, servicesCount, blogsCount, usersCount] = await Promise.all([
      Movie.countDocuments({ isPublished: true }),
      Tool.countDocuments({ isEnabled: true }),
      Service.countDocuments({ isPublished: true, isApproved: true }),
      Blog.countDocuments({ status: 'published' }),
      User.countDocuments(),
    ]);

    return NextResponse.json({
      movies: moviesCount || CURATED_LEGAL_MOVIES.length,
      tools: toolsCount || INITIAL_TOOLS.length,
      services: servicesCount || INITIAL_SERVICES.length,
      blogs: blogsCount || INITIAL_BLOGS.length,
      users: usersCount || 1,
      source: 'database',
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      {
        movies: CURATED_LEGAL_MOVIES.length,
        tools: INITIAL_TOOLS.length,
        services: INITIAL_SERVICES.length,
        blogs: INITIAL_BLOGS.length,
        users: 1,
        source: 'fallback',
      },
      { status: 200 }
    );
  }
}
