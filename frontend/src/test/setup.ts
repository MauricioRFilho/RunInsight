import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    activity: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  },
}));
