import prisma from '@/lib/prisma';
import { GamificationService } from './gamification-service';

export class ActivityService {
  /**
   * Processes raw activities from Strava and saves them to the database.
   */
  static async saveStravaActivities(userId: string, stravaActivities: any[]) {
    const activitiesData = stravaActivities
      .filter(activity => {
        const isValid = activity.id && activity.distance >= 0 && activity.moving_time >= 0;
        if (!isValid) console.warn(`[ActivityService] Skipping invalid activities data:`, activity.id);
        return isValid;
      })
      .map((activity) => ({
        userId,
        stravaId: activity.id.toString(),
        name: activity.name || 'Atividade sem nome',
        distance: activity.distance,
        movingTime: activity.moving_time,
        elapsedTime: activity.elapsed_time || activity.moving_time,
        totalElevationGain: activity.total_elevation_gain || 0,
        type: activity.type === 'Run' ? 'Run' : activity.type,
        startDate: new Date(activity.start_date || new Date()),
        averageSpeed: activity.average_speed || 0,
        maxSpeed: activity.max_speed || 0,
        averageHeartRate: activity.average_heartrate || null,
        maxHeartRate: activity.max_heartrate || null,
        polyline: activity.map?.summary_polyline || null,
        startLatLng: activity.start_latlng ? activity.start_latlng.join(',') : null,
        endLatLng: activity.end_latlng ? activity.end_latlng.join(',') : null,
      }));

    // Using createMany or individual creates depending on DB support and duplicates.
    // For MVP, we'll do individual creates to handle existing stravaIds gracefully or use connectOrCreate.
    for (const data of activitiesData) {
      try {
        await prisma.activity.upsert({
          where: { stravaId: data.stravaId },
          update: data,
          create: data,
        });
      } catch (error: any) {
        console.error(`[ActivityService] Error upserting activity ${data.stravaId}:`, error.message);
      }
    }

    // Trigger Gamification updates in background
    GamificationService.checkAndAward(userId).catch((err) => {
      console.error('[ActivityService] Error awarding achievements:', err.message);
    });

    // Ensure we have the internal UUID if an email was provided
    let internalUserId = userId;
    if (userId.includes('@')) {
      const user = await prisma.user.findUnique({ where: { email: userId } });
      if (user) internalUserId = user.id;
    }

    // Update lastSyncedAt
    await prisma.user.update({
      where: { id: internalUserId },
      data: { lastSyncedAt: new Date() },
    });

    return activitiesData.length;
  }

  static async saveStravaActivitiesByStravaId(stravaId: string, stravaActivities: any[]) {
    const user = await prisma.user.findUnique({
      where: { stravaId },
    });

    if (!user) throw new Error(`User with Strava ID ${stravaId} not found`);

    return this.saveStravaActivities(user.id, stravaActivities);
  }

  static async getRecentActivities(userId: string, limit: number = 5) {
    return prisma.activity.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      take: limit,
    });
  }
}
