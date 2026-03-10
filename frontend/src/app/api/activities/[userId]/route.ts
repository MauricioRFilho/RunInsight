import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ActivityService } from '@/services/activity-service';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }

  try {
    const activities = await ActivityService.getRecentActivities(userId, 10);
    return NextResponse.json(activities);
  } catch (error: any) {
    console.error('[API Activities] Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
