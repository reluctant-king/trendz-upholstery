import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSeo } from '../hooks/useSeo';
import PageHeader from '../components/layout/PageHeader';
import Image from '../components/ui/Image';
import Reveal from '../components/ui/Reveal';
import QuoteCTA from '../components/home/QuoteCTA';
import { useSite } from '../context/SiteContext';

export default function Collections() {
  useSeo({
    title: 'Collections',
    description:
      'Signature upholstery collections — contemporary, classic, minimal, luxury, modern and custom styles, each a starting point for your space.',
  });

  const { collections, projects } = useSite();

  return (
    <>
      <PageHeader
        eyebrow="Signature"
        title="Signature Collections"
        subtitle="Curated styles and starting points — refined with your fabrics, colors and dimensions."
        image={projects[0]?.coverImage}
        crumb={[{ label: 'Collections' }]}
      />

      <section className="bg-cream py-16 md:py-24">
        <div className="container-px grid gap-6 sm:grid-cols-2">
          {collections.map((collection, i) => (
            <motion.div
              key={collection._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-4xl shadow-soft transition-all duration-500 hover:shadow-lift ${
                i === 0 ? 'sm:col-span-2 sm:aspect-[2.4/1]' : 'aspect-[4/3]'
              }`}
            >
              <Image
                src={collection.image}
                alt={collection.name}
                className="h-full w-full"
                imgClassName="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{collection.tagline}</p>
                <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">{collection.name}</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">{collection.description}</p>
                <Link to="/quote" className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                  Start With This Style <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <Reveal className="container-px mt-14">
          <div className="rounded-4xl bg-navy p-10 text-center text-white md:p-14">
            <h2 className="font-display text-3xl md:text-4xl">Can't Find Your Style?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/65">
              Every collection is just a starting point. We design around your space, your taste and
              your existing furniture.
            </p>
            <Link to="/quote" className="btn-primary mt-8 px-8 py-4">
              Get a Quote <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>

      <QuoteCTA />
    </>
  );
}
