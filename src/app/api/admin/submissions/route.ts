import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSessionFromRequest, isSessionAdmin } from '@/lib/auth';
import { Submission, ContactMessage, ActivityLog } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const [submissions, messages] = await Promise.all([
      Submission.find().sort({ createdAt: -1 }).limit(100).lean(),
      ContactMessage.find().sort({ createdAt: -1 }).limit(100).lean(),
    ]);

    return NextResponse.json({ submissions, messages });
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { targetType, id, status } = await request.json();

    await connectToDatabase();

    if (targetType === 'message') {
      const msg = await ContactMessage.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
      );
      return NextResponse.json({ success: true, item: msg });
    } else {
      const submission = await Submission.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
      );

      await ActivityLog.create({
        action: 'MODERATE_SUBMISSION',
        details: `Marked submission ${id} as ${status}`,
        userEmail: session!.email,
      }).catch(() => {});

      return NextResponse.json({ success: true, item: submission });
    }
  } catch (error) {
    console.error('Update submission error:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('targetType');
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    if (targetType === 'message') {
      await ContactMessage.findByIdAndDelete(id);
    } else {
      await Submission.findByIdAndDelete(id);
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Delete submission error:', error);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
