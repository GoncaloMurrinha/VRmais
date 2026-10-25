export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { AboutPhotoGallery } from "@/components/about-photo-gallery";
import { DatabaseWarning } from "@/components/database-warning";
import { Icon, type IconName } from "@/components/icons";
import { PublicPageHero } from "@/components/public-page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedAboutPhotos } from "@/lib/data";

export const metadata: Metadata = { title: "Quem somos" };

const highlights: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "book",
    title: "Do 1º ao 12º ano",
    text: "Acompanhamento diário em todas as disciplinas, nos TPC e na preparação de testes, provas de aferição e exames nacionais.",
  },
  {
    icon: "users",
    title: "Equipa credenciada",
    text: "Profissionais credenciados que acompanham cada aluno com proximidade e método.",
  },
  {
    icon: "user",
    title: "Explicações individuais",
    text: "Também acompanhamos alunos individualmente, do 1º ao 12º ano.",
  },
];

export default async function AboutPage() {
  const { data: photos, database } = await getPublishedAboutPhotos();

  return (
    <>
      <SiteHeader />
      <main>
        <PublicPageHero
          eyebrow="Quem somos"
          title="Um centro de estudos focado no método e no desempenho"
          description="Conhece a missão do VR+, a forma como acompanhamos os alunos e o apoio que disponibilizamos ao longo do percurso escolar."
        />
        <div className="container-page space-y-14 py-10 md:space-y-20 md:py-16">
          {!database.available ? <DatabaseWarning message={database.message} /> : null}

          <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <div>
              <p className="eyebrow">A nossa missão</p>
              <h2 className="font-display mt-2 text-2xl font-extrabold leading-tight tracking-tight text-teal-deep sm:text-3xl">
                Resultados positivos na aprendizagem global dos alunos
              </h2>
              <div className="mt-5 space-y-4 text-base leading-7 text-muted">
                <p>
                  Somos um Centro de Estudos onde desenvolvemos um conjunto de estratégias para atingirmos um resultado
                  positivo na aprendizagem global dos alunos.
                </p>
                <p>
                  O VR+ tem como missão contribuir para o crescimento individual e harmonioso de cada pessoa,
                  privilegiando o ensino e incentivando o gosto pelo estudo, com vista a um melhor desempenho e ao
                  desenvolvimento de competências.
                </p>
              </div>
            </div>

            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item.title} className="card flex gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-soft text-orange-deep">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-teal-deep">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionHeading eyebrow="Galeria" title="O espaço VR+ em imagens" />
            <div className="mt-8">
              {photos.length > 0 ? (
                <AboutPhotoGallery photos={photos} />
              ) : (
                <div className="card px-6 py-12 text-center text-sm text-muted">
                  A galeria ficará disponível assim que as primeiras fotografias forem publicadas.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-teal-deep px-6 py-10 text-center text-white sm:px-10">
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Queres conhecer o centro?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base text-white/80">
              Marca uma visita ou esclarece as tuas dúvidas com a nossa equipa.
            </p>
            <Link href="/contactos" className="btn btn-primary mt-6 min-h-12 px-6 text-base">
              Falar connosco
              <Icon name="arrow" className="h-5 w-5" />
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
