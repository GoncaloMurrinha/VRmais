import Image from "next/image";
import Link from "next/link";
import { AdminBottomNav, AdminSidebarNav } from "@/components/admin-nav";
import { Icon } from "@/components/icons";
import { logoutAdmin } from "@/lib/admin-actions";

export function AdminShell({
  children,
  adminName,
}: {
  children: React.ReactNode;
  adminName: string;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-teal-deep px-4 py-6 text-white lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-2">
          <Image src="/logo-vrmais.jpeg" alt="" width={44} height={44} className="h-11 w-11 rounded-xl object-cover" />
          <span className="leading-tight">
            <span className="font-display block text-lg font-extrabold">VR+</span>
            <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/70">
              Área do professor
            </span>
          </span>
        </Link>

        <AdminSidebarNav />

        <div className="mt-auto space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
          >
            <Icon name="external" className="h-5 w-5" />
            Ver o site
          </Link>
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-xs text-white/60">Sessão iniciada como</p>
            <p className="mt-0.5 truncate text-sm font-semibold">{adminName}</p>
            <form action={logoutAdmin} className="mt-3">
              <button type="submit" className="btn btn-outline-light w-full">
                <Icon name="logout" className="h-4 w-4" />
                Terminar sessão
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src="/logo-vrmais.jpeg" alt="" width={36} height={36} className="h-9 w-9 rounded-lg object-cover" />
            <span className="font-display text-base font-extrabold text-teal-deep">Área do professor</span>
          </Link>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted hover:bg-teal-soft hover:text-teal-deep"
              aria-label="Terminar sessão"
            >
              <Icon name="logout" className="h-5 w-5" />
              Sair
            </button>
          </form>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-6 pb-28 sm:px-6 lg:px-10 lg:py-10 lg:pb-12">{children}</main>
      </div>

      <AdminBottomNav />
    </div>
  );
}
