export const dynamic = "force-dynamic";

import Link from "next/link";
import { DatabaseWarning } from "@/components/database-warning";
import { Icon, type IconName } from "@/components/icons";
import { getAdminSession } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/data";
import { formatSessionWhen } from "@/lib/utils";

const actions: { href: string; icon: IconName; title: string; text: string }[] = [
  { href: "/admin/sessoes", icon: "calendar", title: "Nova sessão", text: "Marcar uma sessão no calendário" },
  { href: "/admin/fichas", icon: "upload", title: "Carregar ficha", text: "Publicar um PDF para os alunos" },
  { href: "/admin/quem-somos", icon: "image", title: "Adicionar fotografia", text: "Atualizar a galeria do site" },
];

export default async function AdminDashboardPage() {
  const [session, { sessions, resources, database }] = await Promise.all([getAdminSession(), getAdminDashboardData()]);

  const now = new Date();
  const upcomingSessions = sessions.filter((item) => item.isPublished && item.endAt >= now);
  const publishedResources = resources.filter((resource) => resource.isPublished);
  const drafts = sessions.filter((item) => !item.isPublished).length + resources.filter((item) => !item.isPublished).length;

  const stats = [
    { label: "Próximas sessões", value: upcomingSessions.length, icon: "calendar" as IconName },
    { label: "Fichas publicadas", value: publishedResources.length, icon: "file" as IconName },
    { label: "Rascunhos (não visíveis)", value: drafts, icon: "eye-off" as IconName },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-muted">Área do professor</p>
        <h1 className="font-display mt-1 text-2xl font-extrabold tracking-tight text-teal-deep sm:text-3xl">
          Olá, {session?.name ?? "professor"}
        </h1>
        <p className="mt-1.5 text-sm text-muted sm:text-base">O que queres fazer hoje?</p>
      </div>

      {!database.available ? <DatabaseWarning message={database.message} /> : null}

      <section aria-label="Ações rápidas">
        <ul className="grid gap-3 md:grid-cols-3">
          {actions.map((action) => (
            <li key={action.href}>
              <Link href={action.href} className="card card-link flex h-full items-center gap-4 p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange text-teal-deep">
                  <Icon name={action.icon} className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display block text-base font-bold text-teal-deep">{action.title}</span>
                  <span className="block text-sm text-muted">{action.text}</span>
                </span>
                <Icon name="arrow" className="h-5 w-5 text-teal" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Resumo">
        <ul className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <li key={stat.label} className="card p-4 sm:p-5">
              <Icon name={stat.icon} className="h-5 w-5 text-teal" />
              <p className="font-display mt-3 text-3xl font-extrabold text-teal-deep sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold leading-snug text-muted sm:text-sm">{stat.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-teal-deep">Próximas sessões</h2>
            <Link href="/admin/sessoes" className="inline-flex min-h-11 items-center text-sm font-semibold text-teal hover:text-teal-deep">
              Gerir
            </Link>
          </div>
          {upcomingSessions.length > 0 ? (
            <ul className="mt-2 divide-y divide-line">
              {upcomingSessions.slice(0, 5).map((item) => (
                <li key={item.id} className="py-3">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 text-sm text-muted">{formatSessionWhen(item.startAt, item.endAt)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-xl bg-bg px-4 py-6 text-center text-sm text-muted">
              Não há sessões marcadas.{" "}
              <Link href="/admin/sessoes" className="font-semibold text-teal underline">
                Criar uma sessão
              </Link>
            </p>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-teal-deep">Últimas fichas</h2>
            <Link href="/admin/fichas" className="inline-flex min-h-11 items-center text-sm font-semibold text-teal hover:text-teal-deep">
              Gerir
            </Link>
          </div>
          {resources.length > 0 ? (
            <ul className="mt-2 divide-y divide-line">
              {resources.slice(0, 5).map((resource) => (
                <li key={resource.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{resource.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{resource.category}</p>
                  </div>
                  <span className={`badge shrink-0 ${resource.isPublished ? "badge-success" : "badge-neutral"}`}>
                    {resource.isPublished ? "Visível" : "Rascunho"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-xl bg-bg px-4 py-6 text-center text-sm text-muted">
              Ainda não há fichas.{" "}
              <Link href="/admin/fichas" className="font-semibold text-teal underline">
                Carregar a primeira
              </Link>
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
