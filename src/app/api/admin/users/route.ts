import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSessionFromRequest, isSessionAdmin } from '@/lib/auth';
import { User, ActivityLog } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 }).lean();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, isBlocked, role } = await request.json();

    await connectToDatabase();

    const updateFields: Record<string, unknown> = {};
    if (isBlocked !== undefined) updateFields.isBlocked = isBlocked;
    if (role && ['admin', 'user'].includes(role)) updateFields.role = role;

    const user = await User.findByIdAndUpdate(id, { $set: updateFields }, { new: true }).select('-passwordHash');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await ActivityLog.create({
      action: 'UPDATE_USER',
      details: `Updated user: ${user.email} (Role: ${user.role}, Blocked: ${user.isBlocked})`,
      userEmail: session!.email,
    }).catch(() => {});

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
