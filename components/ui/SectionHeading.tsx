export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "mx-auto text-center" : "text-left";
  return (
    <div className={`max-w-2xl ${alignCls}`}>
      {eyebrow ? (
        <p className="text-xs font-bold tracking-[0.18em] text-sky-600 uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
