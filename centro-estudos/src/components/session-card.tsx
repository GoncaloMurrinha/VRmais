import type { Session } from "@prisma/client";
import { formatDateTimeRange } from "@/lib/utils";

export function SessionCard({ session }: { session: Session }) {
  return (
    <article className="content-surface h-full p-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
            {session.category}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">{session.title}</h3>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
          {session.capacity} vagas
        </span>
      </div>
      <p className="text-sm leading-7 text-slate-600">{session.description}</p>
      <dl className="mt-6 space-y-2 text-sm text-slate-700">
        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-3">
          <dt className="font-medium text-slate-500">Quando</dt>
          <dd className="sm:text-right">{formatDateTimeRange(session.startAt, session.endAt)}</dd>
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-3">
          <dt className="font-medium text-slate-500">Orientação</dt>
          <dd className="sm:text-right">{session.tutorName}</dd>
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-3">
          <dt className="font-medium text-slate-500">Local</dt>
          <dd className="sm:text-right">{session.location}</dd>
        </div>
      </dl>
    </article>
  );
}
