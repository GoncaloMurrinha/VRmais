import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url), 303);
  }

  const formData = await request.formData();
  const parsed = sessionSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    tutorName: formData.get("tutorName"),
    location: formData.get("location"),
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
    capacity: formData.get("capacity"),
    isPublished: formData.get("isPublished"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/admin/sessoes", request.url), 303);
  }

  const id = String(formData.get("id") ?? "");
  const payload = {
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category,
    tutorName: parsed.data.tutorName,
    location: parsed.data.location,
    startAt: new Date(parsed.data.startAt),
    endAt: new Date(parsed.data.endAt),
    capacity: parsed.data.capacity,
    isPublished: parsed.data.isPublished,
  };

  if (id) {
    await prisma.session.update({
      where: { id },
      data: payload,
    });
  } else {
    await prisma.session.create({
      data: payload,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/sessoes");
  revalidatePath("/calendario");
  revalidatePath("/");

  return NextResponse.redirect(new URL("/admin/sessoes", request.url), 303);
}
