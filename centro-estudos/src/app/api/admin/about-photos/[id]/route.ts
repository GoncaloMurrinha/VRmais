import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { removeBlob } from "@/lib/blob-storage";
import { prisma } from "@/lib/prisma";

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
    return NextResponse.redirect(new URL("/admin/quem-somos", request.url), 303);
  }

  const { id } = await context.params;
  const photo = await prisma.aboutPhoto.findUnique({
    where: { id },
  });

  if (photo) {
    await prisma.aboutPhoto.delete({
      where: { id },
    });

    await removeBlob(photo.imagePath).catch((error) => {
      console.error("[api/admin/about-photos/[id]] Falha ao remover imagem do Vercel Blob.", error);
    });
  }

  revalidatePath("/sobre");
  revalidatePath("/admin");
  revalidatePath("/admin/quem-somos");

  return NextResponse.redirect(new URL("/admin/quem-somos", request.url), 303);
}
