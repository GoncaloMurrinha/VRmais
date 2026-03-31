import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugifyFileName } from "@/lib/utils";
import { resourceSchema } from "@/lib/validators";

export const runtime = "nodejs";

const RESOURCE_BUCKET = "resources";
const MAX_PRISMA_INT = 2_147_483_647;

function createSupabaseAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("As variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function buildResourcePublicUrl(filePath: string) {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");

  if (!supabaseUrl) {
    return null;
  }

  const encodedPath = filePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${supabaseUrl}/storage/v1/object/public/${RESOURCE_BUCKET}/${encodedPath}`;
}

export async function POST(request: Request) {
  console.log("[api/resources] Pedido de upload recebido.");

  const session = await getAdminSession();

  if (!session) {
    console.error("[api/resources] Pedido sem sessão de administração.");

    return NextResponse.json(
      {
        success: false,
        error: "Não autorizado.",
      },
      { status: 401 },
    );
  }

  let uploadedFilePath: string | null = null;

  try {
    const formData = await request.formData();
    const parsed = resourceSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
    });
    const file = formData.get("file");

    if (!parsed.success) {
      console.error("[api/resources] Validação falhou.", parsed.error.flatten().fieldErrors);

      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (!(file instanceof File) || file.size === 0) {
      console.error("[api/resources] Ficheiro inválido ou vazio.");

      return NextResponse.json(
        {
          success: false,
          error: "É obrigatório enviar um ficheiro válido.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_PRISMA_INT) {
      console.error("[api/resources] Ficheiro demasiado grande para o campo sizeBytes.", {
        sizeBytes: file.size,
      });

      return NextResponse.json(
        {
          success: false,
          error: "O ficheiro é demasiado grande para ser registado na base de dados.",
        },
        { status: 400 },
      );
    }

    const safeFileName = slugifyFileName(file.name) || "ficheiro";
    const uniqueFileName = `${Date.now()}-${safeFileName}`;
    const mimeType = file.type || "application/octet-stream";
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const supabase = createSupabaseAdminClient();

    console.log("[api/resources] A enviar ficheiro para o Supabase Storage.", {
      bucket: RESOURCE_BUCKET,
      originalFileName: file.name,
      uniqueFileName,
      mimeType,
      sizeBytes: file.size,
    });

    const { data: storageData, error: storageError } = await supabase.storage
      .from(RESOURCE_BUCKET)
      .upload(uniqueFileName, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (storageError || !storageData?.path) {
      console.error("[api/resources] Falha no upload para o Supabase Storage.", storageError);

      return NextResponse.json(
        {
          success: false,
          error: "Não foi possível fazer upload do ficheiro para o storage.",
        },
        { status: 500 },
      );
    }

    uploadedFilePath = storageData.path;

    console.log("[api/resources] Upload concluído no storage.", {
      path: uploadedFilePath,
    });

    const resource = await prisma.resource.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        category: parsed.data.category,
        fileName: file.name,
        filePath: uploadedFilePath,
        mimeType,
        sizeBytes: file.size,
        isPublished: true,
      },
    });

    console.log("[api/resources] Registo criado na base de dados.", {
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
        storage: {
          bucket: RESOURCE_BUCKET,
          path: uploadedFilePath,
          publicUrl: buildResourcePublicUrl(uploadedFilePath),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/resources] Erro inesperado durante o upload.", error);

    if (uploadedFilePath) {
      try {
        const supabase = createSupabaseAdminClient();

        await supabase.storage.from(RESOURCE_BUCKET).remove([uploadedFilePath]);

        console.warn("[api/resources] Upload removido do storage após falha na base de dados.", {
          path: uploadedFilePath,
        });
      } catch (rollbackError) {
        console.error("[api/resources] Falha ao limpar o ficheiro do storage.", rollbackError);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Ocorreu um erro ao processar o upload do recurso.",
      },
      { status: 500 },
    );
  }
}
