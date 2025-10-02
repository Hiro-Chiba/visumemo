import { PrismaClient } from '@prisma/client';

type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalWithPrisma;

const nodeEnv = process.env['NODE_ENV'] ?? 'production';

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error']
  });

if (nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}
