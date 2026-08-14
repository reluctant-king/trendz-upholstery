import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import PageHeader from '../components/layout/PageHeader';
import Image from '../components/ui/Image';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import QuoteCTA from '../components/home/QuoteCTA';
import { useSite } from '../context/SiteContext';

const values = [
  { title: 'Craftsmanship First', description: 'Every seam, cushion and corner is finished to a standard we are proud to sign.' },
  { title: 'Made Around You', description: 'Your measurements, your fabrics, your lifestyle — we build to the space you actually live in.' },
  { title: 'Honest Pricing', description: 'Clear quotations with no hidden charges. You know exactly what your project costs.' },
  { title: 'Built to Last', description: 'Quality frames, foams and fabrics chosen for years of comfortable daily use.' },
];

const stats = [
  { value: '15+', label: 'Years of craft' },
  { value: '500+', label: 'Projects delivered' },
  { value: '100%', label: 'Custom made' },
  { value: '4.9★', label: 'Customer rating' },
];

export default function About() {
  useSeo({
    title: 'About Us',
    description:
      'Meet Trendz Upholstery — a craftsmanship-focused upholstery studio building custom sofas, upholstery and furniture around your space and lifestyle.',
  });

  const { projects } = useSite();

  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="About Our Craft"
        subtitle="We believe furniture should not simply fill a room. It should reflect the people who live there."
        image={projects[0]?.coverImage}
        crumb={[{ label: 'About' }]}
      />

      <section className="bg-cream py-16 md:py-24">
        <div className="container-px grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="overflow-hidden rounded-[2.5rem] shadow-lift">
              <Image
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80&fm=auto&fit=crop"
                alt="Inside the Trendz Upholstery workshop"
                className="aspect-[4/4.6] w-full"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="Who We Are" title="Your Furniture. Our Craftsmanship." />
            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-ink/65">
                Trendz Upholstery started with a simple belief: that good furniture shouldn't be
                thrown away, and new furniture shouldn't have to look like everyone else's. We are a
                dedicated team of upholsterers, pattern cutters and finishers who take pride in
                bringing pieces back to life and building new ones from scratch.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink/65">
                From complete sofa sets and curtains to car seat covers and custom cushions, we guide
                every project from fabric selection to final finishing — made to fit your space,
                crafted to last.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="rounded-3xl bg-white p-5 text-center shadow-soft">
                    <p className="font-display text-3xl text-gold">{s.value}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-warmWhite py-16 md:py-24">
        <div className="container-px">
          <SectionHeading
            eyebrow="What We Stand For"
            title="The Values Behind Every Stitch"
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col rounded-4xl bg-white p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-mutedGold">
                    <Check size={18} strokeWidth={3} />
                  </span>
                  <h3 className="mt-5 font-display text-lg text-navy">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/55">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 md:py-20 text-center">
        <div className="container-px">
          <SectionHeading
            eyebrow="Let's Work Together"
            title="Bring Your Furniture Back to Life"
            dark
            align="center"
          />
          <Reveal delay={0.1}>
            <Link to="/quote" className="btn-primary mt-8 px-8 py-4">
              Start Your Project <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <QuoteCTA />
    </>
  );
}
