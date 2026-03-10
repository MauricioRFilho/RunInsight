# Guia de Contribuição - RunInsight 🏃‍♂️

Bem-vindo ao RunInsight! Este guia ajudará você a configurar o ambiente de desenvolvimento em qualquer máquina.

## 🛠️ Pré-requisitos
- **Node.js** (v18 ou superior)
- **NPM** ou **PNPM**
- **Docker** (opcional, para o PostgreSQL) ou uma instância do **PostgreSQL** rodando.
- **Conta no Strava** (para criar uma aplicação de API).

---

## 🚀 Configuração Rápida

### 1. Clonar o Repositório
```bash
git clone https://github.com/MauricioRFilho/RunInsight.git
cd RunInsight
```

### 2. Configurar o Backend
```bash
cd backend
npm install
cp .env.example .env
```
> [!IMPORTANT]
> Edite o arquivo `.env` com suas credenciais do Strava e a URL do seu banco de dados PostgreSQL.

**Inicializar Banco de Dados:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Configurar o Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
```
> [!NOTE]
> No frontend, configure `NEXT_PUBLIC_API_URL=http://localhost:3001/api`.

---

## 💻 Fluxo de Desenvolvimento

### Rodar Backend
```bash
cd backend
npm run dev
```

### Rodar Frontend
```bash
cd frontend
npm run dev
```

O Dashboard estará disponível em `http://localhost:3000`.

---

## 🧪 Padrões de Código
- **Commits:** Siga o padrão *Conventional Commits* (ex: `feat:`, `fix:`, `docs:`).
- **TypeScript:** Todos os novos arquivos devem ser em `.ts` ou `.tsx`.
- **Estilo:** Utilizamos Tailwind CSS para o UI e Clean Architecture no Backend.

---

## 📤 Como Contribuir
1. Crie uma Branch: `git checkout -b feature/minha-melhoria`
2. Faça o Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
3. Push: `git push origin feature/minha-melhoria`
4. Abra um Pull Request.
