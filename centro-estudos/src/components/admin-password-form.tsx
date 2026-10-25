"use client";

import { type FormEvent, useState, useTransition } from "react";
import { Icon } from "@/components/icons";
import { type AdminActionResult, changeAdminPassword } from "@/lib/admin-actions";

export function AdminPasswordForm({ id, name }: { id: string; name: string }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<AdminActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await changeAdminPassword(formData);
      setResult(response);

      if (response.ok) {
        setPassword("");
        setShowPassword(false);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <div>
        <label htmlFor={`password-${id}`} className="label">
          Nova palavra-passe para {name}
        </label>
        <div className="relative">
          <input
            id={`password-${id}`}
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={10}
            maxLength={72}
            autoComplete="new-password"
            className="field pr-14"
            disabled={pending}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Esconder palavra-passe" : "Mostrar palavra-passe"}
            aria-pressed={showPassword}
            className="absolute right-1 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-teal-soft hover:text-teal-deep"
          >
            <Icon name={showPassword ? "eye-off" : "eye"} className="h-5 w-5" />
          </button>
        </div>
        <p className="hint">Mínimo de 10 caracteres.</p>
      </div>

      {result?.error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {result.error}
        </p>
      ) : null}
      {result?.ok && result.message ? (
        <p role="status" className="text-sm font-medium text-success">
          {result.message}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn btn-secondary w-full sm:w-auto">
        <Icon name="check" className="h-4 w-4" />
        {pending ? "A guardar…" : "Guardar palavra-passe"}
      </button>
    </form>
  );
}
