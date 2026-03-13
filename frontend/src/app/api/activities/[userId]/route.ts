export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ActivityService } from '@/services/activity-service';
import { UserService } from '@/services/user-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId: rawId } = await params;
  const userId = await UserService.resolveInternalId(rawId);

  if (!userId) {
    return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
  }
  try {
    const activities = await ActivityService.getRecentActivities(userId, 10);
    return NextResponse.json(activities);
  } catch (error: any) {
    console.error(`[API Activities] Error fetching activities for user ${userId} (raw: ${rawId}):`, error.message);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
