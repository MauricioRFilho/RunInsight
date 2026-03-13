export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { StatsService } from '@/services/stats-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  if (!userId || userId === "default-user-id") {
    return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
  }
  try {
    const records = await StatsService.getPersonalRecords(userId);
    return NextResponse.json(records);
  } catch (error: any) {
    console.error('[API Records] Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch personal records' }, { status: 500 });
}
}
