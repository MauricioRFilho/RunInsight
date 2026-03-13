import { PrismaClient } from '@prisma/client';

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

const prismaClientSingleton = () => {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('[Prisma] Ambientes de build/Vercel detectados. Ativando mock recursivo.');
    return createMock() as PrismaClient;
  }
  
  console.log('[Prisma] Inicializando cliente em runtime...');
  try {
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
  } catch (error) {
    console.error('[Prisma] Erro crítico ao instanciar PrismaClient:', error);
    return createMock() as PrismaClient;
  }
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
