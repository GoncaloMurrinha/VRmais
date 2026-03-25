export const dynamic = "force-dynamic";

import { DatabaseWarning } from "@/components/database-warning";
import { PublicPageHero } from "@/components/public-page-hero";
import { SessionCard } from "@/components/session-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedSessions } from "@/lib/data";

export default async function CalendarPage() {
  const { data: sessions, database } = await getPublishedSessions();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <PublicPageHero
          eyebrow="Calendário"
          title="Sessões, apoios e oficinas disponíveis."
          description="Esta agenda pública mostra as sessões publicadas na área de gestão. Serve como base para evoluir para marcação ou integração com disponibilidade real."
          accentClassName="text-cyan-300/80"
        />
        <section className="mx-auto w-full max-w-6xl px-6 pb-16">
          {!database.available ? (
            <div className="mb-8">
              <DatabaseWarning message={database.message} />
            </div>
          ) : null}
          <div className="grid gap-6 lg:grid-cols-2">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
