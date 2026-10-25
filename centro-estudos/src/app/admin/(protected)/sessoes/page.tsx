export const dynamic = "force-dynamic";

import { AdminPageHeader } from "@/components/admin-page-header";
import { ConfirmDeleteForm } from "@/components/confirm-delete-form";
import { DatabaseWarning } from "@/components/database-warning";
import { Icon } from "@/components/icons";
import { SessionAdminForm } from "@/components/session-admin-form";
import { deleteSession } from "@/lib/admin-actions";
import { getAdminSessionsData } from "@/lib/data";
import { formatSessionWhen } from "@/lib/utils";

export default async function AdminSessionsPage() {
  const { sessions, database } = await getAdminSessionsData();
  const now = new Date();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Sessões"
        description="Cria e edita as sessões do calendário. As que estiverem visíveis aparecem automaticamente no site."
      />

      {!database.available ? <DatabaseWarning message={database.message} /> : null}

      {database.available ? (
        <section className="card p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold text-teal-deep">Nova sessão</h2>
          <div className="mt-5">
            <SessionAdminForm />
          </div>
        </section>
      ) : null}

      <section aria-labelledby="lista-sessoes">
        <h2 id="lista-sessoes" className="font-display text-lg font-bold text-teal-deep">
          Sessões marcadas ({sessions.length})
        </h2>

        {sessions.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {sessions.map((session) => (
              <li key={session.id} className="card">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-4 sm:p-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-base font-bold text-teal-deep">{session.title}</h3>
                        <span className={`badge ${session.isPublished ? "badge-success" : "badge-neutral"}`}>
                          {session.isPublished ? "Visível" : "Rascunho"}
                        </span>
                        {session.endAt < now ? <span className="badge badge-neutral">Terminada</span> : null}
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {session.category} · {formatSessionWhen(session.startAt, session.endAt)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                      <span className="hidden sm:inline">Editar</span>
                      <Icon name="chevron" className="h-5 w-5 transition group-open:rotate-180" />
                    </span>
                  </summary>
                  <div className="space-y-5 border-t border-line p-4 sm:p-5">
                    {database.available ? <SessionAdminForm session={session} /> : null}
                    {database.available ? (
                      <div className="border-t border-line pt-5">
                        <ConfirmDeleteForm
                          action={deleteSession}
                          fields={{ id: session.id }}
                          message={`Eliminar a sessão "${session.title}"? Esta ação não pode ser desfeita.`}
                          label="Eliminar sessão"
                        />
                      </div>
                    ) : null}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        ) : (
          <p className="card mt-4 px-6 py-10 text-center text-sm text-muted">
            Ainda não há sessões. Cria a primeira no formulário acima.
          </p>
        )}
      </section>
    </div>
  );
}
