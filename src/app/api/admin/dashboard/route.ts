import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSessionFromRequest, isSessionAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
import {
  Movie,
  Tool,
  Service,
  Blog,
  User,
  Submission,
  ContactMessage,
  ShortURL,
  ActivityLog,
} from '@/lib/models';
import { CURATED_LEGAL_MOVIES } from '@/lib/curatedMovies';
import { INITIAL_TOOLS, INITIAL_SERVICES, INITIAL_BLOGS } from '@/lib/initialData';

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
  }

  try {
    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json({
        metrics: {
          totalMovies: CURATED_LEGAL_MOVIES.length,
          totalTools: INITIAL_TOOLS.length,
          totalServices: INITIAL_SERVICES.length,
          totalBlogs: INITIAL_BLOGS.length,
          totalUsers: 1,
          pendingSubmissions: 0,
          unreadMessages: 0,
          totalShortUrls: 0,
        },
        recentActivity: [],
        systemStatus: 'Database Pending Connection',
      });
    }

    const [
      totalMovies,
      totalTools,
      totalServices,
      totalBlogs,
      totalUsers,
      pendingSubmissions,
      unreadMessages,
      totalShortUrls,
      recentActivity,
    ] = await Promise.all([
      Movie.countDocuments(),
      Tool.countDocuments(),
      Service.countDocuments(),
      Blog.countDocuments(),
      User.countDocuments(),
      Submission.countDocuments({ status: 'pending' }),
      ContactMessage.countDocuments({ status: 'unread' }),
      ShortURL.countDocuments(),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return NextResponse.json({
      metrics: {
        totalMovies,
        totalTools,
        totalServices,
        totalBlogs,
        totalUsers,
        pendingSubmissions,
        unreadMessages,
        totalShortUrls,
      },
      recentActivity,
      systemStatus: 'Healthy & Operational',
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard metrics.' }, { status: 500 });
  }
}
