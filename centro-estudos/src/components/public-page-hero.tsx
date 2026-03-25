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
    <section className="dark-hero-band">
      <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-12 text-white md:pb-16 md:pt-16">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,17,29,0.82),rgba(15,23,42,0.7))] p-8 shadow-[0_40px_120px_-50px_rgba(2,6,23,0.8)] md:p-12">
          <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${accentClassName}`}>{eyebrow}</p>
          <h1 className="section-title mt-5 max-w-4xl text-white">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-100">{description}</p>
        </div>
      </div>
    </section>
  );
}
