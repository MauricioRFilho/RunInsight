import { jest, describe, it, expect } from '@jest/globals';
import { StatsService } from '../src/services/stats-service';
import prisma from '../src/models/prisma';

jest.mock('../src/models/prisma', () => ({
  activity: {
    findMany: jest.fn(),
  },
}));

describe('StatsService PR Extraction', () => {
  it('should extract best 5k and 10k times correctly', async () => {
    const mockActivities = [
      { distance: 5000, movingTime: 1200, startDate: new Date(), type: 'Run' }, // 20:00 (pace 4:00)
      { distance: 5100, movingTime: 1530, startDate: new Date(), type: 'Run' }, // 30:00 (pace 5:00)
      { distance: 10000, movingTime: 3000, startDate: new Date(), type: 'Run' }, // 50:00 (pace 5:00)
      { distance: 10200, movingTime: 2448, startDate: new Date(), type: 'Run' }, // 40:48 (pace 4:00)
    ];

    (prisma.activity.findMany as jest.Mock).mockResolvedValue(mockActivities);

    const records = await StatsService.getPersonalRecords('user-1');

    expect(records.best5k).toBe('20:00');
    expect(records.best10k).toBe('40:00');
    expect(records.best21k).toBe('N/A');
  });
});
