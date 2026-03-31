import { PublicPageHero } from "@/components/public-page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ContactPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <PublicPageHero
          eyebrow="Contactos"
          title="Ponto de contacto claro para encarregados e alunos."
          description="Informação essencial, localização e canais de contacto apresentados de forma simples e consistente."
          accentClassName="brand-accent-orange"
        />
        <section className="mx-auto w-full max-w-6xl px-6 pb-16">
          <div className="grid gap-6 md:grid-cols-3">
            <article className="content-surface p-6">
              <p className="brand-accent text-xs font-semibold uppercase tracking-[0.25em]">Morada</p>
              <h2 className="text-xl font-semibold text-slate-950">Morada</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Rua das Oliveiras, 48
                <br />
                4700-000 Braga
              </p>
            </article>
            <article className="content-surface p-6">
              <p className="brand-accent text-xs font-semibold uppercase tracking-[0.25em]">Email</p>
              <h2 className="text-xl font-semibold text-slate-950">Email</h2>
              <a
                href="mailto:geral@vrmais.pt"
                className="mt-4 inline-block text-sm font-medium leading-7 text-[var(--brand-teal)] transition hover:opacity-80"
              >
                geral@vrmais.pt
              </a>
            </article>
            <article className="content-surface p-6">
              <p className="brand-accent text-xs font-semibold uppercase tracking-[0.25em]">Telefone</p>
              <h2 className="text-xl font-semibold text-slate-950">Telefone</h2>
              <a
                href="tel:+351253000000"
                className="mt-4 inline-block text-sm font-medium leading-7 text-[var(--brand-teal)] transition hover:opacity-80"
              >
                253 000 000
              </a>
              <p className="text-sm leading-7 text-slate-600">
                <br />
                Segunda a sexta, 10h00-19h00
              </p>
            </article>
          </div>
          <div className="content-surface mt-6 grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="brand-accent text-sm font-semibold uppercase tracking-[0.25em]">Atendimento</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Informações, acompanhamento e inscrições.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Se precisares de esclarecer dúvidas sobre horários, funcionamento, apoio ao estudo ou disponibilidade,
                entra em contacto por telefone ou email. A resposta é feita em horário útil.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:geral@vrmais.pt"
                  className="brand-button-secondary inline-flex items-center justify-center px-5 py-3 text-sm font-semibold"
                >
                  Enviar email
                </a>
                <a
                  href="tel:+351253000000"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--brand-line)] bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]"
                >
                  Ligar agora
                </a>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                Atendimento presencial sujeito a marcação prévia.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-[var(--brand-line)] bg-[linear-gradient(180deg,#f8fbfb,#eef5f4)] p-6 text-[var(--foreground)]">
              <p className="brand-accent text-sm font-semibold uppercase tracking-[0.25em]">Horário</p>
              <p className="mt-4 text-3xl font-semibold">10h00 - 19h00</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">Segunda a sexta. Sábado por marcação.</p>
              <div className="mt-6 rounded-[1.25rem] bg-white px-4 py-4 text-sm leading-7 text-slate-600 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.18)]">
                Respostas por email e telefone durante o horário de atendimento.
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
