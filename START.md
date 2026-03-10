# RunInsight – Running Training Analyzer

## Overview
RunInsight é uma plataforma de análise de treinos de corrida focada em atletas de endurance.  
O sistema permite importar atividades de corrida e gerar métricas de performance, evolução de treinamento e alertas de risco de lesão.

O objetivo do projeto é demonstrar habilidades em:

- Processamento de dados esportivos
- Visualização de métricas de performance
- Análise de carga de treino
- Desenvolvimento full stack

---

# Core Features

## 1. Importação de atividades
O sistema deve permitir importar treinos através de:

- Upload de arquivos `.gpx`
- Upload de arquivos `.fit`
- Integração futura com APIs (Strava, Garmin etc.)

### Dados extraídos
- distância
- duração
- pace médio
- elevação
- frequência cardíaca
- coordenadas GPS

---

# Dashboard de Treinamento

A tela principal deve apresentar métricas consolidadas do atleta.

### Métricas principais

- volume semanal (km)
- volume mensal
- pace médio
- frequência cardíaca média
- número de treinos

### Visualizações

- gráfico de distância semanal
- gráfico de pace médio
- gráfico de frequência cardíaca
- evolução de volume

---

# Análise de Carga de Treino

O sistema calcula o aumento de volume semanal.

### Regra inicial

Se aumento > 10%


## ALERTA DE RISCO DE LESÃO


Exemplo:

| Semana | Volume |
|------|------|
| 1 | 40km |
| 2 | 44km |
| 3 | 55km ⚠️ |

---

# Análise de Longões

Identificar características do treino longo.

### Métricas

- pace médio
- pace primeiros km
- pace últimos km
- desaceleração (%)

### Insights possíveis

- pacing inconsistente
- queda de performance
- fadiga muscular

---

# Visualização do Percurso

Mostrar o percurso do treino no mapa.

### Funcionalidades

- renderização da rota
- pontos de início e fim
- distância total
- elevação acumulada

---

# Possíveis Métricas Avançadas (v2)

- VO2 estimado
- zonas de frequência cardíaca
- carga de treino (Training Load)
- estimativa de tempo em maratona
- detecção de overtraining

---

# Stack Tecnológica

## Frontend
- React ou Next.js
- Tailwind ou Bootstrap
- Chart.js ou Recharts

## Backend
- Node.js
- Express

## Banco de Dados
- PostgreSQL

## Mapas
- Leaflet
ou
- Mapbox

---

# Estrutura de Projeto
runinsight
│
├── frontend
│ ├── dashboard
│ ├── activity-view
│ ├── charts
│
├── backend
│ ├── api
│ ├── services
│ ├── activity-parser
│
├── database
│ ├── schema.sql
│
└── docs
└── PROJECT_IDEA.md

# Integrações Externas

O sistema utiliza integrações com plataformas populares de corrida para importar dados de treino.

## Strava (integração principal)

Responsável por fornecer os dados reais das atividades realizadas pelo atleta.

Dados importados:

- distância
- duração
- pace médio
- frequência cardíaca
- elevação
- GPS / rota
- tipo de atividade
- data do treino

Fluxo:

Usuário conecta conta Strava → sistema importa atividades → dados são processados → métricas são exibidas no dashboard.

Objetivo:

Utilizar dados reais de corrida para análise de performance e carga de treino.

## Runna (integração de planejamento)

Utilizado para importar o plano de treinamento do atleta.

Dados importados:

- tipo de treino (easy run, interval, tempo, long run)
- distância planejada
- pace alvo
- dia do treino

Objetivo:

Permitir comparação entre treino planejado e treino executado.


# Planned vs Completed Training

Comparação entre treino planejado e treino realizado.

Exemplo:

Treino planejado (Runna):
- 12km
- pace 5:30/km

Treino realizado (Strava):
- 11.8km
- pace 5:20/km

Resultado:

- aderência ao plano
- análise de pacing
- análise de esforço


# MVP

Funcionalidades mínimas:

- autenticação com Strava
- importação automática de atividades
- upload manual de GPX (fallback)
- importação de plano de treino (Runna ou manual)
- dashboard semanal
- comparação entre treino planejado vs executado
- gráfico de volume semanal
- Marathon Readiness Score