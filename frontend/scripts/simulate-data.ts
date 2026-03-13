/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Simulando dados de teste...');

  // ID que apareceu nos logs do usuário
  const stravaId = "65971729"; 
  
  try {
    const user = await prisma.user.upsert({
      where: { stravaId },
      update: {},
      create: {
        email: 'tester@runinsight.com',
        name: 'Simulador RunInsight',
        stravaId: stravaId,
      },
    });

    console.log(`✅ Usuário criado/verificado: ${user.id} (Strava: ${stravaId})`);

    // 2. Criar Atividades Fictícias
    const activities = [];
    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i * 2);
      
      activities.push({
        userId: user.id,
        name: `Corrida de Simulação ${i + 1}`,
        distance: 5000 + Math.random() * 5000,
        movingTime: 1800 + Math.random() * 1200,
        elapsedTime: 2000 + Math.random() * 1200,
        totalElevationGain: Math.random() * 100,
        type: 'Run',
        startDate: date,
        averageSpeed: 3.5,
        maxSpeed: 5.0,
        stravaId: `mock-${stravaId}-${i}`,
      });
    }

    await prisma.activity.deleteMany({
      where: { userId: user.id, stravaId: { startsWith: 'mock-' } }
    });

    await prisma.activity.createMany({
      data: activities,
    });

    console.log(`✅ ${activities.length} atividades simuladas.`);

    // 3. Criar Planos de Treino
    const plans = [
      {
        userId: user.id,
        type: 'Intervalado',
        targetDistance: 8000,
        targetPace: '4:30/km',
        scheduledFor: new Date(new Date().setDate(new Date().getDate() + 1)),
      },
      {
        userId: user.id,
        type: 'Longão',
        targetDistance: 15000,
        targetPace: '5:45/km',
        scheduledFor: new Date(new Date().setDate(new Date().getDate() + 3)),
      }
    ];

    await prisma.trainingPlan.deleteMany({ where: { userId: user.id } });
    await prisma.trainingPlan.createMany({ data: plans });

    console.log('✅ Planos de treino simulados.');
    console.log('🚀 Simulação concluída!');
  } catch (error) {
    console.error('❌ Erro na simulação:', error.message);
    process.exit(1);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
