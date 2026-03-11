export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { GamificationService } from '@/services/gamification-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }
  try {
    const data = await GamificationService.getGamificationData(userId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API Gamification] Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch gamification data' }, { status: 500 });
}
}
