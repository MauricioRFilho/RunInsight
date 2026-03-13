import prisma from '@/lib/prisma';

interface ActivityLike {
  distance: number;
  movingTime: number;
}

export class StatsService {
  /**
   * Calculates comprehensive stats for a user for the current year.
   */
  static async getYearlyStats(userId: string) {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const activities = await prisma.activity.findMany({
      where: {
        userId,
        startDate: { gte: startOfYear },
        type: 'Run',
      },
    });

    const totalDistance = activities.reduce((acc: number, act: ActivityLike) => acc + act.distance, 0);
    const totalRuns = activities.length;

    // Find best pace (min movingTime / distance for activities > 1km)
    let bestPaceInSeconds = 0;
    const validRuns = activities.filter((a: ActivityLike) => a.distance >= 1000);
    
    if (validRuns.length > 0) {
      const paces = validRuns.map((a: ActivityLike) => a.movingTime / (a.distance / 1000));
      bestPaceInSeconds = Math.min(...paces);
    }

    const formatPace = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return {
      totalDistance: Math.round(totalDistance / 1000), // in km
      totalRuns,
      bestPace: bestPaceInSeconds ? formatPace(bestPaceInSeconds) : 'N/A',
      year: now.getFullYear(),
    };
  }

  /**
   * Helper to get all stats at once.
   */
  static async getUserStats(userId: string) {
    const [yearly, records] = await Promise.all([
      this.getYearlyStats(userId),
      this.getPersonalRecords(userId),
    ]);

    return {
      ...yearly,
      ...records,
    };
  }

  /**
   * Identifies Personal Records (Best Efforts) for standard distances.
   */
  static async getPersonalRecords(userId: string) {
    const activities = await prisma.activity.findMany({
      where: { userId, type: 'Run' },
      orderBy: { startDate: 'desc' },
    });

    const records = {
      '5k': Infinity,
      '10k': Infinity,
      '21k': Infinity,
      '42k': Infinity,
    };

    const hasRecord = {
      '5k': false,
      '10k': false,
      '21k': false,
      '42k': false,
    };

    activities.forEach((activity: ActivityLike) => {
      const distKm = activity.distance / 1000;
      const pace = activity.movingTime / distKm;

      // 5k (Allowing 4.9k to 5.5k for rough matching)
      if (distKm >= 4.9 && distKm <= 5.5) {
        if (pace < records['5k']) {
          records['5k'] = pace;
          hasRecord['5k'] = true;
        }
      }
      // 10k
      if (distKm >= 9.8 && distKm <= 11) {
        if (pace < records['10k']) {
          records['10k'] = pace;
          hasRecord['10k'] = true;
        }
      }
      // 21k
      if (distKm >= 20.8 && distKm <= 23) {
        if (pace < records['21k']) {
          records['21k'] = pace;
          hasRecord['21k'] = true;
        }
      }
    });

    const formatTime = (paceSeconds: number, distanceKm: number) => {
      const totalSeconds = paceSeconds * distanceKm;
      const hours = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = Math.round(totalSeconds % 60);
      
      if (hours > 0) {
        return `${hours}h ${mins}m ${secs}s`;
      }
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return {
      best5k: hasRecord['5k'] ? formatTime(records['5k'], 5) : 'N/A',
      best10k: hasRecord['10k'] ? formatTime(records['10k'], 10) : 'N/A',
      best21k: hasRecord['21k'] ? formatTime(records['21k'], 21) : 'N/A',
    };
  }
}
