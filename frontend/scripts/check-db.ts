/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkUser() {
  const stravaId = "65971729";
  console.log(`🔍 Verificando Strava ID: ${stravaId}...`);
  
  try {
    const user = await prisma.user.findUnique({
      where: { stravaId },
      select: { id: true, email: true, stravaId: true, name: true }
    });

    if (user) {
      console.log('✅ Usuário encontrado!');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('❌ Usuário NÃO encontrado com esse Strava ID.');
      
      const allUsers = await prisma.user.findMany({
        take: 5,
        select: { id: true, email: true, stravaId: true }
      });
      console.log('--- Últimos 5 usuários no banco ---');
      console.log(JSON.stringify(allUsers, null, 2));
    }
  } catch (error) {
    console.error('❌ Erro na consulta:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
