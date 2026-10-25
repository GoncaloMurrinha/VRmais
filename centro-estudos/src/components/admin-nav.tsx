"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";

const items: { href: string; label: string; short: string; icon: IconName }[] = [
  { href: "/admin", label: "Início", short: "Início", icon: "home" },
  { href: "/admin/sessoes", label: "Sessões", short: "Sessões", icon: "calendar" },
  { href: "/admin/fichas", label: "Fichas", short: "Fichas", icon: "file" },
  { href: "/admin/quem-somos", label: "Fotografias", short: "Fotos", icon: "image" },
  { href: "/admin/professores", label: "Professores", short: "Contas", icon: "users" },
];

function useIsActive() {
  const pathname = usePathname();

  return (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
}

export function AdminSidebarNav() {
  const isActive = useIsActive();

  return (
    <nav aria-label="Administração" className="mt-8 space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={`flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition-colors ${
            isActive(item.href) ? "bg-white text-teal-deep" : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Icon name={item.icon} className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AdminBottomNav() {
  const isActive = useIsActive();

  return (
    <nav
      aria-label="Administração"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold ${
                isActive(item.href) ? "text-teal" : "text-muted"
              }`}
            >
              <span
                className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                  isActive(item.href) ? "bg-teal-soft" : ""
                }`}
              >
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              {item.short}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
