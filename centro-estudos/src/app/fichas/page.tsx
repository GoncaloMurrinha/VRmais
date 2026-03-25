export const dynamic = "force-dynamic";

import { DatabaseWarning } from "@/components/database-warning";
import { PublicPageHero } from "@/components/public-page-hero";
import { ResourceCard } from "@/components/resource-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedResources } from "@/lib/data";

export default async function ResourcesPage() {
  const { data: resources, database } = await getPublishedResources();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <PublicPageHero
          eyebrow="Fichas"
          title="Biblioteca de recursos para apoio ao estudo."
          description="Os materiais carregados no backoffice ficam disponíveis aqui, com descrição, categoria e descarregamento direto."
          accentClassName="text-emerald-300/80"
        />
        <section className="mx-auto w-full max-w-6xl px-6 pb-16">
          {!database.available ? (
            <div className="mb-8">
              <DatabaseWarning message={database.message} />
            </div>
          ) : null}
          <div className="grid gap-6 lg:grid-cols-3">
            {resources.length > 0 ? (
              resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
            ) : (
              <div className="content-surface p-8 text-slate-600 lg:col-span-3">
                Não há fichas publicadas neste momento.
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
