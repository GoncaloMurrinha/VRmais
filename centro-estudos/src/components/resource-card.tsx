import type { Resource } from "@prisma/client";
import { Icon } from "@/components/icons";
import { formatFileSize, getFileKind } from "@/lib/utils";

export function ResourceCard({ resource }: { resource: Resource }) {
  const kind = getFileKind(resource.mimeType, resource.fileName);
  const unavailable = resource.filePath === "#";

  return (
    <article className="card flex h-full flex-col p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-teal-soft text-teal">
          <Icon name="file" className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <span className="badge badge-orange">{resource.category}</span>
          <h3 className="font-display mt-2 text-lg font-bold leading-snug text-teal-deep">{resource.title}</h3>
        </div>
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{resource.description}</p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">{kind}</span> · {formatFileSize(resource.sizeBytes)}
        </p>
        {unavailable ? (
          <span className="badge badge-neutral">Exemplo</span>
        ) : (
          <a
            href={resource.filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            aria-label={`Descarregar ${resource.title}`}
          >
            <Icon name="download" className="h-4 w-4" />
            Descarregar
          </a>
        )}
      </div>
    </article>
  );
}
