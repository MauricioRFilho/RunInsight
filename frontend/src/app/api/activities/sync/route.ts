import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: userId }, // Using email as the identification in frontend for now
    });

    if (!user || !user.accessToken) {
      return NextResponse.json({ error: 'User or access token not found' }, { status: 404 });
    }

    // Refresh token logic would go here if needed, but for MVP we'll try to fetch with existing
    const stravaRes = await fetch('https://www.strava.com/api/v3/athlete/activities', {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    if (!stravaRes.ok) {
       return NextResponse.json({ error: 'Failed to fetch from Strava' }, { status: stravaRes.status });
    }

    const stravaActivities = await stravaRes.json();
    const count = await ActivityService.saveStravaActivities(user.id, stravaActivities);

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error('[API Sync] Error:', error.message);
    return NextResponse.json({ error: 'Failed to sync activities' }, { status: 500 });
  }
}
