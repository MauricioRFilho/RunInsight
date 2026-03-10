import prisma from '@/models/prisma';

export class ActivityService {
  /**
   * Processes raw activities from Strava and saves them to the database.
   */
  static async saveStravaActivities(userId: string, stravaActivities: any[]) {
    const activitiesData = stravaActivities.map((activity) => ({
      userId,
      stravaId: activity.id.toString(),
      name: activity.name,
      distance: activity.distance,
      movingTime: activity.moving_time,
      elapsedTime: activity.elapsed_time,
      totalElevationGain: activity.total_elevation_gain,
      type: activity.type === 'Run' ? 'Run' : activity.type,
      startDate: new Date(activity.start_date),
      averageSpeed: activity.average_speed,
      maxSpeed: activity.max_speed,
      averageHeartRate: activity.average_heartrate,
      maxHeartRate: activity.max_heartrate,
      polyline: activity.map?.summary_polyline,
      startLatLng: activity.start_latlng ? activity.start_latlng.join(',') : null,
      endLatLng: activity.end_latlng ? activity.end_latlng.join(',') : null,
    }));

    // Using createMany or individual creates depending on DB support and duplicates.
    // For MVP, we'll do individual creates to handle existing stravaIds gracefully or use connectOrCreate.
    for (const data of activitiesData) {
      await prisma.activity.upsert({
        where: { stravaId: data.stravaId },
        update: data,
        create: data,
      });
    }

    return activitiesData.length;
  }
}
