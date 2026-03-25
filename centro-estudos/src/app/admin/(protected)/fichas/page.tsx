export const dynamic = "force-dynamic";

import { DatabaseWarning } from "@/components/database-warning";
import { ResourceDeleteForm } from "@/components/resource-delete-form";
import { ResourceUploadForm } from "@/components/resource-upload-form";
import { getAdminResourcesData } from "@/lib/data";
import { formatFileSize } from "@/lib/utils";

export default async function AdminResourcesPage() {
  const { resources, database } = await getAdminResourcesData();

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Fichas</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Upload e gestão de ficheiros</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Carrega materiais pedagógicos e publica-os diretamente na biblioteca pública.
        </p>
      </section>

      {!database.available ? <DatabaseWarning message={database.message} /> : null}

      {database.available ? <ResourceUploadForm /> : null}

      <section className="grid gap-5">
        {resources.map((resource) => (
          <article key={resource.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold text-slate-950">{resource.title}</h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      resource.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {resource.isPublished ? "Publicado" : "Rascunho"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{resource.description}</p>
                <p className="mt-3 text-sm text-slate-500">
                  {resource.category} · {resource.fileName} · {formatFileSize(resource.sizeBytes)}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <a href={resource.filePath} target="_blank" rel="noreferrer" className="text-sm font-semibold text-cyan-700">
                  Abrir
                </a>
                {database.available ? <ResourceDeleteForm id={resource.id} /> : null}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
