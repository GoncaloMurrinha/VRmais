import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { removeBlob } from "@/lib/blob-storage";
import { prisma } from "@/lib/prisma";
import { aboutPhotoCreateSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ success: false, error: "Não autorizado." }, { status: 401 });
  }

  let imagePathToCleanup: string | null = null;

  try {
    const body = await request.json();
    const parsed = aboutPhotoCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    imagePathToCleanup = parsed.data.imagePath;

    const photo = await prisma.aboutPhoto.create({
      data: parsed.data,
    });

    revalidatePath("/sobre");
    revalidatePath("/admin");
    revalidatePath("/admin/quem-somos");

    return NextResponse.json({ success: true, photo }, { status: 201 });
  } catch (error) {
    console.error("[api/admin/about-photos] Erro ao guardar a fotografia.", error);

    if (imagePathToCleanup) {
      await removeBlob(imagePathToCleanup).catch((cleanupError) => {
        console.error("[api/admin/about-photos] Falha ao limpar imagem órfã.", cleanupError);
      });
    }

    const message = error instanceof Error ? error.message : "Ocorreu um erro ao guardar a fotografia.";

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
