import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getAdminSession } from "@/lib/auth";

const SESSION_COOKIE = "centro_estudos_admin";

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
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#0f172a,#020617_55%)] px-6 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white shadow-[0_30px_100px_-35px_rgba(8,15,30,0.8)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden bg-[linear-gradient(135deg,#082f49,#0f766e,#164e63)] p-12 text-white lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-100/80">Admin</p>
          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em]">Gestão central do centro de estudos.</h1>
          <p className="mt-6 max-w-md text-base leading-8 text-cyan-50/80">
            Acesso à dashboard, gestão do calendário de sessões e carregamento de fichas para o site público.
          </p>
        </section>
        <section className="p-8 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Entrar</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Área administrativa</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Usa as credenciais configuradas na seed inicial para entrar.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
