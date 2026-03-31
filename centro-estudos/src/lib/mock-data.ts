import type { AboutPhoto, Resource, Session } from "@prisma/client";

const now = new Date();

function hoursFromNow(hours: number) {
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

export const mockSessions: Session[] = [
  {
    id: "mock-session-1",
    title: "Apoio ao estudo de Matemática 9.º ano",
    description:
      "Sessão de reforço com foco em preparação para testes, resolução guiada e consolidação de exercícios.",
    category: "Matemática",
    tutorName: "Prof.ª Mariana Silva",
    location: "Sala Alfa",
    startAt: hoursFromNow(24),
    endAt: hoursFromNow(25.5),
    capacity: 12,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mock-session-2",
    title: "Oficina de Português e escrita",
    description: "Trabalho de interpretação, gramática e produção escrita para 2.º e 3.º ciclos.",
    category: "Português",
    tutorName: "Prof. João Pereira",
    location: "Sala Beta",
    startAt: hoursFromNow(48),
    endAt: hoursFromNow(49.5),
    capacity: 10,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mock-session-3",
    title: "Métodos de estudo e organização semanal",
    description: "Sessão transversal para melhorar autonomia, planeamento e preparação para avaliações.",
    category: "Método de estudo",
    tutorName: "Dra. Inês Costa",
    location: "Sala Horizonte",
    startAt: hoursFromNow(72),
    endAt: hoursFromNow(73),
    capacity: 16,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockResources: Resource[] = [
  {
    id: "mock-resource-1",
    title: "Ficha de revisão de equações",
    description: "Conjunto de exercícios progressivos para rever equações e problemas aplicados.",
    category: "Matemática",
    fileName: "ficha-equacoes.pdf",
    filePath: "#",
    mimeType: "application/pdf",
    sizeBytes: 184320,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mock-resource-2",
    title: "Guia de compreensão leitora",
    description: "Ficha de trabalho para interpretação de texto, vocabulário e resposta estruturada.",
    category: "Português",
    fileName: "guia-compreensao.pdf",
    filePath: "#",
    mimeType: "application/pdf",
    sizeBytes: 212992,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockAboutPhotos: AboutPhoto[] = [];
