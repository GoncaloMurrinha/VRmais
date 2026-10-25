"use client";

import { useActionState, useState } from "react";
import { Icon } from "@/components/icons";
import { loginAdmin } from "@/lib/admin-actions";

const initialState = {
  error: "",
};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          inputMode="email"
          className="field"
          placeholder="o-teu-email@exemplo.pt"
        />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Palavra-passe
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            className="field pr-14"
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
      </div>
      {state.error ? (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          <Icon name="alert" className="mt-0.5 h-4 w-4" />
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="btn btn-secondary min-h-12 w-full text-base">
        {pending ? "A entrar…" : "Entrar"}
      </button>
    </form>
  );
}
