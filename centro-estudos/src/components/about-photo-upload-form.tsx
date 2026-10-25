"use client";

import { upload } from "@vercel/blob/client";
import { type FormEvent, useState } from "react";

export function AboutPhotoUploadForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "");
    const isPublished = formData.get("isPublished") === "on";
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      setError("Seleciona uma fotografia válida.");
      setPending(false);
      return;
    }

    try {
      const blob = await upload(`sobre/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });

      const response = await fetch("/api/admin/about-photos", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          imageName: file.name,
          imagePath: blob.url,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          isPublished,
        }),
      });

      const result = (await response.json().catch(() => null)) as { success?: boolean; error?: string } | null;

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || `Pedido falhou com estado ${response.status}.`);
      }

      form.reset();
      window.location.assign("/admin/quem-somos");
    } catch (submitError) {
      console.error("[about-photo-upload-form] Upload falhou.", submitError);
      setError(submitError instanceof Error ? submitError.message : "O upload falhou.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="content-surface grid gap-4 p-5 md:grid-cols-2 md:p-6">
      <div className="md:col-span-2">
        <label htmlFor="about-photo-title" className="mb-2 block text-sm font-medium text-slate-700">
          Título
        </label>
        <input id="about-photo-title" name="title" required className="brand-input w-full rounded-2xl px-4 py-3" />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="about-photo-file" className="mb-2 block text-sm font-medium text-slate-700">
          Fotografia
        </label>
        <input
          id="about-photo-file"
          name="file"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
        <input name="isPublished" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
        Publicar na página Quem somos
      </label>
      {error ? <p className="md:col-span-2 text-sm text-rose-600">{error}</p> : null}
      <div className="flex items-center md:justify-end">
        <button
          type="submit"
          disabled={pending}
          className="brand-button-secondary w-full px-5 py-3 text-sm font-semibold md:w-auto"
        >
          {pending ? "A carregar..." : "Carregar foto"}
        </button>
      </div>
    </form>
  );
}
