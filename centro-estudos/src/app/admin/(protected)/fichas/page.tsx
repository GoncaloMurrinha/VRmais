export const dynamic = "force-dynamic";

import { AdminPageHeader } from "@/components/admin-page-header";
import { ConfirmDeleteForm } from "@/components/confirm-delete-form";
import { DatabaseWarning } from "@/components/database-warning";
import { Icon } from "@/components/icons";
import { ResourceUploadForm } from "@/components/resource-upload-form";
import { getAdminResourcesData } from "@/lib/data";
import { formatFileSize, getFileKind } from "@/lib/utils";

export default async function AdminResourcesPage() {
  const { resources, database } = await getAdminResourcesData();
  const categories = [...new Set(resources.map((resource) => resource.category))].sort((a, b) =>
    a.localeCompare(b, "pt-PT"),
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Fichas"
        description="Carrega PDFs e outros materiais. Ficam disponíveis para os alunos descarregarem na página Fichas."
      />

      {!database.available ? <DatabaseWarning message={database.message} /> : null}
      {database.available ? <ResourceUploadForm categories={categories} /> : null}

      <section aria-labelledby="lista-fichas">
        <h2 id="lista-fichas" className="font-display text-lg font-bold text-teal-deep">
          Fichas carregadas ({resources.length})
        </h2>

        {resources.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {resources.map((resource) => (
              <li key={resource.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-soft text-teal">
                    <Icon name="file" className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-bold text-teal-deep">{resource.title}</h3>
                      <span className={`badge ${resource.isPublished ? "badge-success" : "badge-neutral"}`}>
                        {resource.isPublished ? "Visível" : "Rascunho"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{resource.description}</p>
                    <p className="mt-1.5 break-all text-xs text-muted">
                      {resource.category} · {getFileKind(resource.mimeType, resource.fileName)} ·{" "}
                      {formatFileSize(resource.sizeBytes)} · {resource.fileName}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:w-auto sm:flex-row">
                  <a href={resource.filePath} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                    <Icon name="external" className="h-4 w-4" />
                    Abrir
                  </a>
                  {database.available ? (
                    <ConfirmDeleteForm
                      action={`/api/admin/resources/${resource.id}`}
                      fields={{ _method: "delete" }}
                      message={`Eliminar a ficha "${resource.title}"? Esta ação não pode ser desfeita.`}
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="card mt-4 px-6 py-10 text-center text-sm text-muted">
            Ainda não carregaste nenhuma ficha. Usa o formulário acima para começar.
          </p>
        )}
      </section>
    </div>
  );
}
