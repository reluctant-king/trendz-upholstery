export default function AdminPageHeader({ title, description, action, eyebrow }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="font-display text-3xl tracking-tight text-ink md:text-[2.15rem]">{title}</h1>
        {description && <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink/55">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
