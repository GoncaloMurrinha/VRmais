"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSessionCookie, clearSessionCookie, requireAdminSession, verifyCredentials } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";

export async function loginAdmin(_state: { error?: string } | undefined, formData: FormData) {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Dados inválidos." };
  }

  let user = null;

  try {
    user = await verifyCredentials(result.data.email, result.data.password);
  } catch {
    return { error: "A base de dados ainda não está disponível. Configura o PostgreSQL antes de entrar." };
  }

  if (!user) {
    return { error: "Credenciais inválidas." };
  }

  await createSessionCookie({
    sub: user.id,
    email: user.email,
    name: user.name,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function deleteSession(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  await prisma.session.delete({
    where: { id },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/sessoes");
  revalidatePath("/calendario");
}
