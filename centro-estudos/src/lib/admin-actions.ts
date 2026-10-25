"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionCookie, clearSessionCookie, requireAdminSession, verifyCredentials } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_PER_EMAIL = 5;
const MAX_FAILED_PER_IP = 20;

export async function loginAdmin(_state: { error?: string } | undefined, formData: FormData) {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const email = result.data.email.toLowerCase();
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "desconhecido";
  const windowStart = new Date(Date.now() - LOGIN_WINDOW_MS);

  let user = null;

  try {
    const [failedForEmail, failedForIp] = await Promise.all([
      prisma.loginAttempt.count({ where: { email, createdAt: { gt: windowStart } } }),
      prisma.loginAttempt.count({ where: { ip, createdAt: { gt: windowStart } } }),
    ]);

    if (failedForEmail >= MAX_FAILED_PER_EMAIL || failedForIp >= MAX_FAILED_PER_IP) {
      return { error: "Demasiadas tentativas falhadas. Tenta novamente dentro de 15 minutos." };
    }

    user = await verifyCredentials(email, result.data.password);

    if (!user) {
      await prisma.loginAttempt.create({ data: { email, ip } });
      await prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } });
    }
  } catch {
    return { error: "A base de dados ainda não está disponível. Configura o PostgreSQL antes de entrar." };
  }

  if (!user) {
    return { error: "Credenciais inválidas." };
  }

  await prisma.loginAttempt.deleteMany({ where: { email } }).catch(() => null);

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
