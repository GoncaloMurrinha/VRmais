# Centro de Estudos Horizonte

Base funcional em `Next.js 16 + TypeScript` para um centro de estudos, com:

- site público
- área admin autenticada
- calendário de sessões
- biblioteca de fichas com upload
- Prisma + PostgreSQL

## O que existia

O repositório continha apenas o template inicial do `create-next-app` com `Next.js`, `React`, `TypeScript` e `Tailwind CSS v4`.

## O que foi criado

- homepage institucional
- páginas públicas: `/calendario`, `/fichas`, `/contactos`
- login admin em `/admin/login`
- dashboard admin em `/admin`
- gestão de sessões em `/admin/sessoes`
- upload e gestão de fichas em `/admin/fichas`
- proteção de rotas com `proxy.ts`
- autenticação admin com cookie assinado
- schema Prisma para admins, sessões e ficheiros
- seed inicial com utilizador admin e sessões de exemplo

## Setup

1. Instalar dependências:

```bash
npm install
```

2. Criar `.env.local` a partir de `.env.example`.

3. Garantir que o PostgreSQL está disponível e criar a base de dados indicada em `DATABASE_URL`.

4. Gerar o cliente Prisma:

```bash
npm run prisma:generate
```

5. Aplicar o schema na base de dados:

```bash
npx prisma db push
```

6. Carregar dados iniciais:

```bash
npm run prisma:seed
```

7. Arrancar o projeto:

```bash
npm run dev
```

## Credenciais iniciais

- Email: `admin@centroestudos.pt`
- Password: definida por `ADMIN_PASSWORD` no ficheiro de ambiente
- Valor por omissão na seed: `admin123456`

## Validação feita

- `npm run lint`
- `npm run build`

## Próximos passos naturais

- paginação e filtros no admin
- gestão de inscrições nas sessões
- editor de conteúdos institucionais
- armazenamento externo para uploads se quiseres sair do disco local
