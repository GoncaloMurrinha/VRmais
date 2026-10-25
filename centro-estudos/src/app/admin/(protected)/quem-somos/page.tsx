export const dynamic = "force-dynamic";

import Image from "next/image";
import { AboutPhotoUploadForm } from "@/components/about-photo-upload-form";
import { AdminPageHeader } from "@/components/admin-page-header";
import { ConfirmDeleteForm } from "@/components/confirm-delete-form";
import { DatabaseWarning } from "@/components/database-warning";
import { Icon } from "@/components/icons";
import { getAdminAboutPhotosData } from "@/lib/data";
import { formatFileSize } from "@/lib/utils";

export default async function AdminAboutPage() {
  const { photos, database } = await getAdminAboutPhotosData();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Fotografias"
        description="Gere a galeria da página Quem somos. As fotografias visíveis aparecem também na página inicial."
      />

      {!database.available ? <DatabaseWarning message={database.message} /> : null}
      {database.available ? <AboutPhotoUploadForm /> : null}

      <section aria-labelledby="lista-fotos">
        <h2 id="lista-fotos" className="font-display text-lg font-bold text-teal-deep">
          Fotografias carregadas ({photos.length})
        </h2>

        {photos.length > 0 ? (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <li key={photo.id} className="card flex flex-col overflow-hidden">
                <div className="relative aspect-[4/3] bg-teal-soft">
                  <Image
                    src={photo.imagePath}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-bold text-teal-deep">{photo.title}</h3>
                      <span className={`badge ${photo.isPublished ? "badge-success" : "badge-neutral"}`}>
                        {photo.isPublished ? "Visível" : "Rascunho"}
                      </span>
                    </div>
                    <p className="mt-1 break-all text-xs text-muted">
                      {photo.imageName} · {formatFileSize(photo.sizeBytes)}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                    <a href={photo.imagePath} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                      <Icon name="external" className="h-4 w-4" />
                      Abrir
                    </a>
                    {database.available ? (
                      <ConfirmDeleteForm
                        action={`/api/admin/about-photos/${photo.id}`}
                        fields={{ _method: "delete" }}
                        message={`Eliminar a fotografia "${photo.title}"? Esta ação não pode ser desfeita.`}
                      />
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="card mt-4 px-6 py-10 text-center text-sm text-muted">
            Ainda não há fotografias. Adiciona a primeira no formulário acima.
          </p>
        )}
      </section>
    </div>
  );
}
