import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugifyFileName } from "@/lib/utils";
import { aboutPhotoSchema } from "@/lib/validators";

const uploadDirectory = path.join(process.cwd(), "public", "uploads", "about");

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url), 303);
  }

  const formData = await request.formData();
  const parsed = aboutPhotoSchema.safeParse({
    title: formData.get("title"),
    isPublished: formData.get("isPublished"),
  });
  const file = formData.get("file");

  if (
    !parsed.success ||
    !(file instanceof File) ||
    file.size === 0 ||
    (file.type && !file.type.startsWith("image/"))
  ) {
    return NextResponse.redirect(new URL("/admin/quem-somos", request.url), 303);
  }

  await mkdir(uploadDirectory, { recursive: true });

  const bytes = await file.arrayBuffer();
  const safeName = `${randomUUID()}-${slugifyFileName(file.name)}`;
  const absolutePath = path.join(uploadDirectory, safeName);

  await writeFile(absolutePath, Buffer.from(bytes));

  await prisma.aboutPhoto.create({
    data: {
      title: parsed.data.title,
      isPublished: parsed.data.isPublished === "on",
      imageName: file.name,
      imagePath: `/uploads/about/${safeName}`,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
    },
  });

  revalidatePath("/sobre");
  revalidatePath("/admin");
  revalidatePath("/admin/quem-somos");

  return NextResponse.redirect(new URL("/admin/quem-somos", request.url), 303);
}
