import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Blog } from '@/lib/models';
import { INITIAL_BLOGS } from '@/lib/initialData';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    const db = await connectToDatabase();

    if (!db) {
      let filtered = [...INITIAL_BLOGS];
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.excerpt.toLowerCase().includes(q) ||
            b.content.toLowerCase().includes(q)
        );
      }
      if (category && category !== 'All') {
        filtered = filtered.filter((b) => b.category === category);
      }
      return NextResponse.json({ blogs: filtered });
    }

    const filter: Record<string, unknown> = { status: 'published' };

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    const blogs = await Blog.find(filter).sort({ isFeatured: -1, publishedAt: -1 }).lean();
    return NextResponse.json({ blogs: blogs.length ? blogs : INITIAL_BLOGS });
  } catch (error) {
    console.error('Fetch public blogs error:', error);
    return NextResponse.json({ blogs: INITIAL_BLOGS });
  }
}
