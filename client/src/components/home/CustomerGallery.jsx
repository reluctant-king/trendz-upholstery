import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import Image from '../ui/Image';
import Lightbox from '../ui/Lightbox';
import { useSite } from '../../context/SiteContext';

const aspectMap = [3, 4, 3, 4, 3, 4, 4, 3];

export default function CustomerGallery() {
  const { galleryImages } = useSite();
  const [openIndex, setOpenIndex] = useState(-1);
  const images = galleryImages.slice(0, 8);

  return (
    <section className="bg-warmWhite py-20 md:py-28">
      <div className="container-px">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Customer Gallery"
            title="Made For Real Homes"
            subtitle="Recent work completed and delivered — photographed exactly where it lives."
          />
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Link to="/our-work" className="btn-outline px-6 py-3">
              See More of Our Work <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {images.map((img, i) => (
            <motion.button
              key={img._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              onClick={() => setOpenIndex(i)}
              className={`group relative overflow-hidden rounded-3xl ${aspectMap[i] % 4 === 0 ? 'aspect-[4/5]' : 'aspect-square'} ${
                i % 4 === 0 ? 'lg:row-span-2 lg:aspect-auto lg:h-full' : ''
              }`}
              aria-label={`Open ${img.title || 'gallery image'}`}
            >
              <Image
                src={img.url}
                alt={img.alt || img.title}
                className="h-full w-full"
                imgClassName="transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-navy/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>
      </div>

      {openIndex >= 0 && (
        <Lightbox images={images} index={openIndex} onClose={() => setOpenIndex(-1)} />
      )}
    </section>
  );
}
