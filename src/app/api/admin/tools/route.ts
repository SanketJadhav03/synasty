import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSessionFromRequest, isSessionAdmin } from '@/lib/auth';
import { Tool, ActivityLog } from '@/lib/models';
import { INITIAL_TOOLS } from '@/lib/initialData';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ tools: INITIAL_TOOLS });
    }

    const tools = await Tool.find().sort({ name: 1 }).lean();
    return NextResponse.json({ tools });
  } catch (error) {
    console.error('Fetch tools error:', error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, isEnabled, isFeatured, name, description, category } = await request.json();

    await connectToDatabase();

    const updateFields: Record<string, unknown> = {};
    if (isEnabled !== undefined) updateFields.isEnabled = isEnabled;
    if (isFeatured !== undefined) updateFields.isFeatured = isFeatured;
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;

    const tool = await Tool.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    await ActivityLog.create({
      action: 'UPDATE_TOOL',
      details: `Updated tool: ${tool.name} (Active: ${tool.isEnabled})`,
      userEmail: session!.email,
    }).catch(() => {});

    return NextResponse.json({ success: true, tool });
  } catch (error) {
    console.error('Update tool error:', error);
    return NextResponse.json({ error: 'Failed to update tool' }, { status: 500 });
  }
}
