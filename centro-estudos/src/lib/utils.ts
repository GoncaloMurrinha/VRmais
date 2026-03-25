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
