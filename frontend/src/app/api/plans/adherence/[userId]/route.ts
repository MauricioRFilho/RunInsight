export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PlanService } from '@/services/plan-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  if (!userId || userId === "default-user-id") {
    return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
  }
  try {
    const score = await PlanService.getAdherenceScore(userId);
    return NextResponse.json({ score });
  } catch (error: any) {
    console.error('[API Adherence] Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch adherence score' }, { status: 500 });
  }
}