export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { CoachService } from '@/services/coach-service';
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
    const feedback = await CoachService.getCoachFeedback(userId);
    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error(`[API Coach Feedback] Error for user ${userId} (raw: ${rawId}):`, error.message);
    return NextResponse.json({ error: 'Failed to fetch coach feedback' }, { status: 500 });
  }
}
