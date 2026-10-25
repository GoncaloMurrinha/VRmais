import { Icon } from "@/components/icons";

export function DatabaseWarning({ message }: { message?: string }) {
  return (
    <div role="alert" className="flex gap-3 rounded-2xl border border-orange/50 bg-orange-soft px-4 py-4 text-sm text-ink">
      <Icon name="alert" className="mt-0.5 h-5 w-5 text-orange-deep" />
      <div>
        <p className="font-semibold">Base de dados indisponível</p>
        <p className="mt-1 leading-6 text-muted">
          Estão a ser mostrados dados de demonstração até a ligação à base de dados voltar a funcionar.
        </p>
        {message ? <p className="mt-1 text-xs text-muted">{message}</p> : null}
      </div>
    </div>
  );
}
