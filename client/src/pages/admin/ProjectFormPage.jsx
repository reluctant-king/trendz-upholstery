import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { Select, SubmitButton, TextArea, TextInput, Toggle } from '../../components/admin/FormFields';
import ImageUploader from '../../components/admin/ImageUploader';
import SingleImageUploader from '../../components/admin/SingleImageUploader';
import { projectApi, getErrorMessage } from '../../lib/api';
import { useSite } from '../../context/SiteContext';

const emptyProject = {
  title: '',
  categoryName: '',
  location: '',
  description: '',
  coverImage: '',
  galleryImages: [],
  featured: false,
  published: true,
};

export default function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { categories, refresh } = useSite();

  const [form, setForm] = useState(emptyProject);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const data = await projectApi.byId(id);
        const p = data.project;
        setForm({
          title: p.title || '',
          categoryName: p.categoryName || '',
          location: p.location || '',
          description: p.description || '',
          coverImage: p.coverImage || '',
          galleryImages: p.galleryImages || [],
          featured: p.featured || false,
          published: p.published !== false,
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Project title is required.');
    setSaving(true);
    try {
      const payload = { ...form };
      if (isEdit) {
        await projectApi.update(id, payload);
      } else {
        await projectApi.create(payload);
      }
      await refresh();
      navigate('/admin/our-work');
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 size={28} className="animate-spin text-gold" /></div>;
  }

  return (
    <>
      <Link to="/admin/our-work" className="mb-4 inline-flex items-center gap-2 text-sm text-ink/50 transition-colors hover:text-gold">
        <ArrowLeft size={15} /> Back to Our Work
      </Link>
      <AdminPageHeader
        eyebrow="Content"
        title={isEdit ? 'Edit Project' : 'Add New Project'}
        description="Upload new completed work and it appears on the website instantly."
      />

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-4xl bg-surface p-6 shadow-soft ring-1 ring-ink/10 sm:p-8">
            <h3 className="mb-5 font-display text-lg text-ink">Project Details</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextInput label="Project Title" required placeholder="e.g. Modern L-Shape Sofa Set" value={form.title} onChange={update('title')} />
              </div>
              <Select label="Category" required value={form.categoryName} onChange={update('categoryName')}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </Select>
              <TextInput label="Location" placeholder="e.g. Panampilly Nagar, Kochi" value={form.location} onChange={update('location')} />
              <div className="sm:col-span-2">
                <TextArea label="Description" rows={5} placeholder="Describe the project, the work completed and the result." value={form.description} onChange={update('description')} />
              </div>
            </div>
          </div>

          <div className="rounded-4xl bg-surface p-6 shadow-soft ring-1 ring-ink/10 sm:p-8">
            <h3 className="mb-5 font-display text-lg text-ink">Images</h3>
            <SingleImageUploader
              label="Cover Image"
              aspect="aspect-[16/10]"
              value={form.coverImage}
              onChange={(url) => set('coverImage', url)}
              folder="projects"
            />
            <div className="mt-6">
              <p className="label-base">Project Images</p>
              <p className="mb-3 text-xs text-ink/45">
                Upload additional photos, drag to reorder, and use the star icon to set the cover.
              </p>
              <ImageUploader
                value={form.galleryImages}
                onChange={(galleryImages) => set('galleryImages', galleryImages)}
                coverUrl={form.coverImage}
                onSetCover={(url) => set('coverImage', url)}
                max={12}
                folder="projects"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl bg-surface p-6 shadow-soft ring-1 ring-ink/10 sm:p-8 lg:sticky lg:top-24">
            <h3 className="mb-5 font-display text-lg text-ink">Publish</h3>
            <div className="space-y-3">
              <Toggle label="Featured Project" description="Shown prominently on the homepage" checked={form.featured} onChange={(v) => set('featured', v)} />
              <Toggle label="Published" description="Visible to visitors on the website" checked={form.published} onChange={(v) => set('published', v)} />
            </div>

            {error && <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

            <div className="mt-6 flex flex-col gap-3">
              <SubmitButton loading={saving}>{isEdit ? 'Save Changes' : 'Create Project'}</SubmitButton>
              <Link to="/admin/our-work" className="btn-outline w-full py-4">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
