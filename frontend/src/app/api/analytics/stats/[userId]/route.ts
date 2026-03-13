export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { StatsService } from '@/services/stats-service';
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
    const stats = await StatsService.getUserStats(userId);
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error(`[API Stats] Error fetching stats for user ${userId} (raw: ${rawId}):`, error.message);
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
  }
}
