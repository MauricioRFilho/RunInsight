import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      hasDbUrl: !!process.env.DATABASE_URL,
      hasAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasStravaId: !!process.env.STRAVA_CLIENT_ID,
    }
  });
}
