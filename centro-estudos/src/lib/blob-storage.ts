import "server-only";

import { del } from "@vercel/blob";
import { isBlobUrl } from "@/lib/utils";

export const RESOURCE_BLOB_PREFIX = "fichas/";
export const PHOTO_BLOB_PREFIX = "sobre/";

// O plano Hobby da Vercel inclui 1 GB de Blob, por isso o limite por ficheiro é conservador.
export const MAX_RESOURCE_SIZE_BYTES = 50 * 1024 * 1024;

export const RESOURCE_CONTENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/*",
];

export async function removeBlob(fileUrl: string) {
  if (!isBlobUrl(fileUrl)) {
    return;
  }

  await del(fileUrl);
}
