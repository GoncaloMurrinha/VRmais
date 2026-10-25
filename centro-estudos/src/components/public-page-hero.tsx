export function PublicPageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden bg-teal-deep text-white">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange/20 blur-3xl"
      />
      <div className="container-page relative py-12 md:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">{eyebrow}</p>
        <h1 className="font-display mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 md:text-lg">{description}</p>
      </div>
    </section>
  );
}
