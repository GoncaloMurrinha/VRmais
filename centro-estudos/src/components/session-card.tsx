import type { Session } from "@prisma/client";
import { formatDateTimeRange } from "@/lib/utils";

export function SessionCard({ session }: { session: Session }) {
  return (
    <article className="content-surface h-full p-6">
      <div className="mb-4">
        <p className="brand-accent text-xs font-semibold uppercase tracking-[0.25em]">{session.category}</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-950">{session.title}</h3>
      </div>
      <p className="text-sm leading-7 text-slate-600">{session.description}</p>
      <dl className="mt-6 space-y-2 text-sm text-slate-700">
        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-3">
          <dt className="font-medium text-slate-500">Quando</dt>
          <dd className="sm:text-right">{formatDateTimeRange(session.startAt, session.endAt)}</dd>
        </div>
      </dl>
    </article>
  );
}
