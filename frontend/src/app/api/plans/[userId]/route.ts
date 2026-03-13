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
    const plans = await PlanService.getPlans(userId);
    return NextResponse.json(plans);
  } catch (error: any) {
    console.error(`[API Plans GET] Error fetching plans for user ${userId}:`, error.message);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    const body = await request.json();
    const plan = await PlanService.createPlan(userId, body);
    return NextResponse.json(plan);
  } catch (error: any) {
    console.error(`[API Plans POST] Error creating plan for user ${userId}:`, error.message);
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}
