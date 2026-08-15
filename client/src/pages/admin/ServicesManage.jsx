import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { TextArea, TextInput, Toggle } from '../../components/admin/FormFields';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import SingleImageUploader from '../../components/admin/SingleImageUploader';
import { serviceApi } from '../../lib/api';
import { getErrorMessage } from '../../lib/api';
import { useSite } from '../../context/SiteContext';

const empty = { title: '', description: '', featuresText: '', image: '', published: true };

export default function ServicesManage() {
  const { services, refresh } = useSite();
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

  const openEdit = (s) => {
    setForm({ title: s.title, description: s.description, featuresText: (s.features || []).join(', '), image: s.image || '', published: s.published !== false });
    setEditId(s._id);
    setError('');
    setModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        image: form.image,
        published: form.published,
        features: form.featuresText.split(',').map((f) => f.trim()).filter(Boolean),
      };
      if (editId) await serviceApi.update(editId, payload);
      else await serviceApi.create(payload);
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
      await serviceApi.remove(confirm._id);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="Manage the services displayed across the website."
        action={<button onClick={openNew} className="btn-primary px-6 py-3"><Plus size={15} /> Add Service</button>}
      />

      {error && <p className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s._id} className="group overflow-hidden rounded-4xl bg-surface shadow-soft transition-all hover:shadow-lift">
            <img src={s.image} alt={s.title} className="aspect-[16/9] w-full object-cover" />
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-lg text-navy">{s.title}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${s.published ? 'bg-green-50 text-green-600' : 'bg-ink/5 text-ink/45'}`}>
                  {s.published ? 'Live' : 'Draft'}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[13px] text-ink/55">{s.description}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => openEdit(s)} className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/60 hover:border-gold hover:text-navy" aria-label="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setConfirm(s)} className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/60 hover:border-red-300 hover:text-red-500" aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)}>
        <h3 className="font-display text-2xl text-navy">{editId ? 'Edit Service' : 'Add Service'}</h3>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <TextInput label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextArea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextInput label="Features" hint="Separate with commas" value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} />
          <SingleImageUploader label="Service Image" aspect="aspect-[16/9]" value={form.image} onChange={(image) => setForm({ ...form, image })} folder="services" />
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
        title="Delete this service?"
        description={`"${confirm?.title}" will be removed from the website.`}
      />
    </>
  );
}
