import { useState } from 'react';
import { Pencil, Plus, Star, Trash2 } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { PublishedBadge, TextArea, TextInput, Toggle } from '../../components/admin/FormFields';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import EmptyState from '../../components/admin/EmptyState';
import Modal from '../../components/ui/Modal';
import SingleImageUploader from '../../components/admin/SingleImageUploader';
import { testimonialApi, getErrorMessage } from '../../lib/api';
import { useSite } from '../../context/SiteContext';
import { initials } from '../../lib/utils';

const empty = { customerName: '', service: '', review: '', rating: 5, photo: '', published: true };

export default function TestimonialsManage() {
  const { testimonials, refresh } = useSite();
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

  const openEdit = (t) => {
    setForm({ customerName: t.customerName, service: t.service || '', review: t.review, rating: t.rating || 5, photo: t.photo || '', published: t.published !== false });
    setEditId(t._id);
    setError('');
    setModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editId) await testimonialApi.update(editId, form);
      else await testimonialApi.create(form);
      await refresh();
      setModal(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (t) => {
    setError('');
    try {
      await testimonialApi.update(t._id, { published: !(t.published !== false) });
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const remove = async () => {
    try {
      await testimonialApi.remove(confirm._id);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Business"
        title="Testimonials"
        description="Customer reviews shown on the homepage. Hidden reviews are not displayed."
        action={<button onClick={openNew} className="btn-primary px-6 py-3"><Plus size={15} /> Add Testimonial</button>}
      />

      {error && <p className="mb-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

      {testimonials.length === 0 ? (
        <EmptyState icon={Star} title="No testimonials yet" description="Add customer reviews to build trust on the homepage." actionText="Add Testimonial" onAction={openNew} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t._id} className="rounded-4xl bg-surface p-6 shadow-soft ring-1 ring-ink/10 transition-all hover:shadow-lift">
              <div className="flex items-center justify-between">
                <div className="flex text-gold">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className={i <= t.rating ? 'fill-gold text-gold' : 'fill-ink/15 text-ink/15'} />
                  ))}
                </div>
                <button type="button" onClick={() => togglePublished(t)} title="Toggle publish status">
                  <PublishedBadge published={t.published} labels={{ live: 'Published', draft: 'Hidden' }} />
                </button>
              </div>
              <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-ink/65">“{t.review}”</p>
              <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-4">
                <div className="flex items-center gap-2.5">
                  {t.photo ? (
                    <img src={t.photo} alt={t.customerName} className="h-9 w-9 rounded-full object-cover ring-2 ring-gold/40" />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-deep text-[11px] font-bold text-gold">{initials(t.customerName)}</span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.customerName}</p>
                    <p className="text-[11px] text-ink/45">{t.service}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(t)} className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 text-ink/60 transition-colors hover:border-gold hover:text-gold" aria-label="Edit">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setConfirm(t)} className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 text-ink/60 transition-colors hover:border-red-400/40 hover:text-red-400" aria-label="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)}>
        <h3 className="font-display text-2xl text-ink">{editId ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Customer Name" required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            <TextInput label="Service" placeholder="e.g. Sofa Upholstery" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
          </div>
          <TextArea label="Review" rows={4} required value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} />
          <SingleImageUploader label="Customer Photo" aspect="aspect-[4/3]" value={form.photo} onChange={(photo) => setForm({ ...form, photo })} folder="testimonials" />
          <div>
            <label className="label-base">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} type="button" onClick={() => setForm({ ...form, rating: i })} aria-label={`${i} star`}>
                  <Star size={26} className={`transition-colors ${i <= form.rating ? 'fill-gold text-gold' : 'fill-ink/15 text-ink/15'}`} />
                </button>
              ))}
            </div>
          </div>
          <Toggle label="Published" description="Hidden from the website when unpublished" checked={form.published} onChange={(v) => setForm({ ...form, published: v })} />
          {error && <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
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
        title="Delete this testimonial?"
        description={`Review by ${confirm?.customerName} will be removed.`}
      />
    </>
  );
}
