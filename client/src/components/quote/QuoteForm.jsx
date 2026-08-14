import { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, ImagePlus, Loader2, MessageCircle, X } from 'lucide-react';
import { enquiryApi } from '../../lib/api';
import { useSite } from '../../context/SiteContext';
import { whatsaapLink } from '../../lib/utils';

const services = [
  'Sofa Set',
  'Sofa Upholstery',
  'Curtains',
  'Seat Covers',
  'Chair Upholstery',
  'Cushions',
  'Car Seat Covers',
  'Custom Furniture',
  'Headboard',
  'Other',
];

const budgets = ['Under ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', '₹50,000 – ₹1,00,000', 'Above ₹1,00,000'];

const MAX_FILES = 6;
const MAX_SIZE = 8 * 1024 * 1024;

const initialForm = {
  name: '',
  phone: '',
  email: '',
  service: '',
  description: '',
  budget: '',
  material: '',
  contactMethod: 'phone',
};

export default function QuoteForm({ compact = false }) {
  const { settings } = useSite();
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInput = useRef(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    setError('');
    if (images.length + files.length > MAX_FILES) {
      setError(`You can attach up to ${MAX_FILES} images.`);
      e.target.value = '';
      return;
    }
    const oversized = files.find((f) => f.size > MAX_SIZE);
    if (oversized) {
      setError('Each image must be under 8MB.');
      e.target.value = '';
      return;
    }
    if (files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));
    try {
      const res = await enquiryApi.uploadImages(formData);
      setImages((prev) => [...prev, ...res.images.map((im) => ({ ...im, file: im.url }))]);
    } catch (err) {
      setError('Could not upload images. Please try again or share them over WhatsApp.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) return 'Please enter a valid phone number.';
    if (!form.service) return 'Please select a service.';
    if (!form.description.trim()) return 'Please describe your project.';
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setError('');
    setSubmitting(true);
    try {
      await enquiryApi.create({
        ...form,
        images: images.map((im) => im.url || im.file),
      });
      setSuccess(true);
      setForm(initialForm);
      setImages([]);
    } catch (err) {
      setError('Could not send your enquiry right now. Please try again or message us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const waHref = whatsaapLink(
    settings.whatsappNumber,
    `Hello, I would like a quote.\nName: ${form.name}\nService: ${form.service}\n${form.description}`
  );

  if (success) {
    return (
      <div className="flex flex-col items-center rounded-4xl bg-white p-10 text-center shadow-soft">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 size={32} />
        </span>
        <h3 className="mt-5 font-display text-2xl text-navy">Thank You!</h3>
        <p className="mt-2 max-w-sm text-sm text-ink/60">
          Your enquiry has been received. Our team will get back to you within 24 hours with a
          tailored quotation.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="btn-primary mt-7 px-7 py-3"
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`rounded-4xl bg-white p-6 shadow-lift sm:p-9 ${compact ? '' : 'lg:p-12'}`}
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-base" htmlFor="q-name">Name *</label>
          <input id="q-name" className="input-base" placeholder="Your full name" value={form.name} onChange={update('name')} />
        </div>
        <div>
          <label className="label-base" htmlFor="q-phone">Phone Number *</label>
          <input id="q-phone" type="tel" className="input-base" placeholder="+91 00000 00000" value={form.phone} onChange={update('phone')} />
        </div>
        <div>
          <label className="label-base" htmlFor="q-email">Email</label>
          <input id="q-email" type="email" className="input-base" placeholder="you@email.com" value={form.email} onChange={update('email')} />
        </div>
        <div>
          <label className="label-base" htmlFor="q-service">Service *</label>
          <select id="q-service" className="input-base" value={form.service} onChange={update('service')}>
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label-base" htmlFor="q-desc">Project Description *</label>
          <textarea
            id="q-desc"
            rows={4}
            className="input-base resize-none"
            placeholder="Tell us about your sofa, chair, curtains or furniture…"
            value={form.description}
            onChange={update('description')}
          />
        </div>
        <div>
          <label className="label-base" htmlFor="q-budget">Approximate Budget</label>
          <select id="q-budget" className="input-base" value={form.budget} onChange={update('budget')}>
            <option value="">Select a range</option>
            {budgets.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-base" htmlFor="q-material">Preferred Material</label>
          <input id="q-material" className="input-base" placeholder="Velvet, linen, leather…" value={form.material} onChange={update('material')} />
        </div>
        <div>
          <label className="label-base" htmlFor="q-contact">Preferred Contact Method</label>
          <select id="q-contact" className="input-base" value={form.contactMethod} onChange={update('contactMethod')}>
            <option value="phone">Phone Call</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
          </select>
        </div>
        <div>
          <label className="label-base">Upload Images</label>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/15 bg-cream/50 px-4 py-3.5 text-sm text-ink/60 transition-colors hover:border-gold hover:text-navy disabled:opacity-60"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            {uploading ? 'Uploading…' : 'Choose images'}
          </button>
          <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
        </div>
      </div>

      <p className="mt-3 text-xs text-ink/45">Your images help us understand your project better.</p>

      {images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((im, i) => (
            <div key={i} className="group relative">
              <img src={im.url || im.file} alt="Enquiry attachment" className="h-20 w-20 rounded-xl object-cover ring-1 ring-ink/10" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label="Remove image"
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={submitting} className="btn-primary px-8 py-4 disabled:opacity-60">
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send Enquiry <ArrowRight size={16} />
            </>
          )}
        </button>
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-navy underline-offset-4 hover:underline"
        >
          <MessageCircle size={15} className="text-green-600" /> Prefer WhatsApp?
        </a>
      </div>
    </form>
  );
}
