export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { DatabaseWarning } from "@/components/database-warning";
import { PublicPageHero } from "@/components/public-page-hero";
import { ResourcesBrowser } from "@/components/resources-browser";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedResources } from "@/lib/data";

export const metadata: Metadata = { title: "Fichas de apoio" };

export default async function ResourcesPage() {
  const { data: resources, database } = await getPublishedResources();

  return (
    <>
      <SiteHeader />
      <main>
        <PublicPageHero
          eyebrow="Fichas"
          title="Fichas e materiais de apoio ao estudo"
          description="Procura por tema ou disciplina e descarrega o que precisas para estudar."
        />
        <section className="container-page py-10 md:py-14">
          {!database.available ? (
            <div className="mb-8">
              <DatabaseWarning message={database.message} />
            </div>
          ) : null}
          <ResourcesBrowser resources={resources} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
