import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Service } from '@/lib/models';
import { INITIAL_SERVICES } from '@/lib/initialData';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const pricing = searchParams.get('pricing') || '';

    const db = await connectToDatabase();

    if (!db) {
      let filtered = [...INITIAL_SERVICES];
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
        );
      }
      if (category && category !== 'All') {
        filtered = filtered.filter((s) => s.category === category);
      }
      if (pricing && pricing !== 'All') {
        filtered = filtered.filter((s) => s.pricingType === pricing);
      }
      return NextResponse.json({ services: filtered });
    }

    const filter: Record<string, unknown> = { isPublished: true, isApproved: true };

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (pricing && pricing !== 'All') {
      filter.pricingType = pricing;
    }

    const services = await Service.find(filter).sort({ isFeatured: -1, createdAt: -1 }).lean();
    return NextResponse.json({ services: services.length ? services : INITIAL_SERVICES });
  } catch (error) {
    console.error('Fetch public services error:', error);
    return NextResponse.json({ services: INITIAL_SERVICES });
  }
}
