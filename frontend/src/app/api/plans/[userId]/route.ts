import { PlanService } from '@/services/plan-service';

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
    const plans = await PlanService.getPlans(userId);
    return NextResponse.json(plans);
  } catch (error: any) {
    console.error('[API Plans GET] Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const body = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }

  try {
    const plan = await PlanService.createPlan(userId, body);
    return NextResponse.json(plan);
  } catch (error: any) {
    console.error('[API Plans POST] Error:', error.message);
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}
