import { Loader2 } from 'lucide-react';

export function Field({ label, required, hint, error, children }) {
  return (
    <div>
      {label && (
        <label className="label-base">
          {label} {required && <span className="text-mutedGold">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink/45">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function TextInput({ label, required, error, hint, className = '', ...props }) {
  return (
    <Field label={label} required={required} error={error} hint={hint}>
      <input className={`input-base ${className}`} {...props} />
    </Field>
  );
}

export function TextArea({ label, required, error, hint, rows = 4, className = '', ...props }) {
  return (
    <Field label={label} required={required} error={error} hint={hint}>
      <textarea rows={rows} className={`input-base resize-none ${className}`} {...props} />
    </Field>
  );
}

export function Select({ label, required, error, children, className = '', ...props }) {
  return (
    <Field label={label} required={required} error={error}>
      <select className={`input-base ${className}`} {...props}>
        {children}
      </select>
    </Field>
  );
}

export function Toggle({ label, checked, onChange, description }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-surface px-4 py-3.5 text-left transition-all hover:border-gold/50"
      role="switch"
      aria-checked={checked}
    >
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-ink/45">{description}</span>}
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-gold shadow-gold' : 'bg-ink/25'}`}>
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`}
        />
      </span>
    </button>
  );
}

export function SubmitButton({ loading, children, className = '' }) {
  return (
    <button type="submit" disabled={loading} className={`btn-primary px-8 py-4 disabled:opacity-60 ${className}`}>
      {loading && <Loader2 size={15} className="animate-spin" />} {children}
    </button>
  );
}

export const statusStyles = {
  New: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  Contacted: 'bg-purple-500/15 text-purple-300 border-purple-400/30',
  Completed: 'bg-green-500/15 text-green-300 border-green-400/30',
};

const statusDot = {
  New: 'bg-blue-400',
  Contacted: 'bg-purple-400',
  Completed: 'bg-green-400',
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${statusStyles[status] || statusStyles.New}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status] || statusDot.New}`} />
      {status}
    </span>
  );
}

export function PublishedBadge({ published, labels = { live: 'Published', draft: 'Draft' } }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${
        published ? 'border-green-400/30 bg-green-500/15 text-green-300' : 'border-ink/15 bg-ink/10 text-ink/50'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${published ? 'bg-green-400' : 'bg-ink/40'}`} />
      {published ? labels.live : labels.draft}
    </span>
  );
}

export function ActiveBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${
        active ? 'border-green-400/30 bg-green-500/15 text-green-300' : 'border-ink/15 bg-ink/10 text-ink/50'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-green-400' : 'bg-ink/40'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}
