export const dynamic = "force-dynamic";

import { DatabaseWarning } from "@/components/database-warning";
import { SessionAdminForm } from "@/components/session-admin-form";
import { deleteSession } from "@/lib/admin-actions";
import { getAdminSessionsData } from "@/lib/data";
import { formatDateTimeRange } from "@/lib/utils";

export default async function AdminSessionsPage() {
  const { sessions, database } = await getAdminSessionsData();

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">Nova sessão</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Calendário de sessões</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Cria, edita ou remove sessões. O conteúdo marcado como publicado fica disponível automaticamente no site.
        </p>
      </section>

      {!database.available ? <DatabaseWarning message={database.message} /> : null}

      {database.available ? <SessionAdminForm /> : null}

      <section className="space-y-5">
        {sessions.map((session) => (
          <article key={session.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold text-slate-950">{session.title}</h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      session.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {session.isPublished ? "Publicado" : "Rascunho"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {session.category} · {formatDateTimeRange(session.startAt, session.endAt)}
                </p>
              </div>
              {database.available ? (
                <form action={deleteSession}>
                  <input type="hidden" name="id" value={session.id} />
                  <button type="submit" className="text-sm font-semibold text-rose-600">
                    Eliminar
                  </button>
                </form>
              ) : null}
            </div>
            {database.available ? <SessionAdminForm session={session} /> : null}
          </article>
        ))}
      </section>
    </div>
  );
}
