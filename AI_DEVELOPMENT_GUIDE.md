# AI Development Guide – RunInsight

Este documento instrui assistentes de IA utilizados no desenvolvimento do projeto **RunInsight**.

Objetivo: garantir consistência técnica, arquitetura adequada e foco em um produto de **sports technology (sportstech)**.

A IA deve priorizar:

- código limpo
- separação clara de responsabilidades
- arquitetura escalável
- uso eficiente de APIs externas
- foco em análise de dados de corrida

---

# Project Overview

RunInsight é uma plataforma de análise de treinos de corrida que integra dados de atividades esportivas para gerar métricas de performance, carga de treino e insights para atletas de endurance.

O sistema deve integrar principalmente com:

- Strava (dados de corrida)
- Runna (planos de treino)

---

# Arquitetura do Projeto

Utilizar arquitetura modular com separação clara entre camadas.

## Estrutura recomendada
runinsight

backend
│
├── src
│ ├── controllers
│ ├── services
│ ├── integrations
│ │ ├── strava
│ │ └── runna
│ ├── analytics
│ ├── models
│ ├── repositories
│ ├── middleware
│ └── routes

frontend
│
├── components
├── pages
├── services
├── hooks
└── charts

database
│
├── migrations
└── schema.sql


---

# Backend Stack

A IA deve utilizar preferencialmente:

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM

Padrões:

- Service Layer Pattern
- Repository Pattern
- Controllers apenas para HTTP handling

---

# Frontend Stack

- Next.js
- React
- TypeScript
- Tailwind ou Bootstrap
- Chart.js ou Recharts

O frontend deve consumir APIs REST do backend.

---

# Modelagem do Banco de Dados

Banco: PostgreSQL
