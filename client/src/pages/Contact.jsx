import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Instagram, Facebook, Youtube, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import PageHeader from '../components/layout/PageHeader';
import QuoteForm from '../components/quote/QuoteForm';
import Reveal from '../components/ui/Reveal';
import SectionHeading from '../components/ui/SectionHeading';
import { useSite } from '../context/SiteContext';
import { whatsaapLink } from '../lib/utils';

export default function Contact() {
  useSeo({
    title: 'Contact',
    description:
      'Get in touch with Trendz Upholstery — visit our studio, call us, message us on WhatsApp or send an enquiry for a free quote.',
  });

  const { settings, projects } = useSite();

  const cards = [
    {
      icon: Phone,
      label: 'Phone',
      value: settings.phoneNumber,
      href: `tel:${settings.phoneNumber}`,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: 'Chat with us instantly',
      href: whatsaapLink(settings.whatsappNumber, 'Hello, I would like to enquire about your upholstery services.'),
      external: true,
    },
    {
      icon: Mail,
      label: 'Email',
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      icon: Clock,
      label: 'Hours',
      value: settings.businessHours,
      href: null,
    },
    {
      icon: MapPin,
      label: 'Visit',
      value: settings.address,
      href: null,
    },
  ];

  const socials = [
    { icon: Instagram, href: settings.instagram },
    { icon: Facebook, href: settings.facebook },
    { icon: Youtube, href: settings.youtube },
  ].filter((s) => s.href);

  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title="Contact Us"
        subtitle="Questions, measurements or a rough idea in mind? We'd love to hear about it."
        image={projects[0]?.coverImage}
        crumb={[{ label: 'Contact' }]}
      />

      <section className="bg-cream py-16 md:py-24">
        <div className="container-px">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.06}>
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.external ? '_blank' : undefined}
                    rel={c.external ? 'noreferrer' : undefined}
                    className="group flex h-full items-start gap-4 rounded-4xl bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-mutedGold transition-colors group-hover:bg-gold group-hover:text-deep">
                      <c.icon size={19} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">{c.label}</p>
                      <p className="mt-1 font-medium text-navy">{c.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex h-full items-start gap-4 rounded-4xl bg-surface p-6 shadow-soft">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-mutedGold">
                      <c.icon size={19} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">{c.label}</p>
                      <p className="mt-1 font-medium text-navy">{c.value}</p>
                    </div>
                  </div>
                )}
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <div className="flex h-full flex-col justify-center gap-3 rounded-4xl bg-deep p-6 text-white">
                {socials.length > 0 && (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">Follow Us</p>
                    <div className="flex items-center gap-3">
                      {socials.map((s, i) => (
                        <a
                          key={i}
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Social link"
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-gold hover:bg-gold hover:text-deep"
                        >
                          <s.icon size={16} />
                        </a>
                      ))}
                    </div>
                  </>
                )}
                <Link to="/quote" className="btn-primary mt-4 justify-between px-5 py-3">
                  Start Your Project <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-warmWhite py-16 md:py-24">
        <div className="container-px grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Send a Message"
              title="Tell Us About Your Project"
              subtitle="Fill in the form or drop us a message on WhatsApp — we reply within 24 hours."
            />
            <div className="mt-8 overflow-hidden rounded-4xl shadow-soft">
              {settings.mapEmbedUrl ? (
                <iframe
                  title="Our location"
                  src={settings.mapEmbedUrl}
                  className="h-[300px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-[300px] w-full flex-col items-center justify-center bg-beige/60 text-center text-ink/50">
                  <MapPin size={28} className="mb-2 text-mutedGold" />
                  <p className="text-sm">{settings.address}</p>
                  <p className="mt-1 text-xs">Map embed can be set in admin settings.</p>
                </div>
              )}
            </div>
          </div>
          <Reveal delay={0.1}>
            <QuoteForm compact />
          </Reveal>
        </div>
      </section>
    </>
  );
}
