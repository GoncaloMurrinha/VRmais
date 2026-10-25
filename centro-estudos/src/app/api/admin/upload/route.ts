import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  MAX_RESOURCE_SIZE_BYTES,
  PHOTO_BLOB_PREFIX,
  RESOURCE_BLOB_PREFIX,
  RESOURCE_CONTENT_TYPES,
} from "@/lib/blob-storage";

export const runtime = "nodejs";

// Emite tokens para o browser enviar ficheiros diretamente para o Vercel Blob,
// sem passar pelo limite de 4,5 MB do corpo dos pedidos nas funções da Vercel.
export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (pathname.startsWith(RESOURCE_BLOB_PREFIX)) {
          return {
            allowedContentTypes: RESOURCE_CONTENT_TYPES,
            maximumSizeInBytes: MAX_RESOURCE_SIZE_BYTES,
            addRandomSuffix: true,
          };
        }

        if (pathname.startsWith(PHOTO_BLOB_PREFIX)) {
          return {
            allowedContentTypes: ["image/*"],
            maximumSizeInBytes: MAX_RESOURCE_SIZE_BYTES,
            addRandomSuffix: true,
          };
        }

        throw new Error("Destino de upload inválido.");
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[api/admin/upload] Erro ao preparar o upload.", error);

    const message = error instanceof Error ? error.message : "Não foi possível preparar o upload.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
