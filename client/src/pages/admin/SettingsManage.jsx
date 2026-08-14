import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { Field, TextInput } from '../../components/admin/FormFields';
import { authApi, getErrorMessage, settingsApi } from '../../lib/api';
import { useSite } from '../../context/SiteContext';

export default function SettingsManage() {
  const { settings, refresh } = useSite();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  useEffect(() => {
    setForm({ ...settings });
  }, [settings]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await settingsApi.save(form);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (pw.newPassword !== pw.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pw.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    setPwSaving(true);
    try {
      await authApi.changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setPwSuccess('Password updated successfully.');
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(getErrorMessage(err));
    } finally {
      setPwSaving(false);
    }
  };

  const fields = [
    { key: 'businessName', label: 'Business Name', hint: 'Shown in the logo and footer' },
    { key: 'tagline', label: 'Tagline', hint: 'Shown under the business name' },
    { key: 'whatsappNumber', label: 'WhatsApp Number', hint: 'Include country code, digits only. e.g. 919999999999' },
    { key: 'phoneNumber', label: 'Phone Number' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Business Address' },
    { key: 'businessHours', label: 'Business Hours' },
    { key: 'instagram', label: 'Instagram URL' },
    { key: 'facebook', label: 'Facebook URL' },
    { key: 'youtube', label: 'YouTube URL' },
    { key: 'mapEmbedUrl', label: 'Google Maps Embed URL', hint: 'Paste the iframe src from Google Maps (starts with https://maps.google.com/maps?…) or www.google.com/maps/embed' },
    { key: 'metaDescription', label: 'Site Meta Description', hint: 'Used for SEO across the site' },
  ];

  return (
    <>
      <AdminPageHeader title="Settings" description="Site-wide settings, contact details and SEO." />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <form onSubmit={saveSettings} className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
          <h2 className="mb-6 font-display text-xl text-navy">Site Settings</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.key === 'metaDescription' ? 'sm:col-span-2' : ''}>
                <TextInput label={f.label} hint={f.hint} value={form[f.key] || ''} onChange={update(f.key)} />
              </div>
            ))}
          </div>
          {error && <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary mt-6 px-8 py-4">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save Settings
          </button>
        </form>

        <div>
          <form onSubmit={savePassword} className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-xl text-navy">Change Password</h2>
            <p className="mt-1 text-xs text-ink/45">Keep your admin account secure.</p>
            <div className="mt-5 space-y-4">
              <Field label="Current Password">
                <input type="password" className="input-base" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
              </Field>
              <Field label="New Password">
                <input type="password" className="input-base" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required />
              </Field>
              <Field label="Confirm New Password">
                <input type="password" className="input-base" value={pw.confirmPassword} onChange={(e) => setPw({ ...pw, confirmPassword: e.target.value })} required />
              </Field>
              {pwError && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{pwError}</p>}
              {pwSuccess && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-600">{pwSuccess}</p>}
              <button type="submit" disabled={pwSaving} className="btn-outline w-full py-4">
                {pwSaving && <Loader2 size={15} className="animate-spin" />} Update Password
              </button>
            </div>
          </form>

          <div className="mt-6 rounded-4xl bg-navy p-6 text-white">
            <h3 className="font-display text-lg">Tip</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              The WhatsApp number is used by the floating chat button and all WhatsApp links across
              the website. Update it here and it changes everywhere instantly.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
