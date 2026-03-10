import prisma from '@/models/prisma';

export class PlanService {
  static async getUpcomingPlans(userId: string) {
    return prisma.trainingPlan.findMany({
      where: {
        userId,
        scheduledFor: { gte: new Date() },
      },
      orderBy: { scheduledFor: 'asc' },
    });
  }

  static async createPlan(userId: string, data: any) {
    return prisma.trainingPlan.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  /**
   * Calculates adherence score (0-100) based on distance matching for the last 7 days.
   */
  static async calculateAdherenceScore(userId: string): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [plans, activities] = await Promise.all([
      prisma.trainingPlan.findMany({
        where: { userId, scheduledFor: { gte: sevenDaysAgo, lte: new Date() } },
      }),
      prisma.activity.findMany({
        where: { userId, startDate: { gte: sevenDaysAgo, lte: new Date() }, type: 'Run' },
      }),
    ]);

    if (plans.length === 0) return 100; // Perfect adherence if nothing was planned

    let totalScore = 0;

    plans.forEach((plan: any) => {
      // Find the activity on the same day
      const planDate = new Date(plan.scheduledFor).toDateString();
      const matchingActivity = activities.find((a: any) => new Date(a.startDate).toDateString() === planDate);

      if (matchingActivity) {
        // Compare distance (tolerance of 20%)
        const diff = Math.abs(matchingActivity.distance - plan.targetDistance);
        const matchRatio = Math.max(0, 1 - diff / plan.targetDistance);
        totalScore += matchRatio * 100;
      } else {
        totalScore += 0; // No activity performed for a planned day
      }
    });

    return Math.round(totalScore / plans.length);
  }
}
