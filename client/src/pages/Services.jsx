import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSeo } from '../hooks/useSeo';
import PageHeader from '../components/layout/PageHeader';
import Image from '../components/ui/Image';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import QuoteCTA from '../components/home/QuoteCTA';
import { useSite } from '../context/SiteContext';

export default function Services() {
  useSeo({
    title: 'Services',
    description:
      'Sofa sets, sofa upholstery, curtains, blinds, seat covers, cushions, chair and dining upholstery, car seat covers and custom furniture — all crafted to fit your space.',
  });

  const { services, projects } = useSite();
  const visibleServices = services.filter((s) => s.published !== false);

  return (
    <>
      <PageHeader
        eyebrow="What We Do"
        title="Our Services"
        subtitle="From complete sofa sets to the smallest finishing detail, every piece is made to fit your space."
        image={projects[0]?.coverImage}
        crumb={[{ label: 'Services' }]}
      />

      <section className="bg-cream py-16 md:py-24">
        <div className="container-px grid gap-8 lg:grid-cols-2">
          {visibleServices.map((service, i) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden rounded-4xl bg-surface shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="grid sm:grid-cols-[1fr_1.2fr]">
                <div className="relative overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    className="h-56 w-full sm:h-full"
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-7 sm:p-8">
                  <h2 className="font-display text-2xl text-navy">{service.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink/55">{service.description}</p>
                  <ul className="mt-4 space-y-2">
                    {(service.features || []).map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-[13px] text-ink/65">
                        <Check size={14} className="shrink-0 text-mutedGold" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/quote" className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-mutedGold transition-colors group-hover:text-gold">
                    Get a Quote <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-deep py-16 md:py-20 text-center">
        <div className="container-px">
          <SectionHeading
            eyebrow="Not Sure What You Need?"
            title="Tell Us About Your Furniture"
            subtitle="Whatever the piece — a sofa, a single chair, car seats or a full interior — we'll find the right solution."
            dark
            align="center"
          />
          <Reveal delay={0.1}>
            <Link to="/quote" className="btn-primary mt-8 px-8 py-4">
              Request a Quote <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
