import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ShortURL } from '@/lib/models';
import { checkRateLimit, getClientIp } from '@/lib/security';

function generateRandomCode(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`shorten_${ip}`, 15, 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a minute before creating more short links.' },
        { status: 429 }
      );
    }

    const { url, customCode } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required.' }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return NextResponse.json(
          { error: 'URL must begin with http:// or https://' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json({ error: 'Please enter a valid URL.' }, { status: 400 });
    }

    await connectToDatabase();

    let code = customCode ? customCode.trim().toLowerCase() : '';

    if (code) {
      if (!/^[a-zA-Z0-9_-]{3,16}$/.test(code)) {
        return NextResponse.json(
          { error: 'Custom code must be 3-16 alphanumeric characters, hyphens or underscores.' },
          { status: 400 }
        );
      }
      const existing = await ShortURL.findOne({ shortCode: code });
      if (existing) {
        return NextResponse.json(
          { error: 'This custom code is already in use. Please choose another one.' },
          { status: 409 }
        );
      }
    } else {
      let unique = false;
      let attempts = 0;
      while (!unique && attempts < 10) {
        code = generateRandomCode(6);
        const existing = await ShortURL.findOne({ shortCode: code });
        if (!existing) unique = true;
        attempts++;
      }
    }

    const shortRecord = await ShortURL.create({
      originalUrl: parsedUrl.toString(),
      shortCode: code,
      clicks: 0,
    });

    const host = request.headers.get('host') || 'synasty.xyz';
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const shortUrl = `${protocol}://${host}/s/${code}`;

    return NextResponse.json({
      success: true,
      shortCode: code,
      shortUrl,
      originalUrl: shortRecord.originalUrl,
      clicks: 0,
    });
  } catch (error) {
    console.error('Shorten URL error:', error);
    return NextResponse.json(
      { error: 'Failed to generate short link.' },
      { status: 500 }
    );
  }
}
