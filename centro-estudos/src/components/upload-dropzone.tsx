"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { formatFileSize } from "@/lib/utils";

// Zona para escolher ou arrastar um ficheiro. O input real continua no formulário.
export function UploadDropzone({
  id,
  accept,
  title,
  hint,
  file,
  onFileChange,
  disabled,
}: {
  id: string;
  accept?: string;
  title: string;
  hint: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);

          const dropped = event.dataTransfer.files[0];

          if (disabled || !dropped || !inputRef.current) {
            return;
          }

          const transfer = new DataTransfer();
          transfer.items.add(dropped);
          inputRef.current.files = transfer.files;
          onFileChange(dropped);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragging
            ? "border-teal bg-teal-soft"
            : file
              ? "border-teal/50 bg-teal-soft/60"
              : "border-[#b7c9c6] bg-white hover:border-teal hover:bg-teal-soft/50"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-soft text-orange-deep">
          <Icon name={file ? "check" : "upload"} className="h-6 w-6" />
        </span>
        {file ? (
          <>
            <span className="max-w-full break-all text-sm font-semibold text-teal-deep">{file.name}</span>
            <span className="text-xs text-muted">{formatFileSize(file.size)} · toca para escolher outro</span>
          </>
        ) : (
          <>
            <span className="text-sm font-semibold text-teal-deep">{title}</span>
            <span className="text-xs text-muted">{hint}</span>
          </>
        )}
      </label>
      <input
        ref={inputRef}
        id={id}
        name="file"
        type="file"
        required
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
      />
    </div>
  );
}
