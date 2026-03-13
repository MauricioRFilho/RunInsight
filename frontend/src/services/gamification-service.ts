import prisma from '@/lib/prisma';

export class GamificationService {
  /**
   * Updates user XP, level, and awards achievements.
   */
  static async checkAndAward(userId: string) {
    const activities = await prisma.activity.findMany({
      where: { userId, type: 'Run' },
      orderBy: { startDate: 'desc' },
      take: 10,
    });

    if (activities.length === 0) return;

    // 1. Calculate and update XP/Level for the last activities if not already done
    await this.refreshUserXP(userId);

    // 2. Check for Achievements based on REAL data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { achievements: true },
    });

    if (!user) return;

    // Achievement: First Real Run
    if (!user.achievements.some((a: any) => a.type === 'First Run')) {
      await prisma.achievement.create({
        data: {
          userId,
          type: 'First Run',
          name: 'Primeira Corrida Real!',
          description: 'Você sincronizou sua primeira atividade oficial do Strava.',
        },
      });
    }

    // Achievement: Speed Demon (Pace < 4:30 min/km for 5km+)
    // 4:30 min/km = 270 seconds/km
    const fastRun = activities.find((a: any) => a.distance >= 5000 && (a.movingTime / (a.distance / 1000)) < 270);
    if (fastRun && !user.achievements.some((a: any) => a.type === 'Speed Demon')) {
      await prisma.achievement.create({
        data: {
          userId,
          type: 'Speed Demon',
          name: 'Demônio da Velocidade',
          description: 'Completou 5km com pace abaixo de 4:30 min/km.',
        },
      });
    }

    // Achievement: Endurance King (Distance > 15km)
    const longRun = activities.find((a: any) => a.distance >= 15000);
    if (longRun && !user.achievements.some((a: any) => a.type === 'Endurance King')) {
      await prisma.achievement.create({
        data: {
          userId,
          type: 'Endurance King',
          name: 'Rei da Resistência',
          description: 'Completou um treino longo de mais de 15km.',
        },
      });
    }
  }

  /**
   * Recalculates total XP and level based on all activities.
   */
  static async refreshUserXP(userId: string) {
    const activities = await prisma.activity.findMany({
      where: { userId, type: 'Run' },
    });

    let totalXP = 0;
    for (const activity of activities) {
      totalXP += this.calculateActivityXP(activity);
    }

    const level = this.calculateLevelFromXP(totalXP);

    await prisma.user.update({
      where: { id: userId },
      data: { xp: totalXP, level },
    });
  }

  /**
   * XP Formula: (Moving Time in minutes) * (Intensity Factor)
   * Intensity Factor = (Average Speed / 3.0) -> Base pace of 5:33 min/km
   */
  static calculateActivityXP(activity: any): number {
    const minutes = activity.movingTime / 60;
    // Base intensity for a 5:30 pace (~3.0 m/s)
    const intensityFactor = Math.max(0.5, activity.averageSpeed / 3.0);
    
    return Math.round(minutes * intensityFactor * 10); // Scale by 10 for better numbers
  }

  /**
   * Level Formula: Based on cumulative XP
   */
  static calculateLevelFromXP(xp: number): number {
    // Level 1: 0 XP
    // Level 2: 100 XP
    // Level 3: 400 XP... Level = floor(sqrt(XP / 100)) + 1
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  static async calculateStreak(userId: string): Promise<number> {
    const activities = await prisma.activity.findMany({
      where: { userId, type: 'Run', distance: { gte: 3000 } },
      orderBy: { startDate: 'desc' },
      select: { startDate: true },
    });

    if (activities.length === 0) return 0;

    let streak = 0;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get unique dates for activities
    const uniqueDates = Array.from(new Set<number>(
      activities.map((a: { startDate: Date }) => {
        const d = new Date(a.startDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    )).sort((a: number, b: number) => b - a);

    if (uniqueDates.length === 0) return 0;

    // Check if the most recent activity was today or yesterday
    const firstActivityDate = new Date(uniqueDates[0]);
    const diffDays = Math.floor((currentDate.getTime() - firstActivityDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays > 1) return 0;

    streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
        const current = new Date(uniqueDates[i]);
        const next = new Date(uniqueDates[i + 1]);
        const diff = Math.floor((current.getTime() - next.getTime()) / (1000 * 3600 * 24));

        if (diff === 1) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
  }

  static async getGamificationData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    });

    const streak = await this.calculateStreak(userId);
    const achievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { dateEarned: 'desc' },
    });

    const currentLevelXP = Math.pow(user?.level ?? 1 - 1, 2) * 100;
    const nextLevelXP = Math.pow(user?.level ?? 1, 2) * 100;
    const progress = user ? ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 0;

    return {
      streak,
      xp: user?.xp ?? 0,
      level: user?.level ?? 1,
      progress: Math.min(100, Math.max(0, progress)),
      nextLevelXP,
      achievements,
    };
  }
}
