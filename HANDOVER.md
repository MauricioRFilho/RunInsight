# RunInsight - Handover & Roadmap Técnico 🚀

Este documento detalha os 5 passos críticos para a finalização do MVP do RunInsight, permitindo uma transição suave entre máquinas de desenvolvimento.

---

## 1. Strava Webhooks (Sincronização Real-time)
O objetivo é eliminar a necessidade de sincronização manual.
- **Ação:** Implementar endpoint `POST /api/webhook/strava` no backend.
- **Validação:** O Strava envia um "challenge" que o backend deve responder para validar a URL.
- **Processamento:** Ao receber o evento `activity:create`, disparar o `StravaService.fetchActivities` para o usuário dono da atividade.

## 2. Social Sharing (WOW Factor)
Gerar um relatório visual para Instagram/TikTok.
- **Ação:** Criar um componente de "Card Social" no frontend.
- **Tecnologia Sugerida:** `html-to-image` ou renderização via Canvas no frontend.
- **Design:** Deve incluir o logo **RunInsight**, o volume da semana e o selo "Pace Seguro" da regra dos 10%.

## 3. Autenticação Real (NextAuth/JWT)
Sair do ID fixo para segurança e multi-usuário.
- **Frontend:** Implementar `next-auth` com o provider do Strava.
- **Backend:** Proteger as rotas `/api/analytics` com um middleware que valida o JWT/Session.
- **Banco:** Vincular o `stravaId` retornado no login ao modelo `User` do Prisma.

## 4. Refinamento de Gamificação (Streaks)
Tornar o app viciante via consistência.
- **Ação:** Criar função no `GamificationService` que verifica dias seguidos de atividade.
- **Regra:** Se o usuário correr pelo menos 3km por dia por 3 dias seguidos → Ganha Badge "Flash".
- **UI:** Exibir o contador de "X dias seguidos" no header do Dashboard.

## 5. Deployment (Vercel + Supabase)
Colocar o projeto em produção.
- **Database:** Migrar do Local PostgreSQL para um **Supabase** ou **Prisma Postgres**.
- **Frontend/Backend:** Configurar monorepo na **Vercel** ou separar Backend no **Render**.
- **Segurança:** Configurar todas as `secrets` (IDs e Secrets do Strava) no painel administrativo do host.

---

## 🏁 Checklist de Transição de Máquina
Ao chegar na nova máquina:
1. [ ] Instalar Docker ou PostgreSQL Local.
2. [ ] Clonar Repo e rodar `npm install` nos dois diretórios.
3. [ ] Copiar os `.env` (certifique-se de salvá-los em um local seguro antes de trocar).
4. [ ] Rodar `npx prisma migrate dev` no backend.
5. [ ] Rodar `npm run dev` e validar o Dashboard.
