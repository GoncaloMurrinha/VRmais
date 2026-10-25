"use client";

import { upload } from "@vercel/blob/client";
import { type FormEvent, useState } from "react";

type CreateResourceResponse = {
  success: boolean;
  error?: string;
};

async function readResponseError(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await response.json()) as { error?: string };
    return payload.error || `Pedido falhou com estado ${response.status}.`;
  }

  const text = await response.text();
  const normalizedText = text.replace(/\s+/g, " ").trim();

  if (!normalizedText) {
    return `Pedido falhou com estado ${response.status}.`;
  }

  return normalizedText.slice(0, 180);
}

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

    try {
      const blob = await upload(`fichas/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        multipart: file.size > 10 * 1024 * 1024,
      });

      const createResourceResponse = await fetch("/api/admin/resources", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          fileName: file.name,
          filePath: blob.url,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          isPublished,
        }),
      });

      if (!createResourceResponse.ok) {
        throw new Error(await readResponseError(createResourceResponse));
      }

      const createResourceResult = (await createResourceResponse.json()) as CreateResourceResponse;

      if (!createResourceResult.success) {
        throw new Error(createResourceResult.error || "Não foi possível guardar a ficha na base de dados.");
      }

      form.reset();
      window.location.assign("/admin/fichas");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "O upload falhou.";
      console.error("[resource-upload-form] Upload falhou.", submitError);
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
