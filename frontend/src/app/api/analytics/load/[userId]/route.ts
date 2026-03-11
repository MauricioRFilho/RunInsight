export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { ActivityService } from '@/services/activity-service';

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }

  try {
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);

    const activities = await ActivityService.getRecentActivities(userId, 50);
    
    const currentWeekActivities = activities.filter((a: any) => new Date(a.startDate) >= currentWeekStart);
    const previousWeekActivities = activities.filter((a: any) => {
      const d = new Date(a.startDate);
      return d >= previousWeekStart && d < currentWeekStart;
    });

    const currentWeekVolume = currentWeekActivities.reduce((acc: number, a: any) => acc + a.distance, 0) / 1000;
    const previousWeekVolume = previousWeekActivities.reduce((acc: number, a: any) => acc + a.distance, 0) / 1000;

    const increasePercentage = previousWeekVolume > 0 
      ? ((currentWeekVolume - previousWeekVolume) / previousWeekVolume) * 100 
      : 0;

    const isOverloaded = increasePercentage > 15;

    return NextResponse.json({
      currentWeekVolume: Math.round(currentWeekVolume * 10) / 10,
      previousWeekVolume: Math.round(previousWeekVolume * 10) / 10,
      isOverloaded,
      increasePercentage: Math.round(increasePercentage),
    });
  } catch (error: any) {
    console.error('[API Load Analysis] Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch load analysis' }, { status: 500 });
  }
}
