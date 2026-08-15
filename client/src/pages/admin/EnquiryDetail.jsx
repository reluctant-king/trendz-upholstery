import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Mail, MessageCircle, Phone } from 'lucide-react';
import { StatusBadge } from '../../components/admin/FormFields';
import { enquiryApi } from '../../lib/api';
import { getErrorMessage } from '../../lib/api';
import { formatDate, whatsaapLink } from '../../lib/utils';
import { useSite } from '../../context/SiteContext';
import { placeholderEnquiries } from '../../lib/placeholderEnquiries';

const statuses = ['New', 'Contacted', 'Quotation Sent', 'In Progress', 'Completed', 'Closed'];

export default function EnquiryDetail() {
  const { id } = useParams();
  const { settings } = useSite();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await enquiryApi.byId(id);
        setEnquiry(data.enquiry);
        setNotes(data.enquiry.adminNotes || '');
      } catch {
        const placeholder = placeholderEnquiries.find((e) => e._id === id);
        if (placeholder) {
          setEnquiry(placeholder);
          setNotes(placeholder.adminNotes || '');
        } else {
          setError('Enquiry not found.');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const updateStatus = async (status) => {
    if (!enquiry) return;
    const optimistic = { ...enquiry, status };
    setEnquiry(optimistic);
    setSaving(true);
    setError('');
    try {
      const data = await enquiryApi.update(id, { status });
      setEnquiry(data.enquiry);
    } catch (err) {
      setEnquiry(enquiry);
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    if (!enquiry) return;
    setSaving(true);
    setError('');
    try {
      const data = await enquiryApi.update(id, { adminNotes: notes });
      setEnquiry(data.enquiry);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Loader2 size={28} className="animate-spin text-gold" /></div>;

  if (!enquiry) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-ink/55">{error || 'Enquiry not found.'}</p>
        <Link to="/admin/enquiries" className="btn-primary mt-6 px-6 py-3">Back to Enquiries</Link>
      </div>
    );
  }

  const contact = enquiry.contactMethod;

  return (
    <>
      <Link to="/admin/enquiries" className="mb-4 inline-flex items-center gap-2 text-sm text-ink/50 transition-colors hover:text-navy">
        <ArrowLeft size={15} /> Back to enquiries
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-4xl bg-surface p-6 shadow-soft sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl text-navy">{enquiry.name}</h1>
                <p className="mt-1 text-sm text-ink/50">Received {formatDate(enquiry.createdAt)}</p>
              </div>
              <StatusBadge status={enquiry.status} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Phone, label: 'Phone', value: enquiry.phone, href: `tel:${enquiry.phone}` },
                ...(enquiry.email
                  ? [{ icon: Mail, label: 'Email', value: enquiry.email, href: `mailto:${enquiry.email}` }]
                  : []),
                {
                  icon: MessageCircle,
                  label: 'WhatsApp',
                  value: 'Message customer',
                  href: whatsaapLink(enquiry.phone.replace(/\D/g, ''), `Hello ${enquiry.name}, thank you for your enquiry with us. We'd love to discuss your project.`),
                },
              ].map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="flex items-center gap-3 rounded-2xl border border-ink/8 bg-cream/50 p-4 transition-colors hover:border-gold/40"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-mutedGold"><c.icon size={16} /></span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ink/45">{c.label}</p>
                    <p className="truncate text-sm font-medium text-navy">{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-4xl bg-surface p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-xl text-navy">Project Description</h2>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/70">{enquiry.description}</p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Service', value: enquiry.service || 'General' },
                { label: 'Budget', value: enquiry.budget || 'Not specified' },
                { label: 'Preferred Material', value: enquiry.material || 'Not specified' },
                { label: 'Preferred Contact', value: enquiry.contactMethod || 'phone' },
              ].map((d) => (
                <div key={d.label} className="rounded-2xl border border-ink/8 bg-cream/40 p-4">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-ink/45">{d.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-navy">{d.value}</dd>
                </div>
              ))}
            </dl>

            {enquiry.images && enquiry.images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-navy">Attached Images</h3>
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {enquiry.images.map((img, i) => (
                    <a key={i} href={img} target="_blank" rel="noreferrer" className="block">
                      <img src={img} alt="Enquiry attachment" className="aspect-square w-full rounded-2xl object-cover ring-1 ring-ink/10 transition-transform hover:scale-[1.03]" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl bg-surface p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-xl text-navy">Update Status</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={saving}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    enquiry.status === s ? 'border-gold bg-gold text-deep' : 'border-ink/15 text-ink/55 hover:border-mutedGold'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-4xl bg-surface p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-xl text-navy">Internal Notes</h2>
            <p className="mt-1 text-xs text-ink/45">Only visible to you, not to the customer.</p>
            <textarea
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-base mt-4 resize-none"
              placeholder="e.g. Called customer on Tuesday, quoted ₹15,000…"
            />
            <button onClick={saveNotes} disabled={saving} className="btn-primary mt-4 w-full py-3.5">
              {saving ? <Loader2 size={15} className="animate-spin" /> : 'Save Notes'}
            </button>
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          </div>

          <div className="rounded-4xl bg-deep p-6 text-white">
            <h3 className="font-display text-lg">Contact Method Preferred</h3>
            <p className="mt-1 text-sm capitalize text-white/60">{contact}</p>
            <a
              href={whatsaapLink(settings.whatsappNumber, `Hello, this is about the enquiry from ${enquiry.name}.`)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#1fb457]"
            >
              <MessageCircle size={15} /> WhatsApp Customer
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
