"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/lib/admin-actions";

const initialState = {
  error: "",
};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="brand-input w-full rounded-2xl px-4 py-3 text-slate-950 ring-0"
          placeholder="admin@centroestudos.pt"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
          Palavra-passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="brand-input w-full rounded-2xl px-4 py-3 text-slate-950 ring-0"
          placeholder="Introduz a palavra-passe"
        />
      </div>
      {state.error ? <p className="text-sm text-rose-600">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="brand-button-secondary w-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "A entrar..." : "Entrar"}
      </button>
    </form>
  );
}
