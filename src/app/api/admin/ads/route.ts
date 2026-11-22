import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSessionFromRequest, isSessionAdmin } from '@/lib/auth';
import { Advertisement, ActivityLog } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const ads = await Advertisement.find().lean();
    return NextResponse.json({ ads });
  } catch (error) {
    console.error('Fetch ads error:', error);
    return NextResponse.json({ error: 'Failed to fetch ads configuration' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { placement, isEnabled, adClient, adSlot, customHtml } = await request.json();

    if (!placement) {
      return NextResponse.json({ error: 'Placement identifier is required.' }, { status: 400 });
    }

    await connectToDatabase();

    const ad = await Advertisement.findOneAndUpdate(
      { placement },
      {
        $set: {
          isEnabled: Boolean(isEnabled),
          adClient: adClient || '',
          adSlot: adSlot || '',
          customHtml: customHtml || '',
        },
      },
      { new: true, upsert: true }
    );

    await ActivityLog.create({
      action: 'UPDATE_ADS',
      details: `Updated ad slot: ${placement} (Enabled: ${ad.isEnabled})`,
      userEmail: session!.email,
    }).catch(() => {});

    return NextResponse.json({ success: true, ad });
  } catch (error) {
    console.error('Update ads error:', error);
    return NextResponse.json({ error: 'Failed to update ad slot' }, { status: 500 });
  }
}
