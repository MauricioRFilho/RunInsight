import { PlanService } from '@/services/plan-service';
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

describe('PlanService - Adherence Score', () => {
  const userId = 'user-test-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 100 if no plans are found', async () => {
    (prisma.trainingPlan.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.activity.findMany as jest.Mock).mockResolvedValue([]);

    const score = await PlanService.calculateAdherenceScore(userId);
    expect(score).toBe(100);
  });

  it('should calculate perfect adherence (100) when all plans match activities', async () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const mockPlans = [
      { scheduledFor: today, targetDistance: 5000, type: 'Easy' },
      { scheduledFor: yesterday, targetDistance: 10000, type: 'Long' },
    ];

    const mockActivities = [
      { startDate: today, distance: 5000 },
      { startDate: yesterday, distance: 10000 },
    ];

    (prisma.trainingPlan.findMany as jest.Mock).mockResolvedValue(mockPlans);
    (prisma.activity.findMany as jest.Mock).mockResolvedValue(mockActivities);

    const score = await PlanService.calculateAdherenceScore(userId);
    expect(score).toBe(100);
  });

  it('should calculate partial adherence when distances differ', async () => {
    const today = new Date();
    
    // Plan 10km, Activity 8km -> 80% match
    const mockPlans = [{ scheduledFor: today, targetDistance: 10000, type: 'Long' }];
    const mockActivities = [{ startDate: today, distance: 8000 }];

    (prisma.trainingPlan.findMany as jest.Mock).mockResolvedValue(mockPlans);
    (prisma.activity.findMany as jest.Mock).mockResolvedValue(mockActivities);

    const score = await PlanService.calculateAdherenceScore(userId);
    expect(score).toBe(80);
  });

  it('should calculate 0 adherence if a plan has no matching activity', async () => {
    const today = new Date();
    
    const mockPlans = [{ scheduledFor: today, targetDistance: 5000, type: 'Easy' }];
    const mockActivities: any[] = [];

    (prisma.trainingPlan.findMany as jest.Mock).mockResolvedValue(mockPlans);
    (prisma.activity.findMany as jest.Mock).mockResolvedValue(mockActivities);

    const score = await PlanService.calculateAdherenceScore(userId);
    expect(score).toBe(0);
  });

  it('should handle activities on different days correctly', async () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const mockPlans = [
      { scheduledFor: today, targetDistance: 5000 },
      { scheduledFor: tomorrow, targetDistance: 5000 },
    ];
    
    // Only one activity matching "today"
    const mockActivities = [
      { startDate: today, distance: 5000 },
      { startDate: dayAfter, distance: 5000 }, // This is outside the plans
    ];

    (prisma.trainingPlan.findMany as jest.Mock).mockResolvedValue(mockPlans);
    (prisma.activity.findMany as jest.Mock).mockResolvedValue(mockActivities);

    const score = await PlanService.calculateAdherenceScore(userId);
    // (100 + 0) / 2 = 50
    expect(score).toBe(50);
  });
});
