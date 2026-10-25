"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Icon } from "@/components/icons";
import { UploadDropzone } from "@/components/upload-dropzone";

export function AboutPhotoUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!file) {
      setError("Escolhe uma fotografia para carregar.");
      return;
    }

    setPending(true);
    setProgress(0);

    try {
      const blob = await upload(`sobre/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });

      const response = await fetch("/api/admin/about-photos", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(formData.get("title") ?? ""),
          imageName: file.name,
          imagePath: blob.url,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          isPublished: formData.get("isPublished") === "on",
        }),
      });

      const result = (await response.json().catch(() => null)) as { success?: boolean; error?: string } | null;

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || `O pedido falhou (código ${response.status}).`);
      }

      form.reset();
      setFile(null);
      setSuccess("Fotografia carregada com sucesso.");
      router.refresh();
    } catch (submitError) {
      console.error("[about-photo-upload-form] Upload falhou.", submitError);
      setError(submitError instanceof Error ? submitError.message : "O upload falhou. Tenta novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-5 sm:p-6">
      <div>
        <h2 className="font-display text-lg font-bold text-teal-deep">Adicionar fotografia</h2>
        <p className="mt-1 text-sm text-muted">PNG, JPG, WebP ou AVIF, até 15 MB.</p>
      </div>

      <UploadDropzone
        id="about-photo-file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        title="Toca para escolher uma fotografia ou arrasta-a para aqui"
        hint="PNG, JPG, WebP ou AVIF"
        file={file}
        onFileChange={setFile}
        disabled={pending}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="about-photo-title" className="label">
            Título
          </label>
          <input
            id="about-photo-title"
            name="title"
            required
            minLength={2}
            placeholder="Ex.: Sala de estudo"
            className="field"
            disabled={pending}
          />
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 self-end rounded-xl border border-line bg-bg px-4 py-3 text-sm font-semibold text-ink">
          <input
            name="isPublished"
            type="checkbox"
            defaultChecked
            className="h-5 w-5 accent-[var(--teal)]"
            disabled={pending}
          />
          Mostrar em Quem somos
        </label>
      </div>

      {pending ? (
        <div role="status" aria-live="polite">
          <div className="flex items-center justify-between text-sm font-semibold text-teal-deep">
            <span>{progress < 100 ? "A enviar a fotografia…" : "A guardar…"}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-teal-soft">
            <div className="h-full rounded-full bg-teal transition-[width] duration-200" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          <Icon name="alert" className="mt-0.5 h-4 w-4" />
          {error}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="flex items-start gap-2 rounded-xl bg-success-soft px-4 py-3 text-sm font-medium text-success">
          <Icon name="check" className="mt-0.5 h-4 w-4" />
          {success}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn btn-secondary min-h-12 w-full sm:w-auto">
        <Icon name="upload" className="h-5 w-5" />
        {pending ? "A carregar…" : "Carregar fotografia"}
      </button>
    </form>
  );
}
