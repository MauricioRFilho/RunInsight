import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  let client;
  try {
    console.log('[TestPrisma] Tentando inicializar PrismaClient');
    client = new PrismaClient();
    console.log('[TestPrisma] PrismaClient inicializado, tentando query simples');
    
    // Teste de conexão simples sem query complexa
    const result = await client.$queryRaw`SELECT 1 as connected`;
    
    return NextResponse.json({
      status: 'ok',
      connected: result,
      dbUrl: process.env.DATABASE_URL ? 'available' : 'missing'
    });
  } catch (error: any) {
    console.error('[TestPrisma] Erro:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message,
      code: error.code,
      meta: error.meta
    }, { status: 500 });
  } finally {
    if (client) await client.$disconnect();
  }
}
