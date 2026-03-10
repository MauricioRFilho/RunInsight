import prisma from '@/lib/prisma';

export class GamificationService {
  /**
   * Updates user streaks and awards achievements.
   */
  static async checkAndAward(userId: string) {
    const activities = await prisma.activity.findMany({
      where: { userId, type: 'Run' },
      orderBy: { startDate: 'desc' },
      take: 30,
    });

    if (activities.length === 0) return;

    // Check for "First Run" achievement
    const firstRunAchievement = await prisma.achievement.findFirst({
      where: { userId, type: 'First Run' },
    });

    if (!firstRunAchievement) {
      await prisma.achievement.create({
        data: {
          userId,
          type: 'First Run',
          name: 'Primeira Corrida!',
          description: 'Você completou sua primeira atividade sincronizada.',
        },
      });
    }

    // Check for "Weekly Volume" (e.g., 50km in a week)
    // This could be more complex, but for MVP let's do a simple count
    if (activities.length >= 5) {
      const fiveRunsAchievement = await prisma.achievement.findFirst({
        where: { userId, type: 'High Five' },
      });

      if (!fiveRunsAchievement) {
        await prisma.achievement.create({
          data: {
            userId,
            type: 'High Five',
            name: 'High Five!',
            description: 'Você completou 5 corridas no RunInsight.',
          },
        });
      }
    }

    // Streak logic (Refined)
    const streak = await this.calculateStreak(userId);
    if (streak >= 3) {
      const flashAchievement = await prisma.achievement.findFirst({
        where: { userId, type: 'Flash' },
      });

      if (!flashAchievement) {
        await prisma.achievement.create({
          data: {
            userId,
            type: 'Flash',
            name: 'Pace Seguro (Flash)',
            description: 'Você correu pelo menos 3km por 3 dias seguidos!',
          },
        });
      }
    }
  }

  static async calculateStreak(userId: string): Promise<number> {
    const activities = await prisma.activity.findMany({
      where: { userId, type: 'Run', distance: { gte: 3000 } },
      orderBy: { startDate: 'desc' },
      select: { startDate: true },
    });

    if (activities.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
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
    const streak = await this.calculateStreak(userId);
    const achievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { dateEarned: 'desc' },
    });

    return {
      streak,
      achievements,
    };
  }
}
