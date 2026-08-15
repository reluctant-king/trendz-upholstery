import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', description = 'This action cannot be undone.', confirmText = 'Delete', danger = true, loading = false }) {
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${danger ? 'bg-red-500/15 text-red-300' : 'bg-gold/15 text-gold'}`}>
          <AlertTriangle size={22} />
        </span>
        <div>
          <h3 className="font-display text-2xl text-ink">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{description}</p>
        </div>
      </div>
      <div className="mt-7 flex justify-end gap-3">
        <button onClick={onClose} className="btn-outline px-6 py-3">
          Cancel
        </button>
        <button
          onClick={confirm}
          disabled={busy || loading}
          className={`btn px-6 py-3 disabled:opacity-60 ${
            danger ? 'bg-red-600 text-white hover:bg-red-700' : 'btn-primary'
          }`}
        >
          {busy ? 'Please wait…' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
