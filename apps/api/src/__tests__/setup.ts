import { prisma } from '../config/database';

beforeAll(async () => {
  // Connect to test database or setup test environment
});

afterAll(async () => {
  // Clean up test database
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up data before each test
  await prisma.note.deleteMany();
  await prisma.user.deleteMany();
});
