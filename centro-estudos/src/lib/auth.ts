import "server-only";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "centro_estudos_admin";
const secret = new TextEncoder().encode(env.AUTH_SECRET);

type SessionPayload = {
  sub: string;
  email: string;
  name: string;
};

// Hash descartável: garante que o tempo de resposta é o mesmo quando o email não existe.
const DUMMY_PASSWORD_HASH = "$2b$10$soVtJw8QoqxV3seC/.fbu.IPsGHT/Pr9uyvLjG/bpL7iHFuYKV2Se";

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return user;
}

export async function createSessionCookie(payload: SessionPayload) {
  const token = await new SignJWT({
    email: payload.email,
    name: payload.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export const getAdminSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.sub,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
});

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
