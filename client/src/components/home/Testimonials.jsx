import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import Stars from '../ui/Stars';
import { initials } from '../../lib/utils';
import { useSite } from '../../context/SiteContext';

export default function Testimonials() {
  const { testimonials } = useSite();
  const list = testimonials.slice(0, 3);

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Customers Say"
          subtitle="Word of mouth is everything to us — here's what people say after their work is delivered."
          align="center"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {list.map((t, i) => (
            <motion.figure
              key={t._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full flex-col rounded-4xl bg-surface p-7 shadow-soft"
            >
              <Quote size={30} className="text-gold/50" />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/75">
                “{t.review}”
              </blockquote>
              <Stars rating={t.rating} className="mt-5" />
              <figcaption className="mt-5 flex items-center gap-3 border-t border-ink/8 pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-deep font-display text-sm font-semibold text-gold">
                  {initials(t.customerName)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">{t.customerName}</p>
                  <p className="text-xs text-ink/45">{t.service}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
