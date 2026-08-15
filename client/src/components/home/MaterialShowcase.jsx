import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import Image from '../ui/Image';
import { useSite } from '../../context/SiteContext';
import { Link } from 'react-router-dom';

const colorHex = {
  Navy: '#003566',
  Mustard: '#FFC300',
  Forest: '#2F4F3A',
  Blush: '#E8C4C4',
  Cream: '#F4F6FA',
  Beige: '#E7EBF2',
  Grey: '#9C9C9C',
  White: '#FFFFFF',
  Olive: '#6B7B4F',
  Tan: '#D2B48C',
  Black: '#1A1A1A',
  Cognac: '#9A5B2F',
  Brown: '#6F4E37',
  Charcoal: '#3A3A3A',
  Sand: '#D8C7A9',
  Terracotta: '#C97B4A',
  Rust: '#B4603C',
  'Any color': '#FFC300',
  'Any texture': '#B4A68F',
  'Any print': '#8A9BAB',
};

export default function MaterialShowcase() {
  const { materials } = useSite();
  const list = materials.slice(0, 4);

  return (
    <section className="bg-warmWhite py-20 md:py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Materials"
          title="Choose Your Finish"
          subtitle="From plush velvets to durable performance fabrics, the right material makes all the difference."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((material, i) => (
            <motion.div
              key={material._id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden rounded-4xl bg-surface shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={material.image}
                  alt={material.name}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute left-4 top-4 rounded-full bg-surface/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy backdrop-blur">
                  {material.name}
                </span>
              </div>
              <div className="p-5">
                <p className="text-[13px] leading-relaxed text-ink/55">{material.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {(material.colors || []).slice(0, 4).map((c, ci) => (
                    <span
                      key={ci}
                      title={c}
                      className={`h-5 w-5 rounded-full border border-ink/10 ${c === 'White' || c === 'Cream' ? 'ring-1 ring-ink/10' : ''}`}
                      style={{ backgroundColor: colorHex[c] || c }}
                    />
                  ))}
                  {(material.colors || []).length > 4 && (
                    <span className="text-[10px] font-medium text-ink/40">+{material.colors.length - 4} more</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/materials" className="btn-outline px-6 py-3">
            View All Finishes
          </Link>
        </div>
      </div>
    </section>
  );
}
