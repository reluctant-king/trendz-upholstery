import { useState } from 'react';
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
      <h3 className="font-display text-2xl text-navy">{title}</h3>
      <p className="mt-2 text-sm text-ink/55">{description}</p>
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
