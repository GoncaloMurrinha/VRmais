import { unlink } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractResourceStoragePath, removeResourceFromStorage } from "@/lib/resource-storage";

export const runtime = "nodejs";

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

    const storagePath = extractResourceStoragePath(resource.filePath);

    if (storagePath) {
      await removeResourceFromStorage(storagePath)
        .then(() => {
          console.log("[api/admin/resources/[id]] Ficheiro removido do Supabase Storage.", {
            storagePath,
          });
        })
        .catch((error) => {
          console.error("[api/admin/resources/[id]] Falha ao remover ficheiro do Supabase Storage.", error);
        });
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
