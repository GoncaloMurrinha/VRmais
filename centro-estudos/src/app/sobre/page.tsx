export const dynamic = "force-dynamic";

import { AboutPhotoGallery } from "@/components/about-photo-gallery";
import { DatabaseWarning } from "@/components/database-warning";
import { PublicPageHero } from "@/components/public-page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedAboutPhotos } from "@/lib/data";

export default async function AboutPage() {
  const { data: photos, database } = await getPublishedAboutPhotos();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <PublicPageHero
          eyebrow="Quem somos"
          title="Um centro de estudos focado no crescimento, no método e no desempenho dos alunos."
          description="Conhece a missão do VR+, a forma como acompanhamos os alunos e o tipo de apoio que disponibilizamos ao longo do percurso escolar."
          accentClassName="brand-accent-orange"
        />
        <section className="mx-auto w-full max-w-6xl px-6 pb-16">
          {!database.available ? (
            <div className="mb-8">
              <DatabaseWarning message={database.message} />
            </div>
          ) : null}
          <div className="content-surface p-8 md:p-10">
            <div className="max-w-4xl">
              <p className="brand-accent text-sm font-semibold uppercase tracking-[0.3em]">VR+ Centro de Estudos</p>
              <h2 className="mt-4 section-title text-slate-950">Quem somos</h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
                <p>
                  Somos um Centro de Estudos onde desenvolvemos um conjunto de estratégias para atingirmos um resultado
                  positivo na aprendizagem global dos alunos.
                </p>
                <p>
                  O VR+ tem como missão contribuir para o crescimento individual e harmonioso de cada pessoa,
                  privilegiando o ensino e incentivando o gosto pelo estudo, com vista a um melhor desempenho e ao
                  desenvolvimento de competências.
                </p>
                <p>
                  A equipa é constituída por profissionais credenciados. Acompanhamos diariamente alunos do 1º ao 12º
                  anos em todas as disciplinas, na realização dos TPC&apos;s e na preparação de testes, Provas de
                  Aferição e Exames Nacionais.
                </p>
                <p>
                  Também acompanhamos alunos individualmente, em Explicações Individuais, do 1º ao 12º anos.
                </p>
              </div>
            </div>
          </div>
          <section className="mt-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="brand-accent text-sm font-semibold uppercase tracking-[0.3em]">Galeria</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">O espaço VR+ em imagens</h2>
              </div>
            </div>
            <div className="mt-8">
              {photos.length > 0 ? (
                <AboutPhotoGallery photos={photos} />
              ) : (
                <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-slate-600">
                  A galeria do VR+ ficará disponível assim que as primeiras fotografias forem publicadas na área de
                  administração.
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
