import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 開発環境での接続確認
if (process.env.NODE_ENV !== 'production') {
  prisma
    .$connect()
    .then(() => {
      console.log('Prisma connected successfully');
    })
    .catch((error) => {
      console.error('Prisma connection failed:', error);
    });
}
