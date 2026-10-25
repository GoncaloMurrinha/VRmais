export const dynamic = "force-dynamic";

import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminPasswordForm } from "@/components/admin-password-form";
import { AdminUserForm } from "@/components/admin-user-form";
import { ConfirmDeleteForm } from "@/components/confirm-delete-form";
import { DatabaseWarning } from "@/components/database-warning";
import { Icon } from "@/components/icons";
import { deleteAdminUser } from "@/lib/admin-actions";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getAdminUsers() {
  try {
    const users = await prisma.adminUser.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    return { users, available: true };
  } catch {
    return { users: [], available: false };
  }
}

export default async function AdminTeachersPage() {
  const [session, { users, available }] = await Promise.all([requireAdminSession(), getAdminUsers()]);
  const dateFormat = new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Professores"
        description="Quem tem conta pode entrar nesta área e gerir sessões, fichas e fotografias. Todos têm as mesmas permissões."
      />

      {!available ? <DatabaseWarning /> : null}
      {available ? <AdminUserForm /> : null}

      <section aria-labelledby="lista-professores">
        <h2 id="lista-professores" className="font-display text-lg font-bold text-teal-deep">
          Contas com acesso ({users.length})
        </h2>

        <ul className="mt-4 space-y-3">
          {users.map((user) => {
            const isSelf = user.id === session.id;

            return (
              <li key={user.id} className="card">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-4 sm:p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-soft text-teal">
                      <Icon name="user" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-base font-bold text-teal-deep">{user.name}</h3>
                        {isSelf ? <span className="badge badge-orange">Tu</span> : null}
                      </div>
                      <p className="mt-0.5 break-all text-sm text-muted">{user.email}</p>
                      <p className="mt-0.5 text-xs text-muted">Conta criada a {dateFormat.format(user.createdAt)}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                      <span className="hidden sm:inline">Gerir</span>
                      <Icon name="chevron" className="h-5 w-5 transition group-open:rotate-180" />
                    </span>
                  </summary>
                  <div className="space-y-5 border-t border-line p-4 sm:p-5">
                    <AdminPasswordForm id={user.id} name={user.name} />
                    {isSelf ? (
                      <p className="border-t border-line pt-5 text-sm text-muted">
                        Não podes remover a tua própria conta. Pede a outro professor para o fazer, se for preciso.
                      </p>
                    ) : (
                      <div className="border-t border-line pt-5">
                        <ConfirmDeleteForm
                          action={deleteAdminUser}
                          fields={{ id: user.id }}
                          message={`Remover a conta de ${user.name}? Deixa de conseguir entrar de imediato.`}
                          label="Remover conta"
                        />
                      </div>
                    )}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
