import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-teal-deep text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo-vrmais.jpeg" alt="" width={48} height={48} className="h-12 w-12 rounded-xl object-cover" />
            <div className="leading-tight">
              <p className="font-display text-xl font-extrabold">VR+</p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Centro de Estudos</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
            Apoio escolar, métodos de estudo e acompanhamento pedagógico do 1º ao 12º ano.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange">Navegar</p>
          <ul className="mt-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-9 items-center text-sm text-white/85 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange">Contactos</p>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            <li className="flex gap-3">
              <Icon name="pin" className="mt-0.5 h-4 w-4 text-orange" />
              <span>
                {SITE.address[0]}
                <br />
                {SITE.address[1]}
              </span>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="flex gap-3 hover:text-white">
                <Icon name="mail" className="mt-0.5 h-4 w-4 text-orange" />
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={SITE.phoneHref} className="flex gap-3 hover:text-white">
                <Icon name="phone" className="mt-0.5 h-4 w-4 text-orange" />
                {SITE.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="clock" className="mt-0.5 h-4 w-4 text-orange" />
              {SITE.hours}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.</p>
          <Link href="/admin/login" className="hover:text-white">
            Área do professor
          </Link>
        </div>
      </div>
    </footer>
  );
}
