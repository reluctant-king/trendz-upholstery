import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { Field, Select, SubmitButton, TextArea, TextInput, Toggle } from '../../components/admin/FormFields';
import ImageUploader from '../../components/admin/ImageUploader';
import SingleImageUploader from '../../components/admin/SingleImageUploader';
import { projectApi } from '../../lib/api';
import { getErrorMessage } from '../../lib/api';
import { useSite } from '../../context/SiteContext';

const emptyProject = {
  title: '',
  categoryName: '',
  description: '',
  location: '',
  completionDate: '',
  materials: '',
  fabric: '',
  color: '',
  services: [],
  coverImage: '',
  coverImageAlt: '',
  beforeImage: '',
  afterImage: '',
  galleryImages: [],
  featured: false,
  published: true,
  metaTitle: '',
  metaDescription: '',
};

export default function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { categories, refresh } = useSite();

  const [form, setForm] = useState(emptyProject);
  const [servicesText, setServicesText] = useState('');
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
          description: p.description || '',
          location: p.location || '',
          completionDate: p.completionDate ? String(p.completionDate).slice(0, 10) : '',
          materials: p.materials || '',
          fabric: p.fabric || '',
          color: p.color || '',
          services: p.services || [],
          coverImage: p.coverImage || '',
          coverImageAlt: p.coverImageAlt || '',
          beforeImage: p.beforeImage || '',
          afterImage: p.afterImage || '',
          galleryImages: p.galleryImages || [],
          featured: p.featured || false,
          published: p.published !== false,
          metaTitle: p.metaTitle || '',
          metaDescription: p.metaDescription || '',
        });
        setServicesText((p.services || []).join(', '));
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
      const payload = {
        ...form,
        completionDate: form.completionDate || null,
        services: servicesText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (isEdit) {
        await projectApi.update(id, payload);
      } else {
        await projectApi.create(payload);
      }
      await refresh();
      navigate('/admin/portfolio');
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
      <Link to="/admin/portfolio" className="mb-4 inline-flex items-center gap-2 text-sm text-ink/50 transition-colors hover:text-navy">
        <ArrowLeft size={15} /> Back to portfolio
      </Link>
      <AdminPageHeader
        title={isEdit ? 'Edit Project' : 'Add New Project'}
        description="Upload new completed work and it appears on the website instantly."
      />

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
            <h3 className="mb-5 font-display text-lg text-navy">Project Details</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextInput label="Project Title" required placeholder="e.g. Modern L-Shape Sofa Set" value={form.title} onChange={update('title')} />
              </div>
              <Select label="Category" value={form.categoryName} onChange={update('categoryName')}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </Select>
              <TextInput label="Location" placeholder="e.g. Panampilly Nagar, Kochi" value={form.location} onChange={update('location')} />
              <div className="sm:col-span-2">
                <TextArea label="Description" rows={5} placeholder="Describe the project, the work completed and the result." value={form.description} onChange={update('description')} />
              </div>
              <TextInput label="Completion Date" type="date" value={form.completionDate} onChange={update('completionDate')} />
              <TextInput label="Materials Used" placeholder="e.g. Hardwood frame, high-density foam" value={form.materials} onChange={update('materials')} />
              <TextInput label="Fabric Type" placeholder="e.g. Premium velvet" value={form.fabric} onChange={update('fabric')} />
              <TextInput label="Color" placeholder="e.g. Navy" value={form.color} onChange={update('color')} />
              <div className="sm:col-span-2">
                <TextInput label="Services Provided" hint="Separate multiple services with commas" placeholder="Reupholstery, Cushion replacement" value={servicesText} onChange={(e) => setServicesText(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
            <h3 className="mb-2 font-display text-lg text-navy">Images</h3>
            <p className="mb-5 text-xs text-ink/45">Upload to Cloudinary — drag to reorder. The first gallery image is the cover.</p>
            <ImageUploader value={form.galleryImages} onChange={(galleryImages) => set('galleryImages', galleryImages)} max={12} folder="projects" />
          </div>

          <div className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
            <h3 className="mb-5 font-display text-lg text-navy">Cover & Before / After</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <SingleImageUploader label="Cover Image" aspect="aspect-[4/3]" value={form.coverImage} onChange={(url) => set('coverImage', url)} folder="projects" />
              <div>
                <SingleImageUploader label="Before Image" aspect="aspect-[4/3]" value={form.beforeImage} onChange={(url) => set('beforeImage', url)} folder="before-after" />
                <div className="mt-4">
                  <SingleImageUploader label="After Image" aspect="aspect-[4/3]" value={form.afterImage} onChange={(url) => set('afterImage', url)} folder="before-after" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
            <h3 className="mb-5 font-display text-lg text-navy">SEO</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextInput label="Meta Title" hint={`Default: ${form.title || 'Project title'}`} value={form.metaTitle} onChange={update('metaTitle')} />
              </div>
              <div className="sm:col-span-2">
                <TextArea label="Meta Description" rows={3} value={form.metaDescription} onChange={update('metaDescription')} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl bg-white p-6 shadow-soft sm:p-8 lg:sticky lg:top-24">
            <h3 className="mb-5 font-display text-lg text-navy">Publish</h3>
            <div className="space-y-3">
              <Toggle label="Featured Project" description="Shown prominently on the homepage" checked={form.featured} onChange={(v) => set('featured', v)} />
              <Toggle label="Published" description="Visible to visitors on the website" checked={form.published} onChange={(v) => set('published', v)} />
            </div>

            {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

            <div className="mt-6 flex flex-col gap-3">
              <SubmitButton loading={saving}>{isEdit ? 'Save Changes' : 'Create Project'}</SubmitButton>
              <Link to="/admin/portfolio" className="btn-outline w-full py-4">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
