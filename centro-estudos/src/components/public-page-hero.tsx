export function PublicPageHero({
  eyebrow,
  title,
  description,
  accentClassName,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accentClassName: string;
}) {
  return (
    <section className="dark-hero-band pb-8 md:pb-10">
      <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-12 text-white md:pb-16 md:pt-16">
        <div className="brand-panel overflow-hidden rounded-[2.5rem] border border-white/10 p-8 shadow-[0_40px_120px_-50px_rgba(16,62,73,0.8)] md:p-12">
          <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${accentClassName}`}>{eyebrow}</p>
          <h1 className="section-title mt-5 max-w-4xl text-white">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-100">{description}</p>
        </div>
      </div>
    </section>
  );
}
