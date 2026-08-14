import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BadgeCheck } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import Image from '../ui/Image';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const { projects } = useSite();
  const heroProject = projects.find((p) => p.coverImage) || projects[0];

  return (
    <section className="relative overflow-hidden bg-cream pt-28 md:pt-32">
      <div className="pointer-events-none absolute -right-40 top-24 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[380px] w-[380px] rounded-full bg-beige/60 blur-3xl" />

      <div className="container-px grid items-center gap-12 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-mutedGold"
          >
            <Sparkles size={13} /> Custom Upholstery • Made With Care
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-[2.6rem] leading-[1.08] text-navy sm:text-6xl lg:text-[4.4rem]"
          >
            Beautiful Spaces
            <br />
            Begin With{' '}
            <span className="relative inline-block text-gold">
              Exceptional
              <br className="hidden sm:block" />
              Craft.
              <svg className="absolute -bottom-2 left-0 w-full text-gold/40" viewBox="0 0 200 12" fill="none">
                <path d="M2 9C60 3 140 3 198 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-7 max-w-lg text-base leading-relaxed text-ink/60 sm:text-lg">
            Premium upholstery, custom sofas, curtains and furniture solutions crafted to transform
            your space.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/our-work" className="btn-dark px-8 py-4">
              Explore Our Work <ArrowRight size={16} />
            </Link>
            <Link to="/quote" className="btn-primary px-8 py-4">
              Get a Quote
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex items-center gap-4 border-t border-ink/10 pt-7">
            <div className="flex text-gold" aria-label="5 star rating">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.28 3.95a1 1 0 00.95.69h4.16c.97 0 1.37 1.24.59 1.81l-3.37 2.44a1 1 0 00-.36 1.12l1.29 3.95c.3.92-.76 1.69-1.54 1.12l-3.37-2.44a1 1 0 00-1.18 0l-3.37 2.44c-.78.57-1.83-.2-1.54-1.12l1.29-3.95a1 1 0 00-.36-1.12L2.07 9.38c-.78-.57-.38-1.81.59-1.81h4.16a1 1 0 00.95-.69l1.28-3.95z" />
                </svg>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">Trusted craftsmanship</p>
              <p className="text-xs text-ink/50">Custom-made for your space</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-lift">
            <Image
              src={heroProject?.coverImage || ''}
              alt="Premium upholstery work"
              eager
              className="aspect-[4/4.4] w-full sm:aspect-[4/3.6] lg:aspect-[4/4.4]"
              imgClassName="scale-105"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="absolute -left-4 top-10 animate-float rounded-3xl bg-white/95 p-4 shadow-lift backdrop-blur sm:-left-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
                <BadgeCheck size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">100% Custom</p>
                <p className="text-[11px] text-ink/50">Made to fit your space</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="absolute -bottom-6 right-4 animate-float rounded-3xl bg-navy p-5 text-white shadow-lift sm:right-8 [animation-delay:1.5s]"
          >
            <p className="font-display text-3xl text-gold">500+</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-white/60">Projects Crafted</p>
          </motion.div>

          <div className="absolute -z-10 -bottom-8 -left-8 h-36 w-36 rounded-full bg-gold/20 blur-2xl" />
          <div className="pointer-events-none absolute -top-6 right-8 h-20 w-20 rounded-full border-2 border-gold/30" />
        </motion.div>
      </div>
    </section>
  );
}
