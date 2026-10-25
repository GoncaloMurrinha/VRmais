export const dynamic = "force-dynamic";

import Link from "next/link";
import { AboutPhotoGallery } from "@/components/about-photo-gallery";
import { DatabaseWarning } from "@/components/database-warning";
import { Icon, type IconName } from "@/components/icons";
import { ResourceCard } from "@/components/resource-card";
import { SectionHeading } from "@/components/section-heading";
import { SessionCard } from "@/components/session-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedAboutPhotos, getPublishedResources, getPublishedSessions } from "@/lib/data";
import { SITE } from "@/lib/site";

const offerings = [
  "Acompanhamento diário em todas as disciplinas",
  "Apoio aos TPC e preparação de testes",
  "Provas de aferição e exames nacionais",
  "Explicações individuais do 1º ao 12º ano",
];

const quickLinks: { href: string; icon: IconName; title: string; text: string }[] = [
  { href: "/calendario", icon: "calendar", title: "Calendário", text: "Vê as próximas sessões e horários." },
  { href: "/fichas", icon: "file", title: "Fichas de apoio", text: "Descarrega materiais para estudar." },
  { href: "/contactos", icon: "phone", title: "Contactos", text: "Fala connosco ou marca uma visita." },
];

export default async function HomePage() {
  const [
    { data: sessions, database: sessionsDatabase },
    { data: resources, database: resourcesDatabase },
    { data: aboutPhotos, database: aboutPhotosDatabase },
  ] = await Promise.all([getPublishedSessions(), getPublishedResources(), getPublishedAboutPhotos()]);

  const now = new Date();
  const upcomingSessions = sessions.filter((session) => session.endAt >= now).slice(0, 3);
  const featuredResources = resources.slice(0, 3);
  const featuredPhotos = aboutPhotos.slice(0, 8);
  const databaseWarning = !sessionsDatabase.available || !resourcesDatabase.available || !aboutPhotosDatabase.available;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-teal-deep text-white">
          <div aria-hidden="true" className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-orange/15 blur-3xl" />
          <div aria-hidden="true" className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-teal/60 blur-3xl" />
          <div className="container-page relative grid gap-10 pb-24 pt-12 md:grid-cols-[1.25fr_1fr] md:items-center md:pb-28 md:pt-20">
            <div>
              <p className="eyebrow !text-orange">{SITE.name}</p>
              <h1 className="font-display mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Apoio ao estudo do <span className="text-orange">1º ao 12º ano</span>, todos os dias.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                Um espaço dedicado ao crescimento de cada aluno, com apoio escolar, preparação para testes e
                acompanhamento próximo ao longo de todo o ano letivo.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/calendario" className="btn btn-primary min-h-12 px-6 text-base">
                  <Icon name="calendar" className="h-5 w-5" />
                  Ver calendário
                </Link>
                <Link href="/fichas" className="btn btn-outline-light min-h-12 px-6 text-base">
                  <Icon name="download" className="h-5 w-5" />
                  Descarregar fichas
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur sm:p-7">
              <p className="font-display text-xl font-bold">O que fazemos</p>
              <ul className="mt-5 space-y-4">
                {offerings.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-white/90 sm:text-base">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-teal-deep">
                      <Icon name="check" className="h-4 w-4" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section aria-label="Atalhos" className="container-page relative -mt-12 md:-mt-14">
          <ul className="grid gap-3 md:grid-cols-3">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="card card-link flex h-full items-center gap-4 p-4 sm:p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-soft text-orange-deep">
                    <Icon name={item.icon} className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display block text-lg font-bold text-teal-deep">{item.title}</span>
                    <span className="block text-sm text-muted">{item.text}</span>
                  </span>
                  <Icon name="arrow" className="h-5 w-5 text-teal" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="container-page space-y-16 py-14 md:space-y-20 md:py-20">
          {databaseWarning ? (
            <DatabaseWarning
              message={sessionsDatabase.message ?? resourcesDatabase.message ?? aboutPhotosDatabase.message}
            />
          ) : null}

          <section>
            <SectionHeading
              eyebrow="Próximas sessões"
              title="O que se passa no centro"
              description="As sessões e atividades marcadas, para alunos e encarregados de educação."
              action={{ href: "/calendario", label: "Ver calendário completo" }}
            />
            {upcomingSessions.length > 0 ? (
              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                {upcomingSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            ) : (
              <div className="card mt-8 px-6 py-10 text-center">
                <p className="font-display text-lg font-bold text-teal-deep">Sem sessões marcadas de momento</p>
                <p className="mt-2 text-sm text-muted">
                  Volta em breve ou fala connosco para saberes os horários disponíveis.
                </p>
                <Link href="/contactos" className="btn btn-outline mt-5">
                  Contactar o centro
                </Link>
              </div>
            )}
          </section>

          <section>
            <SectionHeading
              eyebrow="Fichas em destaque"
              title="Materiais para estudar em casa"
              description="Fichas e documentos de apoio, prontos a descarregar."
              action={{ href: "/fichas", label: "Ver todas as fichas" }}
            />
            {featuredResources.length > 0 ? (
              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                {featuredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="card mt-8 px-6 py-10 text-center text-sm text-muted">
                Ainda não existem fichas publicadas. Em breve estarão disponíveis os primeiros materiais.
              </div>
            )}
          </section>

          {featuredPhotos.length > 0 ? (
            <section>
              <SectionHeading
                eyebrow="Galeria"
                title="O espaço VR+"
                description="Toca numa fotografia para a ver em ponto grande."
                action={{ href: "/sobre", label: "Conhecer o centro" }}
              />
              <div className="mt-8">
                <AboutPhotoGallery photos={featuredPhotos} compact />
              </div>
            </section>
          ) : null}
        </div>

        <section className="bg-teal-soft">
          <div className="container-page flex flex-col items-start gap-6 py-12 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-teal-deep sm:text-3xl">
                Tens dúvidas sobre horários ou inscrições?
              </h2>
              <p className="mt-2 text-base text-muted">{SITE.hours}. Respondemos por telefone e email.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a href={SITE.phoneHref} className="btn btn-secondary min-h-12 px-6">
                <Icon name="phone" className="h-5 w-5" />
                Ligar {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="btn btn-outline min-h-12 px-6">
                <Icon name="mail" className="h-5 w-5" />
                Enviar email
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
