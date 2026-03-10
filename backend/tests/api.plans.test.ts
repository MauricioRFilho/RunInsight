import request from 'supertest';
import app from '../src/index';
import prisma from '@/models/prisma';

// Mock Prisma
jest.mock('@/models/prisma', () => ({
  __esModule: true,
  default: {
    trainingPlan: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    activity: {
      findMany: jest.fn(),
    },
  },
}));

describe('Plans API', () => {
  const userId = 'user-api-test';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/plans/:userId should return plans', async () => {
    const mockPlans = [{ id: '1', type: 'Run', targetDistance: 5000 }];
    (prisma.trainingPlan.findMany as jest.Mock).mockResolvedValue(mockPlans);

    const res = await request(app).get(`/api/plans/${userId}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockPlans);
  });

  it('POST /api/plans/:userId should create a plan', async () => {
    const newPlan = { type: 'Long', targetDistance: 10000, scheduledFor: new Date().toISOString() };
    const savedPlan = { id: '2', ...newPlan, userId };
    
    (prisma.trainingPlan.create as jest.Mock).mockResolvedValue(savedPlan);

    const res = await request(app)
      .post(`/api/plans/${userId}`)
      .send(newPlan);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(savedPlan);
  });

  it('GET /api/plans/adherence/:userId should return adherence score', async () => {
    // Mocking empty plans to get simple 100 score from PlanService
    (prisma.trainingPlan.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.activity.findMany as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get(`/api/plans/adherence/${userId}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ score: 100 });
  });
});
