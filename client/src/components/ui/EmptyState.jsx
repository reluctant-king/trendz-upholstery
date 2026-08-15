export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-ink/15 bg-surface/50 px-6 py-16 text-center">
      {icon && <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cream text-mutedGold">{icon}</div>}
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink/55">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
