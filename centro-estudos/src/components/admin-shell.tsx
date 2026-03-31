import Link from "next/link";
import { logoutAdmin } from "@/lib/admin-actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/sessoes", label: "Sessões" },
  { href: "/admin/quem-somos", label: "Quem Somos" },
  { href: "/admin/fichas", label: "Fichas" },
];

export function AdminShell({
  children,
  adminName,
}: {
  children: React.ReactNode;
  adminName: string;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-[linear-gradient(180deg,#0f172a,#103e49)] px-6 py-8 text-white lg:block">
        <p className="brand-accent-orange text-xs uppercase tracking-[0.3em]">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold">VR+ Centro de Estudos</h1>
        <nav className="mt-10 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-2xl px-4 py-3 text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAdmin} className="mt-10">
          <button
            type="submit"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Terminar sessão
          </button>
        </form>
      </aside>
      <div className="lg:pl-72">
        <header className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Área de gestão</p>
              <p className="text-lg font-semibold text-slate-950">{adminName}</p>
            </div>
            <nav className="flex flex-wrap gap-2 lg:hidden">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <form action={logoutAdmin} className="lg:hidden">
              <button
                type="submit"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800"
              >
                Sair
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}
