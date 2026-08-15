import { useEffect, useState } from 'react';
import { Home, Info, Loader2, MapPin, Save } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { TextArea, TextInput } from '../../components/admin/FormFields';
import SingleImageUploader from '../../components/admin/SingleImageUploader';
import { getErrorMessage, settingsApi } from '../../lib/api';
import { useSite } from '../../context/SiteContext';

const tabs = [
  { id: 'homepage', label: 'Homepage', icon: Home },
  { id: 'about', label: 'About', icon: Info },
  { id: 'contact', label: 'Contact', icon: MapPin },
];

export default function SiteContentManage() {
  const { settings, refresh } = useSite();
  const [tab, setTab] = useState('homepage');
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setForm({ ...settings });
  }, [settings]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await settingsApi.save(form);
      await refresh();
      setSuccess('Saved. Changes are live on the website.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Site Content"
        description="Edit the text and images that appear across your website — changes go live instantly."
      />

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setSuccess('');
              setError('');
            }}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold transition-colors ${
              tab === t.id ? 'border-gold bg-gold text-deep' : 'border-ink/15 bg-surface text-ink/55 hover:border-mutedGold'
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {error && <p className="mb-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      {success && <p className="mb-5 rounded-2xl bg-green-500/10 px-4 py-3 text-sm text-green-300">{success}</p>}

      <form onSubmit={save} className="max-w-3xl space-y-6">
        {tab === 'homepage' && (
          <>
            <div className="rounded-4xl bg-surface p-6 shadow-soft ring-1 ring-ink/10 sm:p-8">
              <h3 className="mb-5 font-display text-lg text-ink">Hero Section</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <TextInput label="Hero Heading" required value={form.heroHeading || ''} onChange={update('heroHeading')} />
                </div>
                <div className="sm:col-span-2">
                  <TextArea label="Hero Description" rows={3} value={form.heroDescription || ''} onChange={update('heroDescription')} />
                </div>
                <TextInput label="Hero Button Text" value={form.heroButtonText || ''} onChange={update('heroButtonText')} />
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <SingleImageUploader label="Base Image" hint="Before state shown first" aspect="aspect-[4/5]" value={form.heroBaseImage || ''} onChange={(url) => set('heroBaseImage', url)} folder="hero" />
                <SingleImageUploader label="Reveal Image" hint="After state revealed on hover / tap" aspect="aspect-[4/5]" value={form.heroRevealImage || ''} onChange={(url) => set('heroRevealImage', url)} folder="hero" />
              </div>
            </div>

            <div className="rounded-4xl bg-surface p-6 shadow-soft ring-1 ring-ink/10 sm:p-8">
              <h3 className="mb-5 font-display text-lg text-ink">Section Titles</h3>
              <div className="grid gap-5 sm:grid-cols-3">
                <TextInput label="Featured Work Title" value={form.featuredWorkTitle || ''} onChange={update('featuredWorkTitle')} />
                <TextInput label="Services Title" value={form.servicesTitle || ''} onChange={update('servicesTitle')} />
                <TextInput label="Testimonials Title" value={form.testimonialsTitle || ''} onChange={update('testimonialsTitle')} />
              </div>
            </div>

            <div className="rounded-4xl bg-surface p-6 shadow-soft ring-1 ring-ink/10 sm:p-8">
              <h3 className="mb-5 font-display text-lg text-ink">About Teaser</h3>
              <TextArea label="Short Description" rows={4} hint="Shown in the about preview on the homepage" value={form.aboutShortDescription || ''} onChange={update('aboutShortDescription')} />
            </div>
          </>
        )}

        {tab === 'about' && (
          <div className="rounded-4xl bg-surface p-6 shadow-soft ring-1 ring-ink/10 sm:p-8">
            <h3 className="mb-5 font-display text-lg text-ink">About Page</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextInput label="About Heading" value={form.aboutHeading || ''} onChange={update('aboutHeading')} />
              </div>
              <div className="sm:col-span-2">
                <TextArea label="About Description" rows={6} value={form.aboutDescription || ''} onChange={update('aboutDescription')} />
              </div>
              <TextInput label="Years of Experience" value={form.yearsExperience || ''} onChange={update('yearsExperience')} />
              <TextInput label="Projects Completed" value={form.projectsCompleted || ''} onChange={update('projectsCompleted')} />
              <div className="sm:col-span-2">
                <SingleImageUploader label="About Image" aspect="aspect-[16/10]" value={form.aboutImage || ''} onChange={(url) => set('aboutImage', url)} folder="about" />
              </div>
            </div>
          </div>
        )}

        {tab === 'contact' && (
          <div className="rounded-4xl bg-surface p-6 shadow-soft ring-1 ring-ink/10 sm:p-8">
            <h3 className="mb-5 font-display text-lg text-ink">Contact Details</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextInput label="Phone Number" value={form.phoneNumber || ''} onChange={update('phoneNumber')} />
              <TextInput label="WhatsApp Number" hint="Digits only, include country code" value={form.whatsappNumber || ''} onChange={update('whatsappNumber')} />
              <TextInput label="Email" value={form.email || ''} onChange={update('email')} />
              <TextInput label="Business Hours" value={form.businessHours || ''} onChange={update('businessHours')} />
              <div className="sm:col-span-2">
                <TextArea label="Address" rows={2} value={form.address || ''} onChange={update('address')} />
              </div>
              <div className="sm:col-span-2">
                <TextInput label="Google Maps Embed URL" hint="Paste the iframe src from Google Maps (starts with https://maps.google.com/maps?…)" value={form.mapEmbedUrl || ''} onChange={update('mapEmbedUrl')} />
              </div>
              <TextInput label="Instagram URL" value={form.instagram || ''} onChange={update('instagram')} />
              <TextInput label="Facebook URL" value={form.facebook || ''} onChange={update('facebook')} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button type="submit" disabled={saving} className="btn-primary px-8 py-4">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save Changes
          </button>
        </div>
      </form>
    </>
  );
}
