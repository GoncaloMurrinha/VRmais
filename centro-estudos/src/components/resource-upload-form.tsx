"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Icon } from "@/components/icons";
import { UploadDropzone } from "@/components/upload-dropzone";

async function readResponseError(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await response.json()) as { error?: string };
    return payload.error || `O pedido falhou (código ${response.status}).`;
  }

  const text = (await response.text()).replace(/\s+/g, " ").trim();

  return text ? text.slice(0, 180) : `O pedido falhou (código ${response.status}).`;
}

export function ResourceUploadForm({ categories = [] }: { categories?: string[] }) {
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
      setError("Escolhe um ficheiro para carregar.");
      return;
    }

    setPending(true);
    setProgress(0);

    try {
      const blob = await upload(`fichas/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        multipart: file.size > 10 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });

      const response = await fetch("/api/admin/resources", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(formData.get("title") ?? ""),
          description: String(formData.get("description") ?? ""),
          category: String(formData.get("category") ?? ""),
          fileName: file.name,
          filePath: blob.url,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          isPublished: formData.get("isPublished") === "on",
        }),
      });

      if (!response.ok) {
        throw new Error(await readResponseError(response));
      }

      const result = (await response.json()) as { success: boolean; error?: string };

      if (!result.success) {
        throw new Error(result.error || "Não foi possível guardar a ficha.");
      }

      form.reset();
      setFile(null);
      setSuccess("Ficha carregada com sucesso.");
      router.refresh();
    } catch (submitError) {
      console.error("[resource-upload-form] Upload falhou.", submitError);
      setError(submitError instanceof Error ? submitError.message : "O upload falhou. Tenta novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-5 sm:p-6">
      <div>
        <h2 className="font-display text-lg font-bold text-teal-deep">Carregar nova ficha</h2>
        <p className="mt-1 text-sm text-muted">Aceita PDF, Word, PowerPoint, Excel e imagens (até 50 MB).</p>
      </div>

      <UploadDropzone
        id="resource-file"
        title="Toca para escolher um ficheiro ou arrasta-o para aqui"
        hint="PDF, Word, PowerPoint, Excel ou imagem"
        file={file}
        onFileChange={setFile}
        disabled={pending}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="resource-title" className="label">
            Título
          </label>
          <input
            id="resource-title"
            name="title"
            required
            minLength={3}
            placeholder="Ex.: Revisão de Matemática 9.º ano"
            className="field"
            disabled={pending}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="resource-description" className="label">
            Descrição
          </label>
          <textarea
            id="resource-description"
            name="description"
            rows={3}
            required
            minLength={10}
            placeholder="Para que serve esta ficha? (mínimo 10 caracteres)"
            className="field"
            disabled={pending}
          />
        </div>
        <div>
          <label htmlFor="resource-category" className="label">
            Categoria
          </label>
          <input
            id="resource-category"
            name="category"
            list="resource-categories"
            required
            minLength={2}
            placeholder="Ex.: Matemática"
            className="field"
            disabled={pending}
          />
          <datalist id="resource-categories">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          <p className="hint">Usa a mesma categoria nas fichas do mesmo tema para os alunos as encontrarem.</p>
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 self-center rounded-xl border border-line bg-bg px-4 py-3 text-sm font-semibold text-ink">
          <input
            name="isPublished"
            type="checkbox"
            defaultChecked
            className="h-5 w-5 accent-[var(--teal)]"
            disabled={pending}
          />
          Visível no site público
        </label>
      </div>

      {pending ? (
        <div role="status" aria-live="polite">
          <div className="flex items-center justify-between text-sm font-semibold text-teal-deep">
            <span>{progress < 100 ? "A enviar o ficheiro…" : "A guardar…"}</span>
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
        {pending ? "A carregar…" : "Carregar ficha"}
      </button>
    </form>
  );
}
