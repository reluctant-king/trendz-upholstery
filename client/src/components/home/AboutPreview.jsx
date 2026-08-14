import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import Image from '../ui/Image';

const points = [
  'Custom furniture and upholstery built around your space',
  'Fabrics, colors and finishes selected with you',
  'Careful stitching, fitting and finishing on every piece',
  'From consultation to final installation — one team',
];

export default function AboutPreview() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-px grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="overflow-hidden rounded-[2.5rem] shadow-lift">
            <Image
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80&fm=auto&fit=crop"
              alt="Our upholstery craft in the workshop"
              className="aspect-[4/4.6] w-full"
            />
          </div>
          <div className="absolute -right-4 -top-4 -z-10 h-40 w-40 rounded-full border-2 border-gold/40" />
          <div className="absolute -bottom-6 left-6 rounded-3xl bg-navy px-6 py-5 text-white shadow-lift">
            <p className="font-display text-3xl text-gold">15+</p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">Years of Craft</p>
          </div>
        </Reveal>

        <div>
          <SectionHeading
            eyebrow="About Us"
            title="About Our Craft"
            subtitle="We believe furniture should not simply fill a room. It should reflect the people who live there."
          />
          <Reveal delay={0.1}>
            <p className="mt-6 text-base leading-relaxed text-ink/60">
              Trendz Upholstery is a family-run studio dedicated to premium upholstery and custom
              furniture. From complete sofa sets to the smallest cushion, every piece is planned,
              cut and finished by hand — built to fit your space and your lifestyle.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <ul className="mt-7 space-y-3.5">
              {points.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ink/70">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.25}>
            <Link to="/about" className="btn-dark mt-9 px-8 py-4">
              Learn More About Us <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
