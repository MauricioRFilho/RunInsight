/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const createMock = (errorInfo?: string): any => {
  return new Proxy(() => {}, {
    get: (_target, prop) => {
      if (prop === 'then') return undefined;
      // Se tentarem acessar propriedades de dados (como .filter), vai estourar aqui com o erro real
      if (typeof prop === 'string' && ['filter', 'map', 'reduce'].includes(prop)) {
        throw new Error(`Prisma is running in MOCK mode due to initialization error: ${errorInfo}`);
      }
      return createMock(errorInfo);
    },
    apply: () => {
      return Promise.resolve(null);
    }
  });
};

const prismaClientSingleton = () => {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return createMock('Build phase mock');
  }
  
  console.log('[Prisma] Inicializando cliente em runtime...');
  if (!process.env.DATABASE_URL) {
    console.error('[Prisma] DATABASE_URL não encontrada no ambiente!');
  }

  try {
    // Para Prisma 7, geralmente basta instanciar se o DATABASE_URL estiver no ambiente
    // O erro 500 generalizado pode vir de uma falha de conexão aqui.
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const client = new PrismaClient({ adapter });

    console.log('[Prisma] Cliente instanciado com sucesso usando adaptador PrismaPg.');
    return client;
  } catch (error: any) {
    console.error('[Prisma] Erro crítico ao instanciar PrismaClient:', error.message);
    console.error('[Prisma] Stack trace:', error.stack);
    return createMock(error.message);
  }
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
