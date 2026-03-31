export function DatabaseWarning({ message }: { message?: string }) {
  return (
    <div className="brand-warning rounded-[1.75rem] px-5 py-4 text-sm leading-7">
      <p className="font-semibold">Base de dados indisponível.</p>
      <p className="mt-1">
        O projeto esta a usar dados de demonstracao ate o PostgreSQL ficar configurado.
      </p>
      {message ? <p className="mt-2 opacity-80">{message}</p> : null}
    </div>
  );
}
