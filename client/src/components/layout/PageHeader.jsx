import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from '../ui/Image';

export default function PageHeader({ eyebrow, title, subtitle, image, crumb }) {
  return (
    <section className="relative overflow-hidden bg-deep pt-32 pb-20 text-white md:pt-44 md:pb-24">
      {image && (
        <div className="absolute inset-0">
          <Image src={image} alt="" eager className="h-full w-full" imgClassName="opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-deep/80 via-deep/60 to-deep" />
        </div>
      )}
      <div className="container-px relative">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {crumb && (
            <nav className="mb-5 flex items-center gap-1.5 text-xs text-white/50" aria-label="Breadcrumb">
              <Link to="/" className="transition-colors hover:text-gold">Home</Link>
              <ChevronRight size={13} />
              {crumb.map((c, i) =>
                c.to ? (
                  <span key={i} className="flex items-center gap-1.5">
                    <Link to={c.to} className="transition-colors hover:text-gold">{c.label}</Link>
                    <ChevronRight size={13} />
                  </span>
                ) : (
                  <span key={i} className="text-white/70">{c.label}</span>
                )
              )}
            </nav>
          )}
          {eyebrow && <span className="eyebrow mb-4 block text-gold">{eyebrow}</span>}
          <h1 className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl">{title}</h1>
          {subtitle && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{subtitle}</p>}
        </motion.div>
      </div>
    </section>
  );
}
