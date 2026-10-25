import "server-only";

import { del } from "@vercel/blob";
import { isBlobUrl } from "@/lib/utils";

export const RESOURCE_BLOB_PREFIX = "fichas/";
export const PHOTO_BLOB_PREFIX = "sobre/";

// O plano Hobby da Vercel inclui 1 GB de Blob, por isso o limite por ficheiro é conservador.
export const MAX_RESOURCE_SIZE_BYTES = 50 * 1024 * 1024;
export const MAX_PHOTO_SIZE_BYTES = 15 * 1024 * 1024;

// Lista explícita (sem "image/*") para não aceitar SVG, que pode conter scripts.
export const IMAGE_CONTENT_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"];

export const RESOURCE_CONTENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ...IMAGE_CONTENT_TYPES,
];

export async function removeBlob(fileUrl: string) {
  if (!isBlobUrl(fileUrl)) {
    return;
  }

  await del(fileUrl);
}
