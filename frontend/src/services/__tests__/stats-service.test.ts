/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StatsService } from '../stats-service';
import prisma from '@/lib/prisma';

describe('StatsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate yearly stats correctly', async () => {
    const mockActivities = [
      { distance: 5000, movingTime: 1500, type: 'Run', startDate: new Date() },
      { distance: 10000, movingTime: 3000, type: 'Run', startDate: new Date() },
    ];

    (prisma.activity.findMany as any).mockResolvedValue(mockActivities);

    const stats = await StatsService.getYearlyStats('user-1');

    expect(stats.totalDistance).toBe(15); // (5000+10000)/1000
    expect(stats.totalRuns).toBe(2);
    expect(stats.bestPace).toBe('5:00'); // 1500 / 5 = 300s = 5:00
  });

  it('should handle no activities gracefully', async () => {
    (prisma.activity.findMany as any).mockResolvedValue([]);

    const stats = await StatsService.getYearlyStats('user-1');

    expect(stats.totalDistance).toBe(0);
    expect(stats.bestPace).toBe('N/A');
  });

  it('should return aggregated user stats', async () => {
    const mockActivities = [
        { distance: 5000, movingTime: 1500, type: 'Run', startDate: new Date() },
    ];
    (prisma.activity.findMany as any).mockResolvedValue(mockActivities);

    const stats = await StatsService.getUserStats('user-1');

    expect(stats).toHaveProperty('totalDistance');
    expect(stats).toHaveProperty('best5k');
  });
});
