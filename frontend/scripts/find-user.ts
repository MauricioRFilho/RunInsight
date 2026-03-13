/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Inicialização segura para scripts CJS
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function findUser() {
  const stravaId = "65971729";
  // O e-mail provável do usuário baseado no contexto anterior
  const possibleEmail = "macmauricio@gmail.com"; 

  console.log(`🔍 Buscando usuário...`);
  
  try {
    const userByStrava = await prisma.user.findUnique({
      where: { stravaId },
      select: { id: true, email: true, stravaId: true, name: true }
    });

    if (userByStrava) {
      console.log('✅ Encontrado por Strava ID:');
      console.log(JSON.stringify(userByStrava, null, 2));
    } else {
      console.log('❌ NÃO encontrado por Strava ID.');
    }

    const userByEmail = await prisma.user.findUnique({
      where: { email: possibleEmail },
      select: { id: true, email: true, stravaId: true, name: true }
    });

    if (userByEmail) {
      console.log(`✅ Encontrado por E-mail (${possibleEmail}):`);
      console.log(JSON.stringify(userByEmail, null, 2));
    } else {
      console.log(`❌ NÃO encontrado por E-mail (${possibleEmail}).`);
      
      // Busca parcial por e-mail se não for o exato
      const partialUsers = await prisma.user.findMany({
        where: { email: { contains: 'mauricio' } },
        take: 5
      });
      console.log('--- Usuários similares encontrados ---');
      console.log(JSON.stringify(partialUsers, null, 2));
    }

  } catch (error) {
    console.error('❌ Erro na consulta:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

findUser();
