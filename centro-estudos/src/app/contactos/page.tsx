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
          accentClassName="text-amber-300/80"
        />
        <section className="mx-auto w-full max-w-6xl px-6 pb-16">
          <div className="grid gap-6 md:grid-cols-3">
            <article className="content-surface p-6">
              <h2 className="text-xl font-semibold text-slate-950">Morada</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Rua das Oliveiras, 48
                <br />
                4700-000 Braga
              </p>
            </article>
            <article className="content-surface p-6">
              <h2 className="text-xl font-semibold text-slate-950">Email</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">geral@centroestudoshorizonte.pt</p>
            </article>
            <article className="content-surface p-6">
              <h2 className="text-xl font-semibold text-slate-950">Telefone</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                253 000 000
                <br />
                Segunda a sexta, 10h00-19h00
              </p>
            </article>
          </div>
          <div className="content-surface mt-6 grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Atendimento</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Marcações, informações e acompanhamento.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Esta secção fica pronta para evoluir para formulário de contacto, mapa integrado ou pedidos de
                inscrição. Para já, garante uma presença institucional limpa e legível.
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300/80">Horário</p>
              <p className="mt-4 text-3xl font-semibold">10h00 - 19h00</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">Segunda a sexta. Sábado por marcação.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
