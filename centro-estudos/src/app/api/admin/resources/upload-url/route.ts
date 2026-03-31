import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  createSupabaseAdminClient,
  createUniqueResourceFilePath,
  ensureResourceBucketExists,
  RESOURCE_BUCKET,
} from "@/lib/resource-storage";
import { resourceUploadRequestSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  console.log("[api/admin/resources/upload-url] Pedido recebido.");

  const session = await getAdminSession();

  if (!session) {
    console.error("[api/admin/resources/upload-url] Pedido sem sessão de administração.");

    return NextResponse.json(
      {
        success: false,
        error: "Não autorizado.",
      },
      { status: 401 },
    );
  }

  try {
    console.log("[api/admin/resources/upload-url] Estado das envs.", {
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY),
    });

    const body = await request.json();
    const parsed = resourceUploadRequestSchema.safeParse(body);

    if (!parsed.success) {
      console.error("[api/admin/resources/upload-url] Validação falhou.", parsed.error.flatten().fieldErrors);

      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const filePath = createUniqueResourceFilePath(parsed.data.fileName);
    const supabase = createSupabaseAdminClient();

    const bucketState = await ensureResourceBucketExists();

    if (bucketState.created) {
      console.log("[api/admin/resources/upload-url] Bucket criado automaticamente.", {
        bucket: RESOURCE_BUCKET,
      });
    }

    const { data, error } = await supabase.storage.from(RESOURCE_BUCKET).createSignedUploadUrl(filePath);

    if (error || !data?.token) {
      console.error("[api/admin/resources/upload-url] Falha ao criar signed upload URL.", error);

      return NextResponse.json(
        {
          success: false,
          error: error?.message || "Não foi possível preparar o upload do ficheiro.",
        },
        { status: 500 },
      );
    }

    console.log("[api/admin/resources/upload-url] Signed upload URL criada.", {
      filePath,
      bucket: RESOURCE_BUCKET,
    });

    return NextResponse.json(
      {
        success: true,
        bucket: RESOURCE_BUCKET,
        path: filePath,
        token: data.token,
        signedUrl: data.signedUrl,
        supabaseUrl: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[api/admin/resources/upload-url] Erro inesperado.", error);

    const message = error instanceof Error ? error.message : "Ocorreu um erro ao preparar o upload.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
