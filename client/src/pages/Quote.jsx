import { MessageCircle } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import PageHeader from '../components/layout/PageHeader';
import QuoteForm from '../components/quote/QuoteForm';
import Reveal from '../components/ui/Reveal';
import { useSite } from '../context/SiteContext';
import { whatsaapLink } from '../lib/utils';

export default function Quote() {
  useSeo({
    title: 'Request a Quote',
    description:
      'Request a free, no-obligation quote for your upholstery or custom furniture project. Tell us what you need and we will get back within 24 hours.',
  });

  const { settings, projects } = useSite();

  return (
    <>
      <PageHeader
        eyebrow="Free Quotation"
        title="Request a Quote"
        subtitle="Tell us what you need and let's create something made specifically for you."
        image={projects[0]?.coverImage}
        crumb={[{ label: 'Quote' }]}
      />

      <section className="bg-cream py-16 md:py-24">
        <div className="container-px grid items-start gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div className="space-y-8 lg:sticky lg:top-32">
            <Reveal>
              <div className="rounded-4xl bg-deep p-8 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">Prefer to talk?</p>
                <h2 className="mt-3 font-display text-2xl">WhatsApp Us Directly</h2>
                <p className="mt-2 text-sm text-white/60">
                  Share photos of your furniture and get a quick response from our team.
                </p>
                <a
                  href={whatsaapLink(settings.whatsappNumber, 'Hello, I would like to enquire about your upholstery services.')}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1fb457]"
                >
                  <MessageCircle size={17} /> WhatsApp Us
                </a>
                <p className="mt-4 text-center text-xs text-white/40">{settings.phoneNumber}</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-4xl bg-beige/60 p-8">
                <h3 className="font-display text-xl text-navy">What happens next?</h3>
                <ol className="mt-4 space-y-3">
                  {[
                    'We review your enquiry and contact you',
                    'We discuss fabrics, measurements and budget',
                    'You receive a clear, itemised quotation',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-ink/65">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-deep">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <QuoteForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
