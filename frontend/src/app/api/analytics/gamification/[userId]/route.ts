export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { GamificationService } from '@/services/gamification-service';
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
    const data = await GamificationService.getGamificationData(userId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`[API Gamification] Error fetching data for user ${userId} (raw: ${rawId}):`, error.message);
    return NextResponse.json({ error: 'Failed to fetch gamification data' }, { status: 500 });
  }
}
