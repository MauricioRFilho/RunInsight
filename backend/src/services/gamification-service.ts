import prisma from '@/models/prisma';

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

    // Streak logic (basic version)
    // A more robust version would check consecutive days
  }
}
