import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, description, actionText, actionTo, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-ink/20 bg-surface/40 px-6 py-16 text-center">
      {Icon && (
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gold/12 text-gold">
          <Icon size={28} />
        </span>
      )}
      <h3 className="mt-5 font-display text-xl text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink/50">{description}</p>}
      {actionText && actionTo && (
        <Link to={actionTo} className="btn-primary mt-6 px-6 py-3">
          {actionText}
        </Link>
      )}
      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary mt-6 px-6 py-3">
          {actionText}
        </button>
      )}
    </div>
  );
}
