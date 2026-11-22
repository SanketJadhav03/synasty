import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ContactMessage } from '@/lib/models';
import { checkRateLimit, getClientIp, sanitizeString } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`contact_${ip}`, 5, 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please wait a minute before sending another message.' },
        { status: 429 }
      );
    }

    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields (name, email, subject, message) are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const created = await ContactMessage.create({
      name: sanitizeString(name),
      email: email.toLowerCase().trim(),
      subject: sanitizeString(subject),
      message: sanitizeString(message),
      status: 'unread',
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received by the Synasty team.',
      id: created._id,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit message. Please try again later.' },
      { status: 500 }
    );
  }
}
