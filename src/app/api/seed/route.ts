import { NextResponse } from 'next/server';
import { runDatabaseSeed } from '@/lib/seed';

export async function GET() {
  try {
    const result = await runDatabaseSeed();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown seed error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await runDatabaseSeed();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown seed error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
