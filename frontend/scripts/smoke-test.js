
async function smokeTest() {
  const userId = '65971729'; // ID simulado
  const baseUrl = 'http://localhost:3000/api';

  console.log('🚀 Iniciando Smoke Test nas APIs locais...');

  const endpoints = [
    `/analytics/load/${userId}`,
    `/analytics/stats/${userId}`,
    `/activities/${userId}`,
    `/analytics/gamification/${userId}`
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`);
      if (res.ok) {
        console.log(`✅ ${endpoint} - Status: ${res.status}`);
        const data = await res.json();
        console.log(`   Dados recebidos: ${JSON.stringify(data).substring(0, 50)}...`);
      } else {
        console.error(`❌ ${endpoint} - Status: ${res.status}`);
        const text = await res.text();
        console.error(`   Erro: ${text}`);
      }
    } catch (err) {
      console.error(`❌ ${endpoint} - Erro de conexão: ${err.message}`);
    }
  }
}

smokeTest();
