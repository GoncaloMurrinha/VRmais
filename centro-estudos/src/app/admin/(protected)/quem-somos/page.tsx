export const dynamic = "force-dynamic";

import Image from "next/image";
import { AboutPhotoDeleteForm } from "@/components/about-photo-delete-form";
import { AboutPhotoUploadForm } from "@/components/about-photo-upload-form";
import { DatabaseWarning } from "@/components/database-warning";
import { getAdminAboutPhotosData } from "@/lib/data";
import { formatFileSize } from "@/lib/utils";

export default async function AdminAboutPage() {
  const { photos, database } = await getAdminAboutPhotosData();

  return (
    <div className="space-y-8">
      <section>
        <p className="brand-accent text-sm font-semibold uppercase tracking-[0.3em]">Quem somos</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Galeria da página pública</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Carrega fotografias para a secção de galeria apresentada na página Quem somos.
        </p>
      </section>

      {!database.available ? <DatabaseWarning message={database.message} /> : null}

      {database.available ? <AboutPhotoUploadForm /> : null}

      <section className="grid gap-5">
        {photos.length > 0 ? (
          photos.map((photo) => (
            <article key={photo.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-slate-100">
                  <Image
                    src={photo.imagePath}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 18rem"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-slate-950">{photo.title}</h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          photo.isPublished ? "brand-badge" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {photo.isPublished ? "Publicado" : "Rascunho"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                      {photo.imageName} · {formatFileSize(photo.sizeBytes)}
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <a href={photo.imagePath} target="_blank" rel="noreferrer" className="brand-accent text-sm font-semibold">
                      Abrir
                    </a>
                    {database.available ? <AboutPhotoDeleteForm id={photo.id} /> : null}
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-slate-600">
            Ainda não existem fotografias publicadas para a página Quem somos.
          </div>
        )}
      </section>
    </div>
  );
}
