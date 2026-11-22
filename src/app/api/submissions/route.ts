import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Submission } from '@/lib/models';
import { checkRateLimit, getClientIp, sanitizeString } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`submission_${ip}`, 8, 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit reached. Please wait a moment before submitting again.' },
        { status: 429 }
      );
    }

    const { type, submitterName, submitterEmail, title, details, url } = await request.json();

    if (!type || !submitterName || !submitterEmail || !title || !details) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    if (!['movie_source', 'service', 'general_suggestion'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid submission type.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const submission = await Submission.create({
      type,
      submitterName: sanitizeString(submitterName),
      submitterEmail: submitterEmail.toLowerCase().trim(),
      title: sanitizeString(title),
      details: sanitizeString(details),
      url: url ? sanitizeString(url) : '',
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Submission received! Our moderation team will review it shortly.',
      id: submission._id,
    });
  } catch (error) {
    console.error('Submission creation error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission.' },
      { status: 500 }
    );
  }
}
