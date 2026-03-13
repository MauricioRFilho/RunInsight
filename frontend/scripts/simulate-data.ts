import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Simulando dados de teste...');

  // 1. Criar ou atualizar usuário de teste
  // Usamos o ID que apareceu no erro do usuário para facilitar o teste dele
  const stravaId = "65971729"; 
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

  // 2. Criar Atividades Fictícias (últimos 30 dias)
  const activities = [];
  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 2); // A cada 2 dias
    
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

  // Deletar antigas para não duplicar no mock
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
  console.log('🚀 Simulação concluída! Agora você pode testar localmente ou no Vercel.');
}

main()
  .catch((e) => {
    console.error('❌ Erro na simulação:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
