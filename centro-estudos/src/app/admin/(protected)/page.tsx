export const dynamic = "force-dynamic";

import Link from "next/link";
import { DatabaseWarning } from "@/components/database-warning";
import { getAdminDashboardData } from "@/lib/data";

export default async function AdminDashboardPage() {
  const { sessions, resources, database } = await getAdminDashboardData();
  const publishedSessions = sessions.filter((session) => session.isPublished).length;
  const publishedResources = resources.filter((resource) => resource.isPublished).length;

  return (
    <div className="space-y-8">
      {!database.available ? <DatabaseWarning message={database.message} /> : null}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="brand-panel rounded-[2rem] p-6 text-white">
          <p className="text-sm text-white/72">Sessões totais</p>
          <p className="mt-4 text-4xl font-semibold">{sessions.length}</p>
        </article>
        <article className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Sessões publicadas</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{publishedSessions}</p>
        </article>
        <article className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Fichas publicadas</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{publishedResources}</p>
        </article>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <article className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="brand-accent text-sm font-semibold uppercase tracking-[0.3em]">Sessões</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Próximas entradas</h2>
            </div>
            <Link href="/admin/sessoes" className="brand-accent text-sm font-semibold">
              Gerir
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-950">{session.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {session.category} · {session.tutorName}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="brand-accent text-sm font-semibold uppercase tracking-[0.3em]">Fichas</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Últimos ficheiros</h2>
            </div>
            <Link href="/admin/fichas" className="brand-accent text-sm font-semibold">
              Gerir
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {resources.slice(0, 5).map((resource) => (
              <div key={resource.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-950">{resource.title}</p>
                <p className="mt-1 text-sm text-slate-500">{resource.category}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
