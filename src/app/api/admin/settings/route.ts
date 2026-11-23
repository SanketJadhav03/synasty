import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSessionFromRequest, isSessionAdmin } from '@/lib/auth';
import { WebsiteSetting, ActivityLog } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    let settings = await WebsiteSetting.findOne().lean();
    if (!settings) {
      settings = await WebsiteSetting.create({
        siteName: 'Synasty',
        siteUrl: 'https://synasty.xyz',
        logoUrl: '/images/synasty-logo-dark.png',
        faviconUrl: '/favicon.ico',
        defaultSeoTitle: 'Synasty – Everything Digital. One Destination.',
        defaultSeoDescription: 'Discover movies, explore powerful free online utilities, access useful curated digital services, and learn with technology tutorials at Synasty.',
        contactEmail: 'contact@synasty.xyz',
        themeDefault: 'system',
        tmdbApiKey: process.env.TMDB_API_KEY || '',
        tmdbEnabled: true,
        cacheExpiryMinutes: 60,
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectToDatabase();

    const updated = await WebsiteSetting.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true }
    );

    await ActivityLog.create({
      action: 'UPDATE_SETTINGS',
      details: 'Updated global website settings',
      userEmail: session!.email,
    }).catch(() => {});

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
