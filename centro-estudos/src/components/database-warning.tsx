export function DatabaseWarning({ message }: { message?: string }) {
  return (
    <div className="rounded-[1.75rem] border border-amber-200 bg-[linear-gradient(180deg,#fff7db,#fff3c2)] px-5 py-4 text-sm leading-7 text-amber-950 shadow-[0_18px_50px_-35px_rgba(161,98,7,0.35)]">
      <p className="font-semibold">Base de dados indisponível.</p>
      <p className="mt-1">
        O projeto esta a usar dados de demonstracao ate o PostgreSQL ficar configurado.
      </p>
      {message ? <p className="mt-2 text-amber-900/80">{message}</p> : null}
    </div>
  );
}
