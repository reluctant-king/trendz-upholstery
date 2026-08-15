import { useRef, useState } from 'react';
import { GripVertical, ImagePlus, Loader2, Pencil, Star, Trash2, X } from 'lucide-react';
import { uploadApi, getErrorMessage } from '../../lib/api';

const MAX_SIZE = 8 * 1024 * 1024;

export default function ImageUploader({
  value = [],
  onChange,
  max = 12,
  folder = 'projects',
  className = '',
  coverUrl = '',
  onSetCover = null,
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragIndex, setDragIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editAlt, setEditAlt] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const inputRef = useRef(null);

  const uploadFiles = async (files) => {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (list.length === 0) return;
    if (value.length + list.length > max) {
      setError(`You can add up to ${max} images.`);
      return;
    }
    const oversized = list.find((f) => f.size > MAX_SIZE);
    if (oversized) {
      setError(`Image "${oversized.name}" exceeds 8MB.`);
      return;
    }
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('folder', folder);
      list.forEach((f) => formData.append('images', f));
      const res = await uploadApi.upload(formData);
      onChange([
        ...value,
        ...res.images.map((im) => ({ url: im.url, publicId: im.publicId || '', alt: '', title: '' })),
      ]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer?.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const removeAt = (i) => {
    onChange(value.filter((_, idx) => idx !== i));
    if (editingIndex === i) setEditingIndex(-1);
  };

  const updateAt = (i, patch) => onChange(value.map((img, idx) => (idx === i ? { ...img, ...patch } : img)));

  const move = (from, to) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const openEditor = (i) => {
    setEditingIndex(i);
    setEditAlt(value[i]?.alt || '');
    setEditTitle(value[i]?.title || '');
  };

  const saveEditor = () => {
    if (editingIndex >= 0) updateAt(editingIndex, { alt: editAlt, title: editTitle });
    setEditingIndex(-1);
  };

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragging ? 'border-gold bg-gold/10' : 'border-ink/20 bg-ink/5 hover:border-mutedGold hover:bg-ink/10'
        }`}
      >
        <span className={`flex h-12 w-12 items-center justify-center rounded-full ${uploading ? 'bg-gold text-deep' : 'bg-gold/15 text-gold'}`}>
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
        </span>
        <p className="mt-3 text-sm font-medium text-ink">
          {uploading ? 'Uploading images…' : 'Drop images here or click to browse'}
        </p>
        <p className="mt-1 text-xs text-ink/45">
          Up to {max} images · JPG, PNG, WEBP · max 8MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => uploadFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-3 rounded-2xl bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{error}</p>}

      {value.length > 0 && (
        <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((img, i) => {
            const isCover = coverUrl && img.url === coverUrl;
            return (
              <li
                key={i}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex !== null && dragIndex !== i) move(dragIndex, i);
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
                className={`group relative overflow-hidden rounded-2xl border bg-beige/50 transition-all ${
                  dragIndex === i ? 'opacity-40' : 'border-ink/10'
                }`}
              >
                <img src={img.url} alt={img.alt || 'Upload preview'} className="aspect-square w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-charcoal/70 opacity-0 transition-opacity group-hover:opacity-100">
                  {onSetCover && (
                    <button
                      type="button"
                      onClick={() => onSetCover(img.url)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-deep ${isCover ? 'bg-gold' : 'bg-surface text-ink'}`}
                      aria-label="Set as cover image"
                      title="Set as cover"
                    >
                      <Star size={13} className={isCover ? 'fill-deep' : ''} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openEditor(i)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-ink"
                    aria-label="Edit alt text and title"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white"
                    aria-label="Delete image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <span className="absolute left-2 top-2 flex cursor-grab items-center rounded-md bg-surface/85 p-1 text-ink/60" title="Drag to reorder">
                  <GripVertical size={14} />
                </span>
                {img.title && (
                  <span className="absolute inset-x-0 bottom-0 truncate bg-surface/85 px-2 py-1 text-[10px] font-medium text-ink">
                    {img.title}
                  </span>
                )}
                {isCover && (
                  <span className="absolute bottom-0 left-0 rounded-tr-lg bg-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-deep">
                    Cover
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {editingIndex >= 0 && value[editingIndex] && (
        <div className="mt-4 rounded-3xl border border-gold/40 bg-surface p-4">
          <div className="flex items-start gap-3">
            <img src={value[editingIndex].url} alt="" className="h-14 w-14 rounded-xl object-cover" />
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="label-base">Image Title</label>
                <input className="input-base" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="e.g. Modern L-Shape Sofa" />
              </div>
              <div>
                <label className="label-base">Alt Text</label>
                <input className="input-base" value={editAlt} onChange={(e) => setEditAlt(e.target.value)} placeholder="Describe the image for search engines" />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={saveEditor} className="btn-primary px-5 py-2.5">
                Save
              </button>
              <button type="button" onClick={() => setEditingIndex(-1)} aria-label="Close editor" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink/60 hover:border-gold hover:text-gold">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {value.length > 0 && (
        <p className="mt-3 text-xs text-ink/45">
          Drag images to reorder. {onSetCover ? 'Use the star icon to set the cover image.' : 'The first image is used as the cover.'}
        </p>
      )}
    </div>
  );
}
