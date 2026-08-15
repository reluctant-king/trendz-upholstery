import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { TextArea, TextInput } from '../../components/admin/FormFields';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import SingleImageUploader from '../../components/admin/SingleImageUploader';
import { categoryApi } from '../../lib/api';
import { getErrorMessage } from '../../lib/api';
import { useSite } from '../../context/SiteContext';

const empty = { name: '', description: '', image: '' };

export default function CategoriesManage() {
  const { categories, refresh } = useSite();
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
    setForm({ name: c.name, description: c.description || '', image: c.image || '' });
    setEditId(c._id);
    setError('');
    setModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editId) await categoryApi.update(editId, form);
      else await categoryApi.create(form);
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
      await categoryApi.remove(confirm._id);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Categories"
        description="Categories used to organise portfolio projects and filters."
        action={<button onClick={openNew} className="btn-primary px-6 py-3"><Plus size={15} /> Add Category</button>}
      />

      {error && <p className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c._id} className="group flex items-center gap-4 overflow-hidden rounded-4xl bg-surface p-4 shadow-soft transition-all hover:shadow-lift">
            <img src={c.image} alt={c.name} className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg text-navy">{c.name}</h3>
              <p className="text-[11px] text-ink/45">/{c.slug}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-mutedGold">{c.projectCount || 0} projects</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => openEdit(c)} className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink/60 hover:border-gold hover:text-navy" aria-label="Edit">
                <Pencil size={13} />
              </button>
              <button onClick={() => setConfirm(c)} className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink/60 hover:border-red-300 hover:text-red-500" aria-label="Delete">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)}>
        <h3 className="font-display text-2xl text-navy">{editId ? 'Edit Category' : 'Add Category'}</h3>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <TextInput label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextArea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <SingleImageUploader label="Category Image" aspect="aspect-[4/3]" value={form.image} onChange={(image) => setForm({ ...form, image })} folder="categories" />
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
        title="Delete this category?"
        description={`"${confirm?.name}" will be removed. Existing projects keep their category name.`}
      />
    </>
  );
}
