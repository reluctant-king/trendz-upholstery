import { useRef, useState } from 'react';
import { ImagePlus, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { uploadApi, getErrorMessage } from '../../lib/api';

const MAX_SIZE = 8 * 1024 * 1024;

export default function SingleImageUploader({ value, onChange, folder = 'projects', label = 'Image', aspect = 'aspect-[16/10]', className = '' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > MAX_SIZE) {
      setError('Image must be under 8MB.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('folder', folder);
      formData.append('images', file);
      const res = await uploadApi.upload(formData);
      onChange(res.images[0]?.url || '');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <p className="label-base">{label}</p>
      {value ? (
        <div className="group relative overflow-hidden rounded-3xl border border-ink/10">
          <img src={value} alt={label} className={`w-full ${aspect} object-cover`} />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-navy/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy"
            >
              <RefreshCw size={13} /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white"
            >
              <Trash2 size={13} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-ink/15 bg-cream/40 ${aspect} transition-colors hover:border-mutedGold disabled:opacity-60`}
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin text-mutedGold" />
          ) : (
            <>
              <ImagePlus size={20} className="text-mutedGold" />
              <span className="mt-2 text-xs font-medium text-ink/55">Upload {label.toLowerCase()}</span>
            </>
          )}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
