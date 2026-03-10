# RunInsight 🏃‍♂️💨

Plataforma de análise de treinos de corrida focada em atletas de endurance, permitindo monitoramento de carga e gamificação.

## 🚀 Funcionalidades Principais

- **Webhooks Strava (Real-time)**: Sincronização automática de atividades assim que concluídas.
- **Análise de Carga Segura**: Algoritmos que detectam sobrecarga de treino (regra dos 10%).
- **Social Sharing**: Geração de cards visuais premium para Instagram e TikTok.
- **Autenticação Strava**: Login seguro via NextAuth.
- **Gamificação**: Sistema de badges e streaks (conquiste a medalha "Flash" com consistência).

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 15, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL.
- **Integração**: Strava API v3.
- **Testes**: Jest, Supertest.

## 📦 Instalação e Setup

Consulte o [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) para detalhes de configuração de ambiente.

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   # Na raiz
   npm install
   # No frontend e backend
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Configure o `.env` seguindo os templates.
4. Execute as migrações do banco:
   ```bash
   cd backend && npx prisma migrate dev
   ```

## 🧪 Testes Automatizados

O RunInsight segue uma política de testes rigorosa para garantir a estabilidade das métricas de performance.

```bash
cd backend
npm test
```

Os testes cobrem:
- Validação de Webhooks.
- Algoritmos de Streak e Gamificação.
- Sincronização de atividades.

---
Desenvolvido com foco em performance e consistência.
