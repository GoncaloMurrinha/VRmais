"use server";

import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionCookie, clearSessionCookie, requireAdminSession, verifyCredentials } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminCreateSchema, adminPasswordSchema, loginSchema } from "@/lib/validators";

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

export type AdminActionResult = { ok: boolean; message?: string; error?: string };

export async function createAdminUser(formData: FormData): Promise<AdminActionResult> {
  await requireAdminSession();

  const parsed = adminCreateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const email = parsed.data.email.toLowerCase();

  try {
    await prisma.adminUser.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash: await bcrypt.hash(parsed.data.password, 10),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, error: "Já existe uma conta com este email." };
    }

    console.error("[admin-actions] Erro ao criar professor.", error);
    return { ok: false, error: "Não foi possível criar a conta. Tenta novamente." };
  }

  revalidatePath("/admin/professores");

  return { ok: true, message: `Conta criada para ${parsed.data.name}. Já pode entrar com o email ${email}.` };
}

export async function changeAdminPassword(formData: FormData): Promise<AdminActionResult> {
  await requireAdminSession();

  const parsed = adminPasswordSchema.safeParse({
    id: formData.get("id"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await prisma.adminUser.update({
      where: { id: parsed.data.id },
      data: { passwordHash: await bcrypt.hash(parsed.data.password, 10) },
    });
  } catch {
    return { ok: false, error: "Não foi possível alterar a palavra-passe. A conta ainda existe?" };
  }

  revalidatePath("/admin/professores");

  return { ok: true, message: "Palavra-passe alterada." };
}

export async function deleteAdminUser(formData: FormData) {
  const session = await requireAdminSession();
  const id = String(formData.get("id") ?? "");

  // Ninguém se pode apagar a si próprio: garante que há sempre pelo menos uma conta com acesso.
  if (!id || id === session.id) {
    return;
  }

  await prisma.adminUser.delete({ where: { id } }).catch(() => null);

  revalidatePath("/admin/professores");
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
