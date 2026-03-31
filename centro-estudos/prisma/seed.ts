import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_NAME = "Admin";
const ADMIN_PASSWORD = "Admin123456!";

async function main() {
  console.log("A iniciar seed do utilizador administrador...");

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existingAdmin) {
    console.log(`Administrador ${ADMIN_EMAIL} já existe. A atualizar credenciais...`);
  } else {
    console.log(`Administrador ${ADMIN_EMAIL} não existe. A criar registo...`);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.adminUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      passwordHash,
    },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      passwordHash,
    },
  });

  console.log("Admin criado com sucesso");
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Nome: ${ADMIN_NAME}`);
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
