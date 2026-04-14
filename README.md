# Content Creator Assistant 🎬

Ferramenta completa para criadores de conteúdo de **dark channels** no YouTube. Gere ideias, crie roteiros, otimize SEO, gerencie links de afiliados e planeje seu calendário editorial — tudo com apoio de Inteligência Artificial.

## 🚀 Funcionalidades

- **Dashboard** — Visão geral com estatísticas e ações rápidas
- **Gerador de Ideias** — Gera ideias de vídeo com IA (OpenAI) ou modo demo
- **Roteiros** — Cria roteiros completos prontos para gravação
- **Otimização SEO** — Títulos, descrições e tags otimizadas para YouTube
- **Links de Afiliados** — CRUD completo com geração de bloco de descrição
- **Calendário Editorial** — Visualização mensal e em lista com filtros de plataforma

## 🛠️ Tecnologias

- **Next.js 14** (App Router) + TypeScript
- **Material UI (MUI)** — tema dark personalizado
- **PostgreSQL** via Docker
- **Prisma ORM**
- **OpenAI API** com fallback para modo demo

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- (Opcional) Chave de API da OpenAI

## ⚙️ Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd content-creator-assistant
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
DATABASE_URL="postgresql://creator:creator123@localhost:5432/content_creator?schema=public"
OPENAI_API_KEY="sk-..."          # opcional — sem ela, o app roda em modo demo
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Suba o banco de dados

```bash
docker-compose up -d
```

### 5. Execute as migrações do Prisma

```bash
npm run db:generate
npm run db:push
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## 🐳 Docker

O banco de dados PostgreSQL roda via Docker Compose:

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f postgres
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── affiliate-links/    # CRUD links de afiliados
│   │   ├── content-calendar/   # CRUD calendário editorial
│   │   ├── generate-ideas/     # Geração de ideias com IA
│   │   ├── generate-script/    # Geração de roteiros com IA
│   │   └── optimize-seo/       # Otimização SEO com IA
│   ├── calendar/               # Página calendário
│   ├── ideas/                  # Página ideias
│   ├── links/                  # Página links de afiliados
│   ├── scripts/                # Página roteiros
│   ├── seo/                    # Página SEO
│   ├── layout.tsx              # Layout raiz com sidebar e header
│   └── page.tsx                # Dashboard
├── components/
│   ├── calendar/               # CalendarView
│   ├── dashboard/              # StatsCard, QuickActions
│   ├── ideas/                  # IdeaGenerator, IdeaCard
│   ├── layout/                 # Header, Sidebar, ThemeRegistry
│   ├── links/                  # LinkManager
│   ├── scripts/                # ScriptGenerator, ScriptEditor
│   └── seo/                    # SeoOptimizer
├── lib/
│   ├── openai.ts               # Cliente OpenAI
│   ├── prisma.ts               # Cliente Prisma (singleton)
│   └── theme.ts                # Tema MUI dark
└── types/
    └── index.ts                # Interfaces TypeScript
prisma/
└── schema.prisma               # Schema do banco de dados
```

## 🔑 Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | Sim | URL de conexão PostgreSQL |
| `OPENAI_API_KEY` | Não | Chave API OpenAI. Sem ela, o app usa dados mock |
| `NEXT_PUBLIC_APP_URL` | Não | URL pública da aplicação |

## 🧪 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linter
npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Aplicar schema ao banco
npm run db:migrate   # Criar migration
npm run db:studio    # Abrir Prisma Studio
```

## 🗺️ Roadmap

- [ ] Autenticação de usuários
- [ ] Analytics de visualizações e cliques nos links
- [ ] Integração com YouTube Data API
- [ ] Export de roteiros para PDF
- [ ] Agendamento automático de publicações
- [ ] Dashboard com gráficos de desempenho
- [ ] Suporte a múltiplos canais
Assistant personal for content creations 
