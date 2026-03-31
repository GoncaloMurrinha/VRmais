import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Quem somos" },
  { href: "/calendario", label: "Calendário" },
  { href: "/fichas", label: "Fichas" },
  { href: "/contactos", label: "Contactos" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(10,20,30,0.82)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-3 text-white">
          <Image
            src="/logo-vrmais.jpeg"
            alt="VR+ Centro de Estudos"
            width={56}
            height={56}
            className="h-14 w-14 rounded-2xl bg-white object-cover"
            style={{ width: "auto", height: "auto" }}
            priority
          />
          <span>
            <span className="brand-accent-orange block text-sm uppercase tracking-[0.3em]">
              Centro de Estudos
            </span>
            <span className="block text-lg font-semibold tracking-[-0.03em] text-white">VR+</span>
          </span>
        </Link>

        <nav className="flex flex-wrap gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm font-medium text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
