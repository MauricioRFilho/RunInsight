import { CoachService } from '@/services/coach-service';
import prisma from '@/models/prisma';

jest.mock('@/models/prisma', () => ({
  __esModule: true,
  default: {
    trainingPlan: {
      findMany: jest.fn(),
    },
    activity: {
      findMany: jest.fn(),
    },
  },
}));

describe('CoachService', () => {
  const userId = 'coach-test-user';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should give introductory feedback when no data exists', async () => {
    (prisma.trainingPlan.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.activity.findMany as jest.Mock).mockResolvedValue([]);

    const feedback = await CoachService.generateFeedback(userId);
    expect(feedback).toContain('ainda não começou sua jornada');
  });

  it('should congratulate on perfect adherence', async () => {
    const today = new Date();
    (prisma.trainingPlan.findMany as jest.Mock).mockResolvedValue([{
      scheduledFor: today,
      targetDistance: 5000
    }]);
    (prisma.activity.findMany as jest.Mock).mockResolvedValue([{
      startDate: today,
      distance: 5000,
      type: 'Run'
    }]);

    const feedback = await CoachService.generateFeedback(userId);
    expect(feedback).toContain('Execução perfeita');
  });

  it('should warn about overdoing distance', async () => {
    const today = new Date();
    (prisma.trainingPlan.findMany as jest.Mock).mockResolvedValue([{
      scheduledFor: today,
      targetDistance: 5000
    }]);
    (prisma.activity.findMany as jest.Mock).mockResolvedValue([{
      startDate: today,
      distance: 7000,
      type: 'Run'
    }]);

    const feedback = await CoachService.generateFeedback(userId);
    expect(feedback).toContain('superou a distância planejada');
  });
});
