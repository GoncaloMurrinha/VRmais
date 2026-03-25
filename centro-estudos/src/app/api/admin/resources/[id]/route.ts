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
    return NextResponse.redirect(new URL("/admin/fichas", request.url), 303);
  }

  const { id } = await context.params;
  const resource = await prisma.resource.findUnique({
    where: { id },
  });

  if (resource) {
    const absolutePath = path.join(process.cwd(), "public", resource.filePath.replace(/^\//, ""));

    await prisma.resource.delete({
      where: { id },
    });

    await unlink(absolutePath).catch(() => null);
  }

  revalidatePath("/");
  revalidatePath("/fichas");
  revalidatePath("/admin");
  revalidatePath("/admin/fichas");

  return NextResponse.redirect(new URL("/admin/fichas", request.url), 303);
}
