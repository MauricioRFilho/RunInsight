import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// Mock prisma for all tests if needed, or handle per test
import prisma from '@/models/prisma';

jest.mock('@/models/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    activity: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
    achievement: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));
