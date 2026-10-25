import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon } from "@/components/icons";
import { LoginForm } from "@/components/login-form";
import { getAdminSession } from "@/lib/auth";

const SESSION_COOKIE = "centro_estudos_admin";

export const metadata: Metadata = { title: "Entrar" };

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  const cookieStore = await cookies();
  if (cookieStore.get(SESSION_COOKIE)) {
    cookieStore.delete(SESSION_COOKIE);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-teal-deep px-4 py-10">
      <div aria-hidden="true" className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-orange/15 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-teal/60 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center text-white">
          <Image src="/logo-vrmais.jpeg" alt="VR+ Centro de Estudos" width={72} height={72} className="h-[72px] w-[72px] rounded-2xl object-cover" priority />
          <p className="font-display mt-4 text-2xl font-extrabold">Área do professor</p>
          <p className="mt-1 text-sm text-white/70">Entra para gerir sessões, fichas e fotografias.</p>
        </div>

        <div className="card p-6 sm:p-8">
          <h1 className="font-display text-xl font-bold text-teal-deep">Entrar</h1>
          <div className="mt-5">
            <LoginForm />
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Voltar ao site
        </Link>
      </div>
    </main>
  );
}
