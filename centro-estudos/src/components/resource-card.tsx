import type { Resource } from "@prisma/client";
import { formatFileSize } from "@/lib/utils";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="content-surface flex h-full flex-col justify-between p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
          {resource.category}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-950">{resource.title}</h3>
        <p className="mt-4 text-sm leading-7 text-slate-600">{resource.description}</p>
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">{formatFileSize(resource.sizeBytes)}</p>
        <a
          href={resource.filePath}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Descarregar
        </a>
      </div>
    </article>
  );
}
