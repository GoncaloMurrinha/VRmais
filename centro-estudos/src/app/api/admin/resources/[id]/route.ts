import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { removeBlob } from "@/lib/blob-storage";
import { prisma } from "@/lib/prisma";

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
  const resource = await prisma.resource.findUnique({
    where: { id },
  });

  if (resource) {
    await prisma.resource.delete({
      where: { id },
    });

    await removeBlob(resource.filePath).catch((error) => {
      console.error("[api/admin/resources/[id]] Falha ao remover ficheiro do Vercel Blob.", error);
    });
  }

  revalidatePath("/");
  revalidatePath("/fichas");
  revalidatePath("/admin");
  revalidatePath("/admin/fichas");

  return NextResponse.redirect(new URL("/admin/fichas", request.url), 303);
}
