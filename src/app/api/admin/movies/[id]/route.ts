import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSessionFromRequest, isSessionAdmin } from '@/lib/auth';
import { Movie, MovieSource, ActivityLog } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();

    const movie = await Movie.findById(id).lean();
    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    const sources = await MovieSource.find({ movieId: id }).lean();
    return NextResponse.json({ movie, sources });
  } catch (error) {
    console.error('Fetch single movie error:', error);
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();

    const updated = await Movie.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    await ActivityLog.create({
      action: 'UPDATE_MOVIE',
      details: `Updated movie: ${updated.title}`,
      userEmail: session!.email,
    }).catch(() => {});

    return NextResponse.json({ success: true, movie: updated });
  } catch (error) {
    console.error('Update movie error:', error);
    return NextResponse.json({ error: 'Failed to update movie' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionFromRequest(request);
  if (!isSessionAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();

    const deleted = await Movie.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    await MovieSource.deleteMany({ movieId: id });

    await ActivityLog.create({
      action: 'DELETE_MOVIE',
      details: `Deleted movie ID: ${id}`,
      userEmail: session!.email,
    }).catch(() => {});

    return NextResponse.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Delete movie error:', error);
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}
