"use client";

import { Icon } from "@/components/icons";

// Pede confirmação antes de eliminar, para evitar apagar por engano (sobretudo no telemóvel).
export function ConfirmDeleteForm({
  action,
  fields,
  message,
  label = "Eliminar",
}: {
  action: string | ((formData: FormData) => void | Promise<void>);
  fields: Record<string, string>;
  message: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      method={typeof action === "string" ? "post" : undefined}
      onSubmit={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit" className="btn btn-danger w-full sm:w-auto">
        <Icon name="trash" className="h-4 w-4" />
        {label}
      </button>
    </form>
  );
}
