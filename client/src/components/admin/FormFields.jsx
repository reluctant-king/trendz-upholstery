import { Loader2 } from 'lucide-react';

export function Field({ label, required, hint, error, children }) {
  return (
    <div>
      {label && (
        <label className="label-base">
          {label} {required && <span className="text-gold">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink/45">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
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
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white px-4 py-3.5 text-left transition-colors hover:border-gold/50"
      role="switch"
      aria-checked={checked}
    >
      <span>
        <span className="block text-sm font-medium text-navy">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-ink/45">{description}</span>}
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-gold' : 'bg-ink/20'}`}>
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`}
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
  New: 'bg-blue-50 text-blue-600 border-blue-100',
  Contacted: 'bg-purple-50 text-purple-600 border-purple-100',
  'Quotation Sent': 'bg-amber-50 text-amber-700 border-amber-100',
  'In Progress': 'bg-teal-50 text-teal-600 border-teal-100',
  Completed: 'bg-green-50 text-green-600 border-green-100',
  Closed: 'bg-ink/5 text-ink/50 border-ink/10',
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${statusStyles[status] || statusStyles.New}`}>
      {status}
    </span>
  );
}
