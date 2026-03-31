export const dynamic = "force-dynamic";

import Link from "next/link";
import { AboutPhotoGallery } from "@/components/about-photo-gallery";
import { DatabaseWarning } from "@/components/database-warning";
import { ResourceCard } from "@/components/resource-card";
import { SessionCard } from "@/components/session-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedAboutPhotos, getPublishedResources, getPublishedSessions } from "@/lib/data";

export default async function HomePage() {
  const [
    { data: sessions, database: sessionsDatabase },
    { data: resources, database: resourcesDatabase },
    { data: aboutPhotos, database: aboutPhotosDatabase },
  ] = await Promise.all([getPublishedSessions(), getPublishedResources(), getPublishedAboutPhotos()]);
  const upcomingSessions = sessions.slice(0, 3);
  const featuredResources = resources.slice(0, 3);
  const featuredPhotos = aboutPhotos.slice(0, 9);
  const databaseWarning = !sessionsDatabase.available || !resourcesDatabase.available || !aboutPhotosDatabase.available;

  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <section className="dark-hero-band">
          <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-28 text-white md:pb-24 md:pt-32">
            <div className="brand-panel rounded-[2.5rem] border border-white/10 p-8 shadow-[0_40px_120px_-60px_rgba(16,62,73,0.82)] md:p-10">
              <div className="max-w-4xl">
                <p className="brand-accent-orange text-sm font-semibold uppercase tracking-[0.35em]">VR+ Centro de Estudos</p>
                <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
                  Acompanhamento diário, explicações e apoio ao estudo do 1º ao 12º ano.
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-slate-100 md:text-lg">
                  Um espaço dedicado ao crescimento individual de cada aluno, com apoio escolar, preparação para testes
                  e acompanhamento próximo ao longo de todo o ano letivo.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/sobre"
                    className="brand-button inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
                  >
                    Conhecer o VR+
                  </Link>
                  <Link
                    href="/calendario"
                    className="brand-outline-button inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
                  >
                    Ver calendário
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          {databaseWarning ? (
            <div className="mb-8">
              <DatabaseWarning
                message={sessionsDatabase.message ?? resourcesDatabase.message ?? aboutPhotosDatabase.message}
              />
            </div>
          ) : null}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="brand-accent text-sm font-semibold uppercase tracking-[0.3em]">Próximas sessões</p>
              <h2 className="section-title mt-4 text-slate-950">Calendário público sempre atualizado.</h2>
            </div>
            <Link href="/calendario" className="brand-accent text-sm font-semibold transition hover:opacity-80">
              Ver agenda completa
            </Link>
          </div>
          <p className="section-copy mt-6">
            O site apresenta as próximas sessões e atividades do centro de forma clara e acessível para alunos e
            encarregados de educação.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {upcomingSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>

        {featuredPhotos.length > 0 ? (
          <section className="mx-auto w-full max-w-6xl px-6 py-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="brand-accent text-sm font-semibold uppercase tracking-[0.3em]">Galeria</p>
                <h2 className="section-title mt-4 text-slate-950">O espaço VR+ também passa por imagens.</h2>
              </div>
              <Link href="/sobre" className="brand-accent text-sm font-semibold transition hover:opacity-80">
                Ver página Quem somos
              </Link>
            </div>
            <p className="section-copy mt-6">
              Uma pré-visualização do ambiente do centro. Podes abrir cada fotografia para ver em maior detalhe.
            </p>
            <div className="mt-8">
              <AboutPhotoGallery photos={featuredPhotos} compact />
            </div>
          </section>
        ) : null}

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="brand-accent text-sm font-semibold uppercase tracking-[0.3em]">Fichas em destaque</p>
              <h2 className="section-title mt-4 text-slate-950">Materiais descarregáveis, prontos para crescer.</h2>
            </div>
            <Link href="/fichas" className="brand-accent text-sm font-semibold transition hover:opacity-80">
              Ver todas as fichas
            </Link>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featuredResources.length > 0 ? (
              featuredResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
            ) : (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-slate-600 lg:col-span-3">
                Ainda não existem fichas publicadas. Em breve estarão disponíveis os primeiros materiais de apoio.
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
