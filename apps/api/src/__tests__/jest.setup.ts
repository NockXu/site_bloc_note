import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { prisma } from '../config/database';

// Mock de PrismaClient
jest.mock('../config/database', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
  jest.clearAllMocks();
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
