"use client";

import type { AboutPhoto } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";

export function AboutPhotoGallery({
  photos,
  compact = false,
}: {
  photos: AboutPhoto[];
  compact?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const activePhoto = openIndex === null ? null : photos[openIndex];

  function showNext() {
    setOpenIndex((current) => (current === null ? 0 : (current + 1) % photos.length));
  }

  function showPrevious() {
    setOpenIndex((current) => (current === null ? 0 : (current - 1 + photos.length) % photos.length));
  }

  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenIndex(null);
      }

      if (event.key === "ArrowRight") {
        setOpenIndex((current) => (current === null ? 0 : (current + 1) % photos.length));
      }

      if (event.key === "ArrowLeft") {
        setOpenIndex((current) => (current === null ? 0 : (current - 1 + photos.length) % photos.length));
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openIndex, photos.length]);

  return (
    <>
      <ul
        className={
          compact
            ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            : "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3"
        }
      >
        {photos.map((photo, index) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-teal-soft"
              aria-label={`Ampliar fotografia: ${photo.title}`}
            >
              <Image
                src={photo.imagePath}
                alt={photo.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-8 text-left text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                {photo.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {activePhoto ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          onClick={() => setOpenIndex(null)}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const startX = touchStartX.current;
            const endX = event.changedTouches[0]?.clientX;
            touchStartX.current = null;

            if (startX === null || endX === undefined || photos.length < 2) {
              return;
            }

            if (endX - startX > 60) showPrevious();
            if (startX - endX > 60) showNext();
          }}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-white">
            <p className="min-w-0 truncate text-sm font-semibold">
              {activePhoto.title}
              <span className="ml-2 font-normal text-white/60">
                {(openIndex ?? 0) + 1} / {photos.length}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Fechar"
            >
              <Icon name="close" className="h-6 w-6" />
            </button>
          </div>

          <div className="relative flex-1" onClick={(event) => event.stopPropagation()}>
            <Image
              src={activePhoto.imagePath}
              alt={activePhoto.title}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            {photos.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 sm:left-4"
                  aria-label="Fotografia anterior"
                >
                  <Icon name="arrow" className="h-6 w-6 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 sm:right-4"
                  aria-label="Fotografia seguinte"
                >
                  <Icon name="arrow" className="h-6 w-6" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
