import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugifyFileName } from "@/lib/utils";
import { resourceSchema } from "@/lib/validators";

const uploadDirectory = path.join(process.cwd(), "public", "uploads", "resources");

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url), 303);
  }

  const formData = await request.formData();
  const parsed = resourceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    isPublished: formData.get("isPublished"),
  });
  const file = formData.get("file");

  if (!parsed.success || !(file instanceof File) || file.size === 0) {
    return NextResponse.redirect(new URL("/admin/fichas", request.url), 303);
  }

  await mkdir(uploadDirectory, { recursive: true });

  const bytes = await file.arrayBuffer();
  const safeName = `${randomUUID()}-${slugifyFileName(file.name)}`;
  const absolutePath = path.join(uploadDirectory, safeName);

  await writeFile(absolutePath, Buffer.from(bytes));

  await prisma.resource.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      isPublished: parsed.data.isPublished === "on",
      fileName: file.name,
      filePath: `/uploads/resources/${safeName}`,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
    },
  });

  revalidatePath("/");
  revalidatePath("/fichas");
  revalidatePath("/admin");
  revalidatePath("/admin/fichas");

  return NextResponse.redirect(new URL("/admin/fichas", request.url), 303);
}
