"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header
      className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur"
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3"
          aria-label="VR+ Centro de Estudos, página inicial"
        >
          <Image
            src="/logo-vrmais.jpeg"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 rounded-xl object-cover"
            priority
          />
          <span className="leading-tight">
            <span className="font-display block text-xl font-extrabold tracking-tight text-teal-deep">VR+</span>
            <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">
              Centro de Estudos
            </span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "bg-teal-soft text-teal-deep"
                  : "text-muted hover:bg-teal-soft/60 hover:text-teal-deep"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={SITE.phoneHref} className="btn btn-primary hidden lg:inline-flex">
            <Icon name="phone" className="h-4 w-4" />
            {SITE.phone}
          </a>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-teal-deep md:hidden"
          >
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open ? (
        <div id="menu-mobile" className="border-t border-line bg-white md:hidden">
          <nav aria-label="Principal" className="container-page flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`flex min-h-12 items-center rounded-xl px-4 text-base font-semibold ${
                  isActive(link.href) ? "bg-teal-soft text-teal-deep" : "text-ink active:bg-teal-soft"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a href={SITE.phoneHref} className="btn btn-primary mt-2 min-h-12">
              <Icon name="phone" className="h-4 w-4" />
              Ligar {SITE.phone}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
