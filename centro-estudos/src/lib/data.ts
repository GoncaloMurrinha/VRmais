import type { Resource } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mockAboutPhotos, mockResources, mockSessions } from "@/lib/mock-data";

export type DatabaseState = {
  available: boolean;
  message?: string;
};

function normalizeDatabaseMessage(error: unknown) {
  const rawMessage = error instanceof Error ? error.message : "";

  if (rawMessage.includes("Can't reach database server")) {
    return "Nao foi possivel ligar ao servidor PostgreSQL. Verifica se o servico esta ativo e se a porta esta correta.";
  }

  if (rawMessage.includes("denied access") || rawMessage.includes("authentication failed")) {
    return "O utilizador configurado no DATABASE_URL nao tem acesso a esta base de dados.";
  }

  if (rawMessage.includes("database") && rawMessage.includes("does not exist")) {
    return "A base de dados indicada no DATABASE_URL ainda nao existe.";
  }

  return "A ligacao ao PostgreSQL falhou. Verifica DATABASE_URL, credenciais e permissões.";
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

const resourceBucketPublicBaseUrl = supabaseUrl
  ? `${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/public/resources`
  : null;

function toResourceFileUrl(filePath: string) {
  if (!resourceBucketPublicBaseUrl || filePath === "#" || filePath.startsWith("/") || /^https?:\/\//.test(filePath)) {
    return filePath;
  }

  const encodedPath = filePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${resourceBucketPublicBaseUrl}/${encodedPath}`;
}

function withResourceFileUrls(resources: Resource[]) {
  return resources.map((resource) => ({
    ...resource,
    filePath: toResourceFileUrl(resource.filePath),
  }));
}

async function withDatabaseFallback<T>(query: () => Promise<T>, fallback: T) {
  try {
    const data = await query();
    return {
      data,
      database: {
        available: true,
      } satisfies DatabaseState,
    };
  } catch (error) {
    const message = normalizeDatabaseMessage(error);

    return {
      data: fallback,
      database: {
        available: false,
        message,
      } satisfies DatabaseState,
    };
  }
}

export async function getPublishedSessions() {
  return withDatabaseFallback(
    () =>
      prisma.session.findMany({
        where: { isPublished: true },
        orderBy: { startAt: "asc" },
      }),
    mockSessions,
  );
}

export async function getPublishedResources() {
  const result = await withDatabaseFallback(
    () =>
      prisma.resource.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      }),
    mockResources,
  );

  return {
    data: withResourceFileUrls(result.data),
    database: result.database,
  };
}

export async function getPublishedAboutPhotos() {
  return withDatabaseFallback(
    () =>
      prisma.aboutPhoto.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      }),
    mockAboutPhotos,
  );
}

export async function getAdminDashboardData() {
  try {
    const [sessions, resources] = await Promise.all([
      prisma.session.findMany({ orderBy: { startAt: "asc" } }),
      prisma.resource.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return {
      sessions,
      resources: withResourceFileUrls(resources),
      database: {
        available: true,
      } satisfies DatabaseState,
    };
  } catch (error) {
    const message = normalizeDatabaseMessage(error);

    return {
      sessions: mockSessions,
      resources: withResourceFileUrls(mockResources),
      database: {
        available: false,
        message,
      } satisfies DatabaseState,
    };
  }
}

export async function getAdminSessionsData() {
  const result = await withDatabaseFallback(
    () =>
      prisma.session.findMany({
        orderBy: { startAt: "asc" },
      }),
    mockSessions,
  );

  return {
    sessions: result.data,
    database: result.database,
  };
}

export async function getAdminResourcesData() {
  const result = await withDatabaseFallback(
    () =>
      prisma.resource.findMany({
        orderBy: { createdAt: "desc" },
      }),
    mockResources,
  );

  return {
    resources: withResourceFileUrls(result.data),
    database: result.database,
  };
}

export async function getAdminAboutPhotosData() {
  const result = await withDatabaseFallback(
    () =>
      prisma.aboutPhoto.findMany({
        orderBy: { createdAt: "desc" },
      }),
    mockAboutPhotos,
  );

  return {
    photos: result.data,
    database: result.database,
  };
}
