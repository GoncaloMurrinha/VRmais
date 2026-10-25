import type { Metadata } from "next";
import { Icon, type IconName } from "@/components/icons";
import { PublicPageHero } from "@/components/public-page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Contactos" };

export default function ContactPage() {
  const cards: {
    icon: IconName;
    title: string;
    lines: string[];
    action: { href: string; label: string; external?: boolean };
  }[] = [
    {
      icon: "phone",
      title: "Telefone",
      lines: [SITE.phone],
      action: { href: SITE.phoneHref, label: "Ligar agora" },
    },
    {
      icon: "mail",
      title: "Email",
      lines: [SITE.email],
      action: { href: `mailto:${SITE.email}`, label: "Enviar email" },
    },
    {
      icon: "pin",
      title: "Morada",
      lines: SITE.address,
      action: { href: SITE.mapsUrl, label: "Abrir no mapa", external: true },
    },
  ];

  return (
    <>
      <SiteHeader />
      <main>
        <PublicPageHero
          eyebrow="Contactos"
          title="Fala connosco"
          description="Esclarece dúvidas sobre horários, funcionamento, apoio ao estudo ou disponibilidade. Respondemos em horário de atendimento."
        />
        <section className="container-page py-10 md:py-14">
          <ul className="grid gap-5 md:grid-cols-3">
            {cards.map((card) => (
              <li key={card.title} className="card flex flex-col p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-soft text-orange-deep">
                  <Icon name={card.icon} className="h-6 w-6" />
                </span>
                <h2 className="font-display mt-4 text-lg font-bold text-teal-deep">{card.title}</h2>
                <p className="mt-2 flex-1 text-base leading-7 text-ink">
                  {card.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <a
                  href={card.action.href}
                  {...(card.action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="btn btn-secondary mt-5 w-full"
                >
                  {card.action.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="card mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-soft text-teal">
              <Icon name="clock" className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-teal-deep">Horário de atendimento</h2>
              <p className="mt-1 text-base text-ink">
                {SITE.hours}. {SITE.hoursNote}
              </p>
              <p className="mt-1 text-sm text-muted">Atendimento presencial sujeito a marcação prévia.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
