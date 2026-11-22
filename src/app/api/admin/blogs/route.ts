import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSessionFromRequest, isSessionAdmin } from '@/lib/auth';
import { Blog, ActivityLog } from '@/lib/models';
import { INITIAL_BLOGS } from '@/lib/initialData';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ blogs: INITIAL_BLOGS });
    }

    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Fetch admin blogs error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
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
      excerpt,
      content,
      coverImageUrl,
      category,
      tags,
      authorName,
      authorRole,
      status,
      seoTitle,
      seoDescription,
      isFeatured,
    } = body;

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json(
        { error: 'Title, excerpt, content, and category are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      coverImageUrl: coverImageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      category,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : [],
      author: {
        name: authorName || session?.name || 'Synasty Editorial Team',
        role: authorRole || 'Technology Editor',
        avatar: '/images/synasty-logo.png',
      },
      readingTime,
      status: status || 'published',
      seoTitle: seoTitle || `${title} | Synasty Blogs`,
      seoDescription: seoDescription || excerpt,
      isFeatured: Boolean(isFeatured),
      publishedAt: status === 'published' ? new Date() : undefined,
    });

    await ActivityLog.create({
      action: 'CREATE_BLOG',
      details: `Published article: ${blog.title}`,
      userEmail: session!.email,
    }).catch(() => {});

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
