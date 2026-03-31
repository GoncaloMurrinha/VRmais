import { unlink } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
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
    const absolutePath = path.join(process.cwd(), "public", photo.imagePath.replace(/^\//, ""));

    await prisma.aboutPhoto.delete({
      where: { id },
    });

    await unlink(absolutePath).catch(() => null);
  }

  revalidatePath("/sobre");
  revalidatePath("/admin");
  revalidatePath("/admin/quem-somos");

  return NextResponse.redirect(new URL("/admin/quem-somos", request.url), 303);
}
