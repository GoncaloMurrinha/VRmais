# Centro de Estudos VR+

Site de um centro de estudos em `Next.js 16 + TypeScript`, com:

- site público (`/`, `/fichas`, `/calendario`, `/sobre`, `/contactos`)
- dashboard do professor em `/admin` (sessões, fichas, fotografias de "Quem somos")
- Prisma + PostgreSQL em **Neon**
- PDFs e fotografias em **Vercel Blob**

## Serviços necessários

| Serviço | Para quê | Variáveis |
|---|---|---|
| Neon (Postgres) | utilizadores, sessões e registo das fichas | `DATABASE_URL`, `DATABASE_URL_UNPOOLED` |
| Vercel Blob | ficheiros (PDFs, imagens) | `BLOB_READ_WRITE_TOKEN` |
| — | assinatura do cookie de admin | `AUTH_SECRET` |

Os uploads vão diretamente do browser para o Vercel Blob (não passam pela função do Next), por isso não há o limite de 4,5 MB da Vercel. O limite por ficheiro é definido em `src/lib/blob-storage.ts`.

## Setup local

1. `npm install`
2. Copiar `.env.example` para `.env.local` e preencher (instruções dentro do ficheiro).
3. Aplicar as migrações e criar o administrador:

```bash
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
```

O seed lê `ADMIN_EMAIL` e `ADMIN_PASSWORD` (mínimo 8 caracteres) do ambiente.

4. `npm run dev`

## Deploy na Vercel

1. Importar o repositório e definir a *Root Directory* como `centro-estudos`.
2. Em **Storage**, criar um *Blob store* (público) e ligá-lo ao projeto. A Vercel cria `BLOB_READ_WRITE_TOKEN` sozinha.
3. Em **Storage**, criar uma base de dados Neon e ligá-la ao projeto (cria `DATABASE_URL` e `DATABASE_URL_UNPOOLED`). Definir também `AUTH_SECRET`.
4. O `npm run build` corre `prisma migrate deploy` antes de compilar.

## Segredos

Nunca fazer commit de ficheiros `.env*` (exceto `.env.example`). O `.gitignore` já os ignora.
