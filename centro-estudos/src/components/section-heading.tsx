import Link from "next/link";
import { Icon } from "@/components/icons";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="font-display mt-2 text-2xl font-extrabold leading-tight tracking-tight text-teal-deep sm:text-3xl">
          {title}
        </h2>
        {description ? <p className="mt-3 text-base leading-7 text-muted">{description}</p> : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-teal hover:text-teal-deep"
        >
          {action.label}
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
