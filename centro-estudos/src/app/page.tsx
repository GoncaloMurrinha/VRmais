export const dynamic = "force-dynamic";

import Link from "next/link";
import { DatabaseWarning } from "@/components/database-warning";
import { ResourceCard } from "@/components/resource-card";
import { SessionCard } from "@/components/session-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedResources, getPublishedSessions } from "@/lib/data";

export default async function HomePage() {
  const [{ data: sessions, database: sessionsDatabase }, { data: resources, database: resourcesDatabase }] =
    await Promise.all([getPublishedSessions(), getPublishedResources()]);
  const upcomingSessions = sessions.slice(0, 3);
  const featuredResources = resources.slice(0, 3);
  const databaseWarning = !sessionsDatabase.available || !resourcesDatabase.available;

  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <section className="dark-hero-band">
          <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-28 text-white md:pb-24 md:pt-32">
            <div className="rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,#0f172a,#08111d_60%,#08263a)] p-8 shadow-[0_40px_120px_-60px_rgba(2,6,23,0.9)] md:p-10">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,24rem)] lg:items-end">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-200">
                    Apoio escolar com direcao
                  </p>
                  <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em] text-white md:text-7xl">
                    Um site completo para gerir um centro de estudos real.
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">
                    Sessoes agendadas, fichas disponiveis para descarregar, presenca institucional clara e uma area de
                    administracao preparada para o proximo ciclo de evolucao.
                  </p>
                  <div className="mt-10 flex flex-wrap gap-4">
                    <Link
                      href="/calendario"
                      className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
                    >
                      Ver calendario
                    </Link>
                    <Link
                      href="/fichas"
                      className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
                    >
                      Explorar fichas
                    </Link>
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/12 bg-white/7 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">Resumo</p>
                  <div className="mt-5 grid gap-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
                      <p className="text-4xl font-semibold text-white">{sessions.length}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-100">sessoes agendadas e visiveis no site</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
                      <p className="text-4xl font-semibold text-white">{resources.length}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-100">fichas e materiais organizados por categoria</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
                      <p className="text-4xl font-semibold text-white">1</p>
                      <p className="mt-2 text-sm leading-6 text-slate-100">area admin com autenticacao e gestao centralizada</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          {databaseWarning ? (
            <div className="mb-8">
              <DatabaseWarning message={sessionsDatabase.message ?? resourcesDatabase.message} />
            </div>
          ) : null}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">Próximas sessões</p>
              <h2 className="section-title mt-4 text-slate-950">Calendário público sempre atualizado.</h2>
            </div>
            <Link href="/calendario" className="text-sm font-semibold text-cyan-700 transition hover:text-cyan-800">
              Ver agenda completa
            </Link>
          </div>
          <p className="section-copy mt-6">
            O site apresenta as sessões mais próximas com horário, responsável, local e capacidade. A gestão é feita
            no backoffice e refletida imediatamente na área pública.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {upcomingSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,#082f49,#164e63_45%,#155e75)] px-8 py-10 text-white shadow-[0_35px_100px_-55px_rgba(8,47,73,0.85)] md:px-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/80">O que já fica preparado</p>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5">
                <h3 className="text-2xl font-semibold">Site público</h3>
                <p className="mt-3 text-sm leading-7 text-cyan-50/80">
                  Estrutura institucional com homepage, calendário, fichas e contactos.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5">
                <h3 className="text-2xl font-semibold">Admin funcional</h3>
                <p className="mt-3 text-sm leading-7 text-cyan-50/80">
                  Login, dashboard e formulários para gerir sessões e materiais.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5">
                <h3 className="text-2xl font-semibold">Persistência real</h3>
                <p className="mt-3 text-sm leading-7 text-cyan-50/80">
                  Prisma com PostgreSQL, modelo extensível e seed inicial para arrancar.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Fichas em destaque</p>
              <h2 className="section-title mt-4 text-slate-950">Materiais descarregáveis, prontos para crescer.</h2>
            </div>
            <Link href="/fichas" className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
              Ver todas as fichas
            </Link>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featuredResources.length > 0 ? (
              featuredResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
            ) : (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-slate-600 lg:col-span-3">
                Ainda não existem fichas publicadas. A área admin já permite carregar os primeiros materiais.
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
