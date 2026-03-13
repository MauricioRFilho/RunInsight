export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { ActivityService } from '@/services/activity-service';
import { UserService } from '@/services/user-service';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const rawId = request.nextUrl.searchParams.get('userId');
  const userId = await UserService.resolveInternalId(rawId || '');

  if (!userId) {
    return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.accessToken) {
      console.error(`[API Sync] User ${userId} found but has no Strava access token.`);
      return NextResponse.json({ error: 'User Strava connection not found' }, { status: 404 });
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

    console.log(`[API Sync] Starting Strava fetch for user ${user.id} (${user.email || 'no-email'})`);

    const stravaRes = await fetch('https://www.strava.com/api/v3/athlete/activities', {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    if (!stravaRes.ok) {
       console.error(`[API Sync] Strava API error: ${stravaRes.status} for user ${user.id}`);
       return NextResponse.json({ error: 'Failed to fetch from Strava' }, { status: stravaRes.status });
    }

    const stravaActivities = await stravaRes.json();
    const count = await ActivityService.saveStravaActivities(user.id, stravaActivities);
    
    console.log(`[API Sync] Successfully synced ${count} activities for user ${user.id}`);
    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error(`[API Sync] Critical error for user ${userId}:`, error.message);
    if (error.stack) console.error(error.stack);
    return NextResponse.json({ error: 'Failed to sync activities' }, { status: 500 });
  }
}
