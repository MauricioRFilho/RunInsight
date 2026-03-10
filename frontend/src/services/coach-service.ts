import prisma from '@/lib/prisma';

export class CoachService {
  /**
   * Generates feedback using an LLM (simulated for now, can be replaced with Gemini/OpenAI API).
   */
  static async generateFeedback(userId: string): Promise<string> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [plans, activities, loadData] = await Promise.all([
      prisma.trainingPlan.findMany({
        where: { userId, scheduledFor: { gte: sevenDaysAgo } },
        orderBy: { scheduledFor: 'desc' },
      }),
      prisma.activity.findMany({
        where: { userId, startDate: { gte: sevenDaysAgo }, type: 'Run' },
        orderBy: { startDate: 'desc' },
      }),
      // Assuming a simplistic check for overload from the recent activities
      prisma.activity.findMany({
        where: { userId, startDate: { gte: sevenDaysAgo } },
      })
    ]);

    // This is where we would call the LLM API with a prompt like:
    // "Com base nos treinos planejados: ${JSON.stringify(plans)} e realizados: ${JSON.stringify(activities)}, 
    // gere um feedback curto e motivador em português (PT-BR) no estilo treinador de corrida."

    if (plans.length === 0 && activities.length === 0) {
      return "Parece que você ainda não começou sua jornada esta semana. Que tal agendar um treino leve para começar?";
    }

    if (activities.length > 0 && plans.length === 0) {
      return "Ótimo volume de treinos! Tente agendar algumas metas manuais para que eu possa te ajudar a manter a consistência.";
    }

    const lastPlan = plans[0];
    const lastActivity = activities[0];

    if (lastPlan && lastActivity && new Date(lastPlan.scheduledFor).toDateString() === new Date(lastActivity.startDate).toDateString()) {
      const diff = Math.abs(lastActivity.distance - lastPlan.targetDistance);
      if (diff < 500) {
        return "Execução perfeita no treino de hoje! Aderência total ao plano. Continue assim que a evolução é garantida.";
      } else if (lastActivity.distance > lastPlan.targetDistance) {
        return "Você superou a distância planejada! Cuidado para não exagerar na carga muito rápido. Monitore seu cansaço.";
      } else {
        return "Treino concluído, mas com distância menor que o planejado. O importante é a constância, ajuste os próximos dias se necessário.";
      }
    }

    return "Sua evolução está constante. Lembre-se de respeitar os dias de descanso para evitar lesões e manter o pace seguro.";
  }

  static async getCoachFeedback(userId: string): Promise<string> {
    return this.generateFeedback(userId);
  }
}
