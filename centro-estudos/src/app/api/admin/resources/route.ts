import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removeResourceFromStorage } from "@/lib/resource-storage";
import { resourceCreateSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: "Não autorizado.",
      },
      { status: 401 },
    );
  }

  console.log("[api/admin/resources] Pedido de criação de recurso recebido.");

  let filePathToCleanup: string | null = null;

  try {
    const body = await request.json();
    const parsed = resourceCreateSchema.safeParse(body);

    if (!parsed.success) {
      console.error("[api/admin/resources] Validação falhou.", parsed.error.flatten().fieldErrors);

      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    filePathToCleanup = parsed.data.filePath;

    const resource = await prisma.resource.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        category: parsed.data.category,
        fileName: parsed.data.fileName,
        filePath: parsed.data.filePath,
        mimeType: parsed.data.mimeType,
        sizeBytes: parsed.data.sizeBytes,
        isPublished: parsed.data.isPublished,
      },
    });

    console.log("[api/admin/resources] Registo criado na base de dados.", {
      resourceId: resource.id,
      filePath: resource.filePath,
    });

    revalidatePath("/");
    revalidatePath("/fichas");
    revalidatePath("/admin");
    revalidatePath("/admin/fichas");

    return NextResponse.json(
      {
        success: true,
        message: "Recurso criado com sucesso.",
        resource,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/admin/resources] Erro inesperado ao criar recurso.", error);

    if (filePathToCleanup) {
      await removeResourceFromStorage(filePathToCleanup).catch((cleanupError) => {
        console.error("[api/admin/resources] Falha ao limpar ficheiro órfão.", cleanupError);
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Ocorreu um erro ao criar o recurso.",
      },
      { status: 500 },
    );
  }
}
