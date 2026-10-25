export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "full",
  }).format(date);
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateTimeRange(startAt: Date, endAt: Date) {
  const sameDay = startAt.toDateString() === endAt.toDateString();

  if (sameDay) {
    return `${formatDate(startAt)} · ${formatTime(startAt)} - ${formatTime(endAt)}`;
  }

  return `${formatDate(startAt)} ${formatTime(startAt)} → ${formatDate(endAt)} ${formatTime(endAt)}`;
}

export function formatDayNumber(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", { day: "2-digit" }).format(date);
}

export function formatMonthShort(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", { month: "short" }).format(date).replace(".", "");
}

export function formatMonthYear(date: Date) {
  const label = new Intl.DateTimeFormat("pt-PT", { month: "long", year: "numeric" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatWeekday(date: Date) {
  const label = new Intl.DateTimeFormat("pt-PT", { weekday: "long" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatSessionWhen(startAt: Date, endAt: Date) {
  if (startAt.toDateString() === endAt.toDateString()) {
    return `${formatWeekday(startAt)}, ${formatTime(startAt)} – ${formatTime(endAt)}`;
  }

  return formatDateTimeRange(startAt, endAt);
}

export function getFileKind(mimeType: string, fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";

  if (mimeType === "application/pdf" || extension === "pdf") return "PDF";
  if (extension === "doc" || extension === "docx") return "Word";
  if (extension === "ppt" || extension === "pptx") return "PowerPoint";
  if (extension === "xls" || extension === "xlsx") return "Excel";
  if (mimeType.startsWith("image/")) return "Imagem";

  return extension ? extension.toUpperCase() : "Ficheiro";
}

export function formatFileSize(sizeBytes: number) {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  const units = ["KB", "MB", "GB"];
  let value = sizeBytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export function isBlobUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export function slugifyFileName(fileName: string) {
  const [name, ...extensionParts] = fileName.split(".");
  const extension = extensionParts.join(".");
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return extension ? `${normalized}.${extension.toLowerCase()}` : normalized;
}

export function toDateTimeLocalValue(date: Date) {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}
