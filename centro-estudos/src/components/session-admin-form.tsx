import type { Session } from "@prisma/client";
import { toDateTimeLocalValue } from "@/lib/utils";

export function SessionAdminForm({ session }: { session?: Session }) {
  return (
    <form
      action="/admin/sessoes/actions"
      method="post"
      className="content-surface grid gap-4 p-5 md:grid-cols-2 md:p-6"
    >
      <input type="hidden" name="id" value={session?.id ?? ""} />
      <div className="md:col-span-2">
        <label htmlFor={`title-${session?.id ?? "new"}`} className="mb-2 block text-sm font-medium text-slate-700">
          Título
        </label>
        <input
          id={`title-${session?.id ?? "new"}`}
          name="title"
          defaultValue={session?.title}
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <div className="md:col-span-2">
        <label
          htmlFor={`description-${session?.id ?? "new"}`}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Descrição
        </label>
        <textarea
          id={`description-${session?.id ?? "new"}`}
          name="description"
          defaultValue={session?.description}
          required
          rows={4}
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor={`category-${session?.id ?? "new"}`} className="mb-2 block text-sm font-medium text-slate-700">
          Categoria
        </label>
        <input
          id={`category-${session?.id ?? "new"}`}
          name="category"
          defaultValue={session?.category}
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor={`tutor-${session?.id ?? "new"}`} className="mb-2 block text-sm font-medium text-slate-700">
          Responsável
        </label>
        <input
          id={`tutor-${session?.id ?? "new"}`}
          name="tutorName"
          defaultValue={session?.tutorName}
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor={`location-${session?.id ?? "new"}`} className="mb-2 block text-sm font-medium text-slate-700">
          Local
        </label>
        <input
          id={`location-${session?.id ?? "new"}`}
          name="location"
          defaultValue={session?.location}
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <input type="hidden" name="capacity" value={session?.capacity ?? 10} />
      <div>
        <label htmlFor={`start-${session?.id ?? "new"}`} className="mb-2 block text-sm font-medium text-slate-700">
          Início
        </label>
        <input
          id={`start-${session?.id ?? "new"}`}
          name="startAt"
          type="datetime-local"
          defaultValue={session ? toDateTimeLocalValue(session.startAt) : ""}
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor={`end-${session?.id ?? "new"}`} className="mb-2 block text-sm font-medium text-slate-700">
          Fim
        </label>
        <input
          id={`end-${session?.id ?? "new"}`}
          name="endAt"
          type="datetime-local"
          defaultValue={session ? toDateTimeLocalValue(session.endAt) : ""}
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
        <input
          name="isPublished"
          type="checkbox"
          defaultChecked={session ? session.isPublished : true}
          className="h-4 w-4 rounded border-slate-300"
        />
        Publicada no site
      </label>
      <div className="flex items-center md:justify-end">
        <button
          type="submit"
          className="brand-button-secondary w-full px-5 py-3 text-sm font-semibold md:w-auto"
        >
          {session ? "Guardar alterações" : "Criar sessão"}
        </button>
      </div>
    </form>
  );
}
