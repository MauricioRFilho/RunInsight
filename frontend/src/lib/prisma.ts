import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('[Prisma] Ambientes de build/Vercel detectados. Ativando mock recursivo.');
    
    const createMock = (): any => {
      return new Proxy(() => {}, {
        get: (_target, prop) => {
          if (prop === 'then') return undefined; // Proteção contra Promises
          return createMock();
        },
        apply: () => {
          return Promise.resolve(null);
        }
      });
    };
    
    return createMock() as PrismaClient;
  }
  
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
