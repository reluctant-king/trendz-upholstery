import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import Reveal from '../ui/Reveal';
import { useSite } from '../../context/SiteContext';
import { whatsaapLink } from '../../lib/utils';

export default function QuoteCTA() {
  const { settings } = useSite();

  return (
    <section className="relative overflow-hidden bg-gold py-16 md:py-20">
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-navy/15 blur-3xl" />
      <div className="container-px relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <Reveal className="max-w-xl">
          <span className="text-[11px] font-semibold uppercase tracking-eyebrow text-navy/70">Ready When You Are</span>
          <h2 className="mt-3 font-display text-3xl leading-tight text-navy sm:text-4xl md:text-5xl">
            Have a Project in Mind?
          </h2>
          <p className="mt-3 text-base text-navy/70">
            Tell us what you need and let's create something made specifically for you.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="flex flex-wrap items-center gap-4">
          <Link to="/quote" className="btn bg-navy text-white px-8 py-4 hover:bg-black">
            Request a Quote <ArrowRight size={16} />
          </Link>
          <a
            href={whatsaapLink(settings.whatsappNumber, 'Hello, I would like to enquire about your upholstery services.')}
            target="_blank"
            rel="noreferrer"
            className="btn border-2 border-navy/30 px-8 py-[14px] text-navy hover:border-navy hover:bg-navy hover:text-white"
          >
            <MessageCircle size={16} /> WhatsApp Us
          </a>
        </Reveal>
      </div>
    </section>
  );
}
