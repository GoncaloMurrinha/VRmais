"use client";

import type { AboutPhoto } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export function AboutPhotoGallery({
  photos,
  compact = false,
}: {
  photos: AboutPhoto[];
  compact?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const activePhoto = openIndex === null ? null : photos[openIndex];

  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenIndex(null);
      }

      if (event.key === "ArrowRight") {
        setOpenIndex((currentIndex) => {
          if (currentIndex === null) {
            return 0;
          }

          return (currentIndex + 1) % photos.length;
        });
      }

      if (event.key === "ArrowLeft") {
        setOpenIndex((currentIndex) => {
          if (currentIndex === null) {
            return 0;
          }

          return (currentIndex - 1 + photos.length) % photos.length;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openIndex, photos.length]);

  useEffect(() => {
    if (openIndex === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [openIndex]);

  return (
    <>
      <div
        className={
          compact
            ? "mx-auto grid max-w-3xl gap-2 grid-cols-2 md:grid-cols-3"
            : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        }
      >
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className={
              compact
                ? "group block overflow-hidden rounded-[1rem] bg-white shadow-[0_18px_35px_-30px_rgba(15,23,42,0.18)]"
                : "group block overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_60px_-38px_rgba(15,23,42,0.24)]"
            }
            aria-label={`Abrir fotografia ${photo.title}`}
          >
            <Image
              src={photo.imagePath}
              alt={photo.title}
              width={1400}
              height={1050}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className={
                compact
                  ? "aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  : "h-auto w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              }
            />
          </button>
        ))}
      </div>

      {activePhoto ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Fechar
          </button>

          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenIndex((currentIndex) => {
                    if (currentIndex === null) {
                      return 0;
                    }

                    return (currentIndex - 1 + photos.length) % photos.length;
                  });
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                aria-label="Foto anterior"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenIndex((currentIndex) => {
                    if (currentIndex === null) {
                      return 0;
                    }

                    return (currentIndex + 1) % photos.length;
                  });
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                aria-label="Foto seguinte"
              >
                Seguinte
              </button>
            </>
          ) : null}

          <div className="w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <Image
              src={activePhoto.imagePath}
              alt={activePhoto.title}
              width={1800}
              height={1350}
              sizes="100vw"
              className="max-h-[85vh] w-full rounded-[2rem] object-contain shadow-[0_30px_100px_-45px_rgba(0,0,0,0.85)]"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
