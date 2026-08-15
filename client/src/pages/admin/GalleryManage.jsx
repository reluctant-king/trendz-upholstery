import { useEffect, useState } from 'react';
import { Loader2, Pencil, Star, Trash2 } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import { TextInput } from '../../components/admin/FormFields';
import { galleryApi } from '../../lib/api';
import { getErrorMessage } from '../../lib/api';
import { useSite } from '../../context/SiteContext';
import { placeholderGallery } from '../../lib/placeholderData';

export default function GalleryManage() {
  const { galleryImages, categories, refresh } = useSite();
  const [images, setImages] = useState(placeholderGallery);
  const [apiConnected, setApiConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await galleryApi.list();
        setImages(data.images);
        setApiConnected(true);
      } catch {
        setImages(placeholderGallery);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addUploaded = async (list) => {
    setSaving(true);
    setError('');
    try {
      for (const item of list) {
        await galleryApi.create({ url: item.url, publicId: item.publicId || '' });
      }
      const data = await galleryApi.list();
      setImages(data.images);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = async (img) => {
    setError('');
    try {
      await galleryApi.update(img._id, { featured: !img.featured });
      setImages((prev) => prev.map((i) => (i._id === img._id ? { ...i, featured: !img.featured } : i)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      const data = await galleryApi.update(editing._id, {
        alt: editing.alt,
        title: editing.title,
        category: editing.category,
        project: editing.project,
      });
      setImages((prev) => prev.map((i) => (i._id === editing._id ? data.image : i)));
      setEditing(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await galleryApi.remove(confirm._id);
      setImages((prev) => prev.filter((i) => i._id !== confirm._id));
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Customer gallery images — add, edit, feature or remove images."
        action={apiConnected ? null : undefined}
      />

      {error && <p className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {!apiConnected && (
        <div className="mb-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          API offline — showing sample images. Start the server to manage the real gallery.
        </div>
      )}

      <div className="rounded-4xl bg-surface p-6 shadow-soft sm:p-8">
        <h3 className="mb-4 font-display text-lg text-navy">Upload New Images</h3>
        <ImageUploader value={[]} onChange={addUploaded} max={12} folder="gallery" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-gold" /></div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img._id} className="group relative overflow-hidden rounded-3xl bg-beige/50 ring-1 ring-ink/8">
              <img src={img.url} alt={img.alt || img.title || 'Gallery image'} className="aspect-[4/3] w-full object-cover" />
              <button
                onClick={() => toggleFeatured(img)}
                aria-label="Toggle featured"
                className={`absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full shadow transition-colors ${
                  img.featured ? 'bg-gold text-deep' : 'bg-surface/85 text-ink/40 hover:text-gold'
                }`}
              >
                <Star size={15} />
              </button>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-deep/80 to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate pr-2 text-xs font-medium text-white">{img.title || img.category || 'Untitled'}</p>
                <div className="flex gap-1.5">
                  <button onClick={() => setEditing({ ...img })} className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-navy" aria-label="Edit">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setConfirm(img)} className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white" aria-label="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} maxWidth="max-w-md">
        {editing && (
          <>
            <h3 className="font-display text-2xl text-navy">Edit Image</h3>
            <div className="mt-5 overflow-hidden rounded-2xl">
              <img src={editing.url} alt={editing.alt} className="aspect-video w-full object-cover" />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEdit();
              }}
              className="mt-5 space-y-4"
            >
              <TextInput label="Image Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              <TextInput label="Alt Text" value={editing.alt} onChange={(e) => setEditing({ ...editing, alt: e.target.value })} />
              <div>
                <label className="label-base">Category</label>
                <select className="input-base" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <TextInput label="Project" placeholder="e.g. Modern L-Shape Sofa" value={editing.project} onChange={(e) => setEditing({ ...editing, project: e.target.value })} />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setEditing(null)} className="btn-outline px-6 py-3">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary px-6 py-3">{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
        title="Delete this image?"
        description="This image will be removed from the gallery."
      />
    </>
  );
}
