import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { TextArea, TextInput, Toggle } from '../../components/admin/FormFields';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import SingleImageUploader from '../../components/admin/SingleImageUploader';
import { collectionApi } from '../../lib/api';
import { getErrorMessage } from '../../lib/api';
import { useSite } from '../../context/SiteContext';

const empty = { name: '', tagline: '', description: '', image: '', published: true };

export default function CollectionsManage() {
  const { collections, refresh } = useSite();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const openNew = () => {
    setForm(empty);
    setEditId(null);
    setError('');
    setModal(true);
  };

  const openEdit = (c) => {
    setForm({ name: c.name, tagline: c.tagline || '', description: c.description || '', image: c.image || '', published: c.published !== false });
    setEditId(c._id);
    setError('');
    setModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      if (editId) await collectionApi.update(editId, payload);
      else await collectionApi.create(payload);
      await refresh();
      setModal(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await collectionApi.remove(confirm._id);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Collections"
        description="Manage the signature collections shown on the homepage."
        action={<button onClick={openNew} className="btn-primary px-6 py-3"><Plus size={15} /> Add Collection</button>}
      />

      {error && <p className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <div key={c._id} className="group overflow-hidden rounded-4xl bg-white shadow-soft transition-all hover:shadow-lift">
            <div className="relative">
              <img src={c.image} alt={c.name} className="aspect-[4/3] w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-navy backdrop-blur">{c.tagline}</span>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-lg text-navy">{c.name}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${c.published ? 'bg-green-50 text-green-600' : 'bg-ink/5 text-ink/45'}`}>
                  {c.published ? 'Live' : 'Draft'}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[13px] text-ink/55">{c.description}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => openEdit(c)} className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/60 hover:border-gold hover:text-navy" aria-label="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setConfirm(c)} className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/60 hover:border-red-300 hover:text-red-500" aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)}>
        <h3 className="font-display text-2xl text-navy">{editId ? 'Edit Collection' : 'Add Collection'}</h3>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <TextInput label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextInput label="Tagline" placeholder="e.g. Timeless elegance" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          <TextArea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <SingleImageUploader label="Collection Image" aspect="aspect-[4/3]" value={form.image} onChange={(image) => setForm({ ...form, image })} folder="collections" />
          <Toggle label="Published" checked={form.published} onChange={(v) => setForm({ ...form, published: v })} />
          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModal(false)} className="btn-outline px-6 py-3">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary px-6 py-3">{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
        title="Delete this collection?"
        description={`"${confirm?.name}" will be removed from the website.`}
      />
    </>
  );
}
