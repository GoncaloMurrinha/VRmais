import type { Session } from "@prisma/client";
import { Icon } from "@/components/icons";
import { formatDayNumber, formatMonthShort, formatSessionWhen } from "@/lib/utils";

export function SessionCard({ session, past = false }: { session: Session; past?: boolean }) {
  return (
    <article className={`card flex gap-4 p-4 sm:p-5 ${past ? "opacity-75" : ""}`}>
      <div
        className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl text-white ${
          past ? "bg-slate-500" : "bg-teal"
        }`}
        aria-hidden="true"
      >
        <span className="font-display text-2xl font-extrabold leading-none">{formatDayNumber(session.startAt)}</span>
        <span className="mt-1 text-[0.7rem] font-semibold uppercase tracking-wider">
          {formatMonthShort(session.startAt)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <span className="badge badge-orange">{session.category}</span>
        <h3 className="font-display mt-2 text-lg font-bold leading-snug text-teal-deep">{session.title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-muted">{session.description}</p>
        <ul className="mt-3 space-y-1.5 text-sm text-ink">
          <li className="flex items-start gap-2">
            <Icon name="clock" className="mt-0.5 h-4 w-4 text-teal" />
            <span>{formatSessionWhen(session.startAt, session.endAt)}</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="pin" className="mt-0.5 h-4 w-4 text-teal" />
            <span>{session.location}</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="user" className="mt-0.5 h-4 w-4 text-teal" />
            <span>{session.tutorName}</span>
          </li>
        </ul>
      </div>
    </article>
  );
}
