import prisma from '@/models/prisma';
import { Activity } from '@prisma/client';

export interface LoadAnalysisResult {
  currentWeekVolume: number;
  previousWeekVolume: number;
  isOverloaded: boolean;
  increasePercentage: number;
}

export class LoadAnalyzer {
  /**
   * Analyzes the training load for a user based on the 10% rule.
   */
  static async analyzeWeeklyLoad(userId: string): Promise<LoadAnalysisResult> {
    const now = new Date();
    const startOfCurrentWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    const startOfPreviousWeek = new Date(startOfCurrentWeek);
    startOfPreviousWeek.setDate(startOfPreviousWeek.getDate() - 7);

    const activities = await prisma.activity.findMany({
      where: {
        userId,
        startDate: {
          gte: startOfPreviousWeek,
        },
        type: 'Run',
      },
      select: {
        distance: true,
        startDate: true,
      },
    });

    let currentWeekVolume = 0;
    let previousWeekVolume = 0;

    activities.forEach((activity) => {
      if (activity.startDate >= startOfCurrentWeek) {
        currentWeekVolume += activity.distance;
      } else {
        previousWeekVolume += activity.distance;
      }
    });

    const increasePercentage = previousWeekVolume > 0 
      ? ((currentWeekVolume - previousWeekVolume) / previousWeekVolume) * 100 
      : 0;

    return {
      currentWeekVolume: currentWeekVolume / 1000, // in km
      previousWeekVolume: previousWeekVolume / 1000, // in km
      isOverloaded: increasePercentage > 10,
      increasePercentage: Math.round(increasePercentage * 100) / 100,
    };
  }
}
