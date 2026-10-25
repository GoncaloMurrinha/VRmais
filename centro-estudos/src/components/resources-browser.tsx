"use client";

import type { Resource } from "@prisma/client";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { ResourceCard } from "@/components/resource-card";

export function ResourcesBrowser({ resources }: { resources: Resource[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();

    for (const resource of resources) {
      counts.set(resource.category, (counts.get(resource.category) ?? 0) + 1);
    }

    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], "pt-PT"));
  }, [resources]);

  const filtered = useMemo(() => {
    const normalizedQuery = query
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();

    return resources.filter((resource) => {
      if (category && resource.category !== category) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return `${resource.title} ${resource.description} ${resource.category}`
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [resources, query, category]);

  if (resources.length === 0) {
    return (
      <div className="card flex flex-col items-center px-6 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-soft text-teal">
          <Icon name="file" className="h-7 w-7" />
        </div>
        <h2 className="font-display mt-4 text-xl font-bold text-teal-deep">Ainda não há fichas publicadas</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          Assim que o professor publicar os primeiros materiais de apoio, vão aparecer aqui para descarregares.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="card p-4 sm:p-5">
        <label htmlFor="pesquisa-fichas" className="label">
          Procurar uma ficha
        </label>
        <div className="relative">
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            id="pesquisa-fichas"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tema, disciplina ou título"
            className="field pl-12"
          />
        </div>

        {categories.length > 1 ? (
          <div
            className="mt-4 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filtrar por categoria"
          >
            <button
              type="button"
              onClick={() => setCategory("")}
              aria-pressed={category === ""}
              className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
                category === ""
                  ? "border-teal bg-teal text-white"
                  : "border-line bg-white text-muted hover:border-teal hover:text-teal-deep"
              }`}
            >
              Todas ({resources.length})
            </button>
            {categories.map(([name, count]) => (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(category === name ? "" : name)}
                aria-pressed={category === name}
                className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
                  category === name
                    ? "border-teal bg-teal text-white"
                    : "border-line bg-white text-muted hover:border-teal hover:text-teal-deep"
                }`}
              >
                {name} ({count})
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <p className="mt-5 text-sm text-muted" aria-live="polite">
        {filtered.length === 1 ? "1 ficha encontrada" : `${filtered.length} fichas encontradas`}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="card mt-4 px-6 py-12 text-center">
          <p className="font-display text-lg font-bold text-teal-deep">Nenhuma ficha corresponde à pesquisa</p>
          <p className="mt-2 text-sm text-muted">Tenta outras palavras ou escolhe outra categoria.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("");
            }}
            className="btn btn-outline mt-5"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
