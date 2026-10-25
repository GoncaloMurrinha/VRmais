// Aplica as migrações do Prisma, mas só nos deploys de produção da Vercel.
// Os previews partilham a mesma base de dados e, ao correrem migrações em paralelo,
// ficam presos no bloqueio do Prisma (erro P1002).
import { spawnSync } from "node:child_process";

const vercelEnv = process.env.VERCEL_ENV;

if (vercelEnv && vercelEnv !== "production") {
  console.log(`Ambiente "${vercelEnv}": a saltar as migrações (só correm em produção).`);
  process.exit(0);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], { stdio: "inherit" });

process.exit(result.status ?? 1);
