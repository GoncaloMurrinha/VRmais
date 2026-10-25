"use client";

import { type FormEvent, useState, useTransition } from "react";
import { Icon } from "@/components/icons";
import { type AdminActionResult, createAdminUser } from "@/lib/admin-actions";

function generatePassword() {
  const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = crypto.getRandomValues(new Uint32Array(14));

  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
}

export function AdminUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<AdminActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await createAdminUser(formData);
      setResult(response);

      if (response.ok) {
        setName("");
        setEmail("");
        setPassword("");
        setShowPassword(false);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-5 sm:p-6">
      <div>
        <h2 className="font-display text-lg font-bold text-teal-deep">Criar conta de professor</h2>
        <p className="mt-1 text-sm text-muted">
          O professor entra em <span className="font-semibold">/admin/login</span> com este email e esta palavra-passe.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="novo-nome" className="label">
            Nome
          </label>
          <input
            id="novo-nome"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
            autoComplete="off"
            placeholder="Ex.: Maria Silva"
            className="field"
            disabled={pending}
          />
        </div>
        <div>
          <label htmlFor="novo-email" className="label">
            Email
          </label>
          <input
            id="novo-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="off"
            inputMode="email"
            placeholder="professor@exemplo.pt"
            className="field"
            disabled={pending}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="nova-password" className="label">
            Palavra-passe
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <input
                id="nova-password"
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
            <button
              type="button"
              onClick={() => {
                setPassword(generatePassword());
                setShowPassword(true);
              }}
              className="btn btn-outline"
              disabled={pending}
            >
              Gerar palavra-passe
            </button>
          </div>
          <p className="hint">
            Mínimo de 10 caracteres. Se a gerares, copia-a e entrega-a ao professor em privado: depois de guardada já
            não é possível vê-la.
          </p>
        </div>
      </div>

      {result?.error ? (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          <Icon name="alert" className="mt-0.5 h-4 w-4" />
          {result.error}
        </p>
      ) : null}
      {result?.ok && result.message ? (
        <p role="status" className="flex items-start gap-2 rounded-xl bg-success-soft px-4 py-3 text-sm font-medium text-success">
          <Icon name="check" className="mt-0.5 h-4 w-4" />
          {result.message}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn btn-secondary min-h-12 w-full sm:w-auto">
        <Icon name="plus" className="h-5 w-5" />
        {pending ? "A criar…" : "Criar conta"}
      </button>
    </form>
  );
}
