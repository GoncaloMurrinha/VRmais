import { unlink } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const RESOURCE_BUCKET = "resources";

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

function extractStoragePath(filePath: string) {
  if (filePath.startsWith("/")) {
    return null;
  }

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    const marker = `/storage/v1/object/public/${RESOURCE_BUCKET}/`;
    const [, encodedPath] = filePath.split(marker);

    return encodedPath ? decodeURIComponent(encodedPath) : null;
  }

  return filePath;
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url), 303);
  }

  const formData = await request.formData();

  if (formData.get("_method") !== "delete") {
    return NextResponse.redirect(new URL("/admin/fichas", request.url), 303);
  }

  const { id } = await context.params;
  console.log("[api/admin/resources/[id]] Pedido de remoção recebido.", { id });
  const resource = await prisma.resource.findUnique({
    where: { id },
  });

  if (resource) {
    await prisma.resource.delete({
      where: { id },
    });

    const storagePath = extractStoragePath(resource.filePath);

    if (storagePath) {
      try {
        const supabase = createSupabaseAdminClient();

        await supabase.storage.from(RESOURCE_BUCKET).remove([storagePath]);

        console.log("[api/admin/resources/[id]] Ficheiro removido do Supabase Storage.", {
          storagePath,
        });
      } catch (error) {
        console.error("[api/admin/resources/[id]] Falha ao remover ficheiro do Supabase Storage.", error);
      }
    } else {
      const absolutePath = path.join(process.cwd(), "public", resource.filePath.replace(/^\//, ""));

      await unlink(absolutePath).catch((error) => {
        console.error("[api/admin/resources/[id]] Falha ao remover ficheiro local.", error);
        return null;
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/fichas");
  revalidatePath("/admin");
  revalidatePath("/admin/fichas");

  return NextResponse.redirect(new URL("/admin/fichas", request.url), 303);
}
