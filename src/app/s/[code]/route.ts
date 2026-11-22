import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ShortURL } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    if (!code) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    await connectToDatabase();

    const record = await ShortURL.findOne({ shortCode: code });

    if (!record) {
      return NextResponse.redirect(new URL('/tools/url-shortener?error=notfound', request.url));
    }

    // Increment click count asynchronously
    record.clicks += 1;
    record.lastAccessedAt = new Date();
    await record.save().catch(() => {});

    return NextResponse.redirect(record.originalUrl, { status: 307 });
  } catch (error) {
    console.error('Redirect short url error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
