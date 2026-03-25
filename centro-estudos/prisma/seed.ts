import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.ADMIN_PASSWORD ?? "admin123456";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@centroestudos.pt" },
    update: {
      name: "Admin",
      passwordHash,
    },
    create: {
      email: "admin@centroestudos.pt",
      name: "Admin",
      passwordHash,
    },
  });

  const sessionsCount = await prisma.session.count();

  if (sessionsCount === 0) {
    await prisma.session.createMany({
      data: [
        {
          title: "Apoio ao estudo de Matemática 9.º ano",
          description:
            "Sessão de reforço com foco em preparação para testes, resolução guiada e consolidação de exercícios.",
          category: "Matemática",
          tutorName: "Prof.ª Mariana Silva",
          location: "Sala Alfa",
          startAt: new Date("2025-01-13T17:00:00.000Z"),
          endAt: new Date("2025-01-13T18:30:00.000Z"),
          capacity: 12,
          isPublished: true,
        },
        {
          title: "Oficina de Português e escrita",
          description:
            "Trabalho de interpretação, gramática e produção escrita para 2.º e 3.º ciclos.",
          category: "Português",
          tutorName: "Prof. João Pereira",
          location: "Sala Beta",
          startAt: new Date("2025-01-15T16:30:00.000Z"),
          endAt: new Date("2025-01-15T18:00:00.000Z"),
          capacity: 10,
          isPublished: true,
        },
        {
          title: "Métodos de estudo e organização semanal",
          description:
            "Sessão transversal para melhorar autonomia, planeamento e preparação para avaliações.",
          category: "Método de estudo",
          tutorName: "Dra. Inês Costa",
          location: "Sala Horizonte",
          startAt: new Date("2025-01-17T17:30:00.000Z"),
          endAt: new Date("2025-01-17T18:30:00.000Z"),
          capacity: 16,
          isPublished: true,
        },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
