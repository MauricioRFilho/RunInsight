export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { ActivityService } from '@/services/activity-service';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: userId },
    });

    if (!user || !user.accessToken) {
      return NextResponse.json({ error: 'User or access token not found' }, { status: 404 });
    }

    const stravaRes = await fetch('https://www.strava.com/api/v3/athlete/activities', {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    if (!stravaRes.ok) {
       return NextResponse.json({ error: 'Failed to fetch from Strava' }, { status: stravaRes.status });
    }

    const stravaActivities = await stravaRes.json();
    const count = await ActivityService.saveStravaActivities(user.id, stravaActivities);
    
    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error('[API Sync] Error:', error.message);
    return NextResponse.json({ error: 'Failed to sync activities' }, { status: 500 });
  }
}
