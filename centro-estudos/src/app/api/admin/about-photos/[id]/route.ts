import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractResourceStoragePath, createSupabaseAdminClient, RESOURCE_BUCKET } from "@/lib/resource-storage";

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
    const storagePath = extractResourceStoragePath(photo.imagePath);

    await prisma.aboutPhoto.delete({
      where: { id },
    });

    if (storagePath) {
      const supabase = createSupabaseAdminClient();
      await supabase.storage.from(RESOURCE_BUCKET).remove([storagePath]).catch(() => null);
    }
  }

  revalidatePath("/sobre");
  revalidatePath("/admin");
  revalidatePath("/admin/quem-somos");

  return NextResponse.redirect(new URL("/admin/quem-somos", request.url), 303);
}
