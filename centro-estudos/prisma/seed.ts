import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function readAdminCredentials() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!email || !password || password.length < 8) {
    throw new Error("Define ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 8 caracteres) antes de correr o seed.");
  }

  return { email, password, name };
}

async function main() {
  const { email, password, name } = readAdminCredentials();

  console.log("A iniciar seed do utilizador administrador...");

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log(`Administrador ${email} já existe. A atualizar credenciais...`);
  } else {
    console.log(`Administrador ${email} não existe. A criar registo...`);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
    },
    create: {
      email,
      name,
      passwordHash,
    },
  });

  console.log("Admin criado com sucesso");
  console.log(`Email: ${email}`);
  console.log(`Nome: ${name}`);
}

main()
  .then(async () => {
    console.log("Seed concluído sem erros.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Erro ao executar seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
