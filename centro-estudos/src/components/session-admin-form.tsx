import type { Session } from "@prisma/client";
import { Icon } from "@/components/icons";
import { toDateTimeLocalValue } from "@/lib/utils";

export function SessionAdminForm({ session }: { session?: Session }) {
  const key = session?.id ?? "new";

  return (
    <form action="/admin/sessoes/actions" method="post" className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={session?.id ?? ""} />
      <input type="hidden" name="capacity" value={session?.capacity ?? 10} />

      <div className="sm:col-span-2">
        <label htmlFor={`title-${key}`} className="label">
          Título
        </label>
        <input
          id={`title-${key}`}
          name="title"
          defaultValue={session?.title}
          required
          minLength={3}
          placeholder="Ex.: Apoio ao estudo de Matemática"
          className="field"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`description-${key}`} className="label">
          Descrição
        </label>
        <textarea
          id={`description-${key}`}
          name="description"
          defaultValue={session?.description}
          required
          minLength={10}
          rows={3}
          placeholder="O que vai acontecer nesta sessão? (mínimo 10 caracteres)"
          className="field"
        />
      </div>
      <div>
        <label htmlFor={`category-${key}`} className="label">
          Disciplina ou tipo
        </label>
        <input
          id={`category-${key}`}
          name="category"
          defaultValue={session?.category}
          required
          minLength={2}
          placeholder="Ex.: Matemática"
          className="field"
        />
      </div>
      <div>
        <label htmlFor={`tutor-${key}`} className="label">
          Professor responsável
        </label>
        <input
          id={`tutor-${key}`}
          name="tutorName"
          defaultValue={session?.tutorName}
          required
          minLength={3}
          className="field"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`location-${key}`} className="label">
          Sala ou local
        </label>
        <input
          id={`location-${key}`}
          name="location"
          defaultValue={session?.location}
          required
          minLength={2}
          placeholder="Ex.: Sala 2"
          className="field"
        />
      </div>
      <div>
        <label htmlFor={`start-${key}`} className="label">
          Início
        </label>
        <input
          id={`start-${key}`}
          name="startAt"
          type="datetime-local"
          defaultValue={session ? toDateTimeLocalValue(session.startAt) : ""}
          required
          className="field"
        />
      </div>
      <div>
        <label htmlFor={`end-${key}`} className="label">
          Fim
        </label>
        <input
          id={`end-${key}`}
          name="endAt"
          type="datetime-local"
          defaultValue={session ? toDateTimeLocalValue(session.endAt) : ""}
          required
          className="field"
        />
        <p className="hint">Tem de ser depois do início.</p>
      </div>
      <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-line bg-bg px-4 py-3 text-sm font-semibold text-ink sm:col-span-2">
        <input
          name="isPublished"
          type="checkbox"
          defaultChecked={session ? session.isPublished : true}
          className="h-5 w-5 accent-[var(--teal)]"
        />
        Visível no calendário do site
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-secondary min-h-12 w-full sm:w-auto">
          <Icon name={session ? "check" : "plus"} className="h-5 w-5" />
          {session ? "Guardar alterações" : "Criar sessão"}
        </button>
      </div>
    </form>
  );
}
