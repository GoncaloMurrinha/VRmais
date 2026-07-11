import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  buildResourcePublicUrl,
  createSupabaseAdminClient,
  ensureResourceBucketExists,
  RESOURCE_BUCKET,
} from "@/lib/resource-storage";
import { slugifyFileName } from "@/lib/utils";
import { aboutPhotoSchema } from "@/lib/validators";

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

  try {
    const bytes = await file.arrayBuffer();
    const safeName = `${randomUUID()}-${slugifyFileName(file.name)}`;
    const filePath = `about/${safeName}`;
    const supabase = createSupabaseAdminClient();

    await ensureResourceBucketExists();

    const { error: uploadError } = await supabase.storage.from(RESOURCE_BUCKET).upload(filePath, Buffer.from(bytes), {
      contentType: file.type || "application/octet-stream",
    });

    if (uploadError) {
      console.error("[api/admin/about-photos] Erro ao fazer upload para Supabase:", uploadError);
      return NextResponse.redirect(new URL("/admin/quem-somos", request.url), 303);
    }

    const publicUrl = buildResourcePublicUrl(filePath);

    if (!publicUrl) {
      return NextResponse.redirect(new URL("/admin/quem-somos", request.url), 303);
    }

    await prisma.aboutPhoto.create({
      data: {
        title: parsed.data.title,
        isPublished: parsed.data.isPublished === "on",
        imageName: file.name,
        imagePath: publicUrl,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
      },
    });

    revalidatePath("/sobre");
    revalidatePath("/admin");
    revalidatePath("/admin/quem-somos");
  } catch (error) {
    console.error("[api/admin/about-photos] Erro ao processar upload:", error);
  }

  return NextResponse.redirect(new URL("/admin/quem-somos", request.url), 303);
}
