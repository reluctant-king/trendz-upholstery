import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Image from '../ui/Image';
import { useSite } from '../../context/SiteContext';

export default function SignatureCollections() {
  const { collections } = useSite();
  const list = collections.slice(0, 6);
  if (list.length === 0) return null;

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Signature"
          title="Signature Collections"
          subtitle="Curated styles — from classic elegance to contemporary minimalism. Each collection is a starting point for your space."
          align="center"
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((collection, i) => (
            <motion.div
              key={collection._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={i === 0 ? 'sm:col-span-2 lg:col-span-1 lg:row-span-2' : ''}
            >
              <Link
                to="/collections"
                className={`group relative block overflow-hidden rounded-4xl shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift ${
                  i === 0 ? 'aspect-[4/5] sm:aspect-auto sm:h-full' : 'aspect-[4/3]'
                }`}
              >
                <Image
                  src={collection.image}
                  alt={collection.name}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  {collection.tagline && (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                      {collection.tagline}
                    </p>
                  )}
                  <h3 className="mt-1.5 font-display text-2xl text-white">{collection.name}</h3>
                  <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/70 opacity-0 transition-all duration-500 group-hover:opacity-100">
                    {collection.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                    Explore <ArrowUpRight size={14} />
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
