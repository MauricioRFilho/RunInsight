import { GamificationService } from '@/services/gamification-service';
import prisma from '@/models/prisma';

// Mock values are already setup in setup.ts

describe('GamificationService - Streak Logic', () => {
  const userId = 'user-test-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a streak of 0 if no activities are found', async () => {
    (prisma.activity.findMany as jest.Mock).mockResolvedValue([]);
    
    const streak = await GamificationService.calculateStreak(userId);
    expect(streak).toBe(0);
  });

  it('should return a streak of 3 for 3 consecutive days of 3km+', async () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const dayBefore = new Date();
    dayBefore.setDate(today.getDate() - 2);

    (prisma.activity.findMany as jest.Mock).mockResolvedValue([
      { startDate: today.toISOString(), distance: 5000 },
      { startDate: yesterday.toISOString(), distance: 4000 },
      { startDate: dayBefore.toISOString(), distance: 3500 },
    ]);

    const streak = await GamificationService.calculateStreak(userId);
    expect(streak).toBe(3);
  });

  it('should break the streak if a day is missing', async () => {
    const today = new Date();
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(today.getDate() - 2);

    (prisma.activity.findMany as jest.Mock).mockResolvedValue([
      { startDate: today.toISOString(), distance: 5000 },
      { startDate: dayBeforeYesterday.toISOString(), distance: 4000 },
    ]);

    const streak = await GamificationService.calculateStreak(userId);
    expect(streak).toBe(1); // Only today counts as consecutive
  });

  it('should ignore activities with less than 3km', async () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // In a real scenario, prisma handles the gte: 3000 filter.
    // The mock should return what the database would return given the query.
    (prisma.activity.findMany as jest.Mock).mockResolvedValue([
      { startDate: today.toISOString(), distance: 5000 },
    ]);

    const streak = await GamificationService.calculateStreak(userId);
    expect(streak).toBe(1);
  });

  it('should return 0 if the most recent activity is older than 1 day', async () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    (prisma.activity.findMany as jest.Mock).mockResolvedValue([
      { startDate: threeDaysAgo.toISOString(), distance: 5000 },
    ]);

    const streak = await GamificationService.calculateStreak(userId);
    expect(streak).toBe(0);
  });
});
