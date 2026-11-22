import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSessionFromRequest, isSessionAdmin } from '@/lib/auth';
import { Service, ActivityLog } from '@/lib/models';
import { INITIAL_SERVICES } from '@/lib/initialData';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ services: INITIAL_SERVICES });
    }

    const services = await Service.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ services });
  } catch (error) {
    console.error('Fetch services error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, category, logoUrl, officialUrl, pricingType, tags, isFeatured } = body;

    if (!name || !description || !category || !officialUrl) {
      return NextResponse.json(
        { error: 'Name, description, category, and official URL are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const service = await Service.create({
      name,
      slug,
      description,
      category,
      logoUrl: logoUrl || '',
      officialUrl,
      pricingType: pricingType || 'Free',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : [],
      isFeatured: Boolean(isFeatured),
      isPublished: true,
      isApproved: true,
    });

    await ActivityLog.create({
      action: 'CREATE_SERVICE',
      details: `Added service: ${service.name}`,
      userEmail: session!.email,
    }).catch(() => {});

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
