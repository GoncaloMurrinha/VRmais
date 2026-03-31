import "server-only";

import { createClient } from "@supabase/supabase-js";
import { slugifyFileName } from "@/lib/utils";

export const RESOURCE_BUCKET = "resources";
export const MAX_RESOURCE_SIZE_BYTES = 2_147_483_647;

export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    const missingVariables = [
      !supabaseUrl ? "SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL" : null,
      !serviceRoleKey ? "SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_SECRET_KEY" : null,
    ].filter(Boolean);

    throw new Error(`Faltam variáveis de ambiente: ${missingVariables.join(", ")}.`);
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createUniqueResourceFilePath(fileName: string) {
  const safeFileName = slugifyFileName(fileName) || "ficheiro";
  return `${Date.now()}-${safeFileName}`;
}

export function buildResourcePublicUrl(filePath: string) {
  const supabaseUrl = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/+$/, "");

  if (!supabaseUrl) {
    return null;
  }

  const encodedPath = filePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${supabaseUrl}/storage/v1/object/public/${RESOURCE_BUCKET}/${encodedPath}`;
}

export function extractResourceStoragePath(filePath: string) {
  if (filePath.startsWith("/")) {
    return null;
  }

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    const marker = `/storage/v1/object/public/${RESOURCE_BUCKET}/`;
    const [, encodedPath] = filePath.split(marker);

    return encodedPath ? decodeURIComponent(encodedPath) : null;
  }

  return filePath;
}

export async function removeResourceFromStorage(filePath: string) {
  const storagePath = extractResourceStoragePath(filePath);

  if (!storagePath) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  await supabase.storage.from(RESOURCE_BUCKET).remove([storagePath]);
}
