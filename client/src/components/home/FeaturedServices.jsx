import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import Image from '../ui/Image';
import { useSite } from '../../context/SiteContext';

export default function FeaturedServices() {
  const { services, settings } = useSite();
  const list = services.filter((s) => s.published !== false).slice(0, 4);

  return (
    <section className="bg-cream py-20 md:py-28" id="services">
      <div className="container-px">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Our Craft"
            title={settings.servicesTitle || 'What We Create'}
            subtitle="From complete sofa sets to the smallest finishing detail, every piece is made to fit your space."
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="shrink-0"
          >
            <Link to="/services" className="btn-outline px-6 py-3">
              All Services <ArrowUpRight size={15} />
            </Link>
          </motion.div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((service, i) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/services`}
                className="group flex h-full flex-col overflow-hidden rounded-4xl bg-surface shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface/85 text-navy opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg text-navy transition-colors group-hover:text-mutedGold">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink/55">{service.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-mutedGold transition-colors group-hover:text-gold">
                    View Work <ArrowUpRight size={13} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
