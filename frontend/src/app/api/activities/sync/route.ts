export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { ActivityService } from '@/services/activity-service';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId || userId === "default-user-id") {
    return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: userId },
        ],
      },
    });

    if (!user || !user.accessToken) {
      return NextResponse.json({ error: 'User or access token not found' }, { status: 404 });
    }

    // Rate limit check: 5 minutes
    const FIVE_MINUTES = 5 * 60 * 1000;
    if (user.lastSyncedAt && (new Date().getTime() - new Date(user.lastSyncedAt).getTime() < FIVE_MINUTES)) {
      return NextResponse.json({ 
        success: true, 
        count: 0, 
        message: 'Recent sync found. Skipping to respect Strava rate limits.' 
      });
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
