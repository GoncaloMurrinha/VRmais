export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { DatabaseWarning } from "@/components/database-warning";
import { Icon } from "@/components/icons";
import { PublicPageHero } from "@/components/public-page-hero";
import { SessionCard } from "@/components/session-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedSessions } from "@/lib/data";
import { formatMonthYear } from "@/lib/utils";

export const metadata: Metadata = { title: "Calendário de sessões" };

export default async function CalendarPage() {
  const { data: sessions, database } = await getPublishedSessions();
  const now = new Date();

  const upcoming = sessions.filter((session) => session.endAt >= now);
  const past = sessions.filter((session) => session.endAt < now).reverse();

  const months = new Map<string, typeof upcoming>();

  for (const session of upcoming) {
    const label = formatMonthYear(session.startAt);
    months.set(label, [...(months.get(label) ?? []), session]);
  }

  return (
    <>
      <SiteHeader />
      <main>
        <PublicPageHero
          eyebrow="Calendário"
          title="Sessões, apoios e oficinas"
          description="Consulta as próximas sessões do centro, com horário, sala e responsável."
        />
        <section className="container-page py-10 md:py-14">
          {!database.available ? (
            <div className="mb-8">
              <DatabaseWarning message={database.message} />
            </div>
          ) : null}

          {upcoming.length > 0 ? (
            <div className="space-y-10">
              {[...months.entries()].map(([month, items]) => (
                <div key={month}>
                  <h2 className="font-display mb-4 flex items-center gap-3 text-xl font-bold text-teal-deep">
                    <Icon name="calendar" className="h-5 w-5 text-orange-deep" />
                    {month}
                  </h2>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {items.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center px-6 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-soft text-teal">
                <Icon name="calendar" className="h-7 w-7" />
              </div>
              <h2 className="font-display mt-4 text-xl font-bold text-teal-deep">Sem sessões marcadas de momento</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                Ainda não há novas sessões publicadas. Fala connosco para saberes os horários disponíveis.
              </p>
              <Link href="/contactos" className="btn btn-secondary mt-6">
                Contactar o centro
              </Link>
            </div>
          )}

          {past.length > 0 ? (
            <details className="group mt-12">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-semibold text-teal hover:text-teal-deep">
                <Icon name="chevron" className="h-4 w-4 transition group-open:rotate-180" />
                Sessões anteriores ({past.length})
              </summary>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {past.map((session) => (
                  <SessionCard key={session.id} session={session} past />
                ))}
              </div>
            </details>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
