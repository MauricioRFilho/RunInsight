export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ActivityService } from '@/services/activity-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  if (!userId || userId === "default-user-id") {
    return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
  }
  try {
    const activities = await ActivityService.getRecentActivities(userId, 10);
    return NextResponse.json(activities);
  } catch (error: any) {
    console.error('[API Activities] Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
}
}
