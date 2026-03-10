import { CoachService } from '@/services/coach-service';

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
    const feedback = await CoachService.getCoachFeedback(userId);
    return NextResponse.json({ feedback });
  } catch (error: any) {
    console.error('[API Coach] Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch coach feedback' }, { status: 500 });
  }
}
