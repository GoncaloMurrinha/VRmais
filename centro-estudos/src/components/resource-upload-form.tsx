"use client";

import { createClient } from "@supabase/supabase-js";
import { type FormEvent, useState } from "react";

const publicSupabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

type UploadUrlResponse = {
  success: boolean;
  error?: string;
  bucket?: string;
  path?: string;
  token?: string;
  supabaseUrl?: string;
};

type CreateResourceResponse = {
  success: boolean;
  error?: string;
};

export function ResourceUploadForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "");
    const description = String(formData.get("description") ?? "");
    const category = String(formData.get("category") ?? "");
    const isPublished = formData.get("isPublished") === "on";
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      setError("Seleciona um ficheiro válido.");
      setPending(false);
      return;
    }

    if (!publicSupabaseKey) {
      setError("Falta configurar a chave pública do Supabase na Vercel.");
      setPending(false);
      return;
    }

    try {
      const uploadUrlResponse = await fetch("/api/admin/resources/upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
        }),
      });

      const uploadConfig = (await uploadUrlResponse.json()) as UploadUrlResponse;

      if (!uploadUrlResponse.ok || !uploadConfig.success || !uploadConfig.path || !uploadConfig.token || !uploadConfig.supabaseUrl) {
        throw new Error(uploadConfig.error || "Não foi possível preparar o upload.");
      }

      const supabase = createClient(uploadConfig.supabaseUrl, publicSupabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const { error: uploadError } = await supabase.storage
        .from(uploadConfig.bucket ?? "resources")
        .uploadToSignedUrl(uploadConfig.path, uploadConfig.token, file, {
          contentType: file.type || "application/octet-stream",
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Não foi possível enviar o ficheiro para o storage.");
      }

      const createResourceResponse = await fetch("/api/admin/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          fileName: file.name,
          filePath: uploadConfig.path,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          isPublished,
        }),
      });

      const createResourceResult = (await createResourceResponse.json()) as CreateResourceResponse;

      if (!createResourceResponse.ok || !createResourceResult.success) {
        throw new Error(createResourceResult.error || "Não foi possível guardar a ficha na base de dados.");
      }

      form.reset();
      window.location.assign("/admin/fichas");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "O upload falhou.";
      setError(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="content-surface grid gap-4 p-5 md:grid-cols-2 md:p-6"
    >
      <div className="md:col-span-2">
        <label htmlFor="resource-title" className="mb-2 block text-sm font-medium text-slate-700">
          Título
        </label>
        <input
          id="resource-title"
          name="title"
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="resource-description" className="mb-2 block text-sm font-medium text-slate-700">
          Descrição
        </label>
        <textarea
          id="resource-description"
          name="description"
          rows={4}
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor="resource-category" className="mb-2 block text-sm font-medium text-slate-700">
          Categoria
        </label>
        <input
          id="resource-category"
          name="category"
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor="resource-file" className="mb-2 block text-sm font-medium text-slate-700">
          Ficheiro
        </label>
        <input
          id="resource-file"
          name="file"
          type="file"
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <label className="md:col-span-2 flex items-center gap-3 text-sm font-medium text-slate-700">
        <input name="isPublished" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
        Disponível no site público
      </label>
      {error ? <p className="md:col-span-2 text-sm text-rose-600">{error}</p> : null}
      <div className="flex items-center md:justify-end">
        <button
          type="submit"
          disabled={pending}
          className="brand-button-secondary w-full px-5 py-3 text-sm font-semibold md:w-auto"
        >
          {pending ? "A carregar..." : "Carregar ficha"}
        </button>
      </div>
    </form>
  );
}
