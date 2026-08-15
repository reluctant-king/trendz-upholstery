import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from '../components/ui/Image';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import Lightbox from '../components/ui/Lightbox';
import BeforeAfterSlider from '../components/portfolio/BeforeAfterSlider';
import PortfolioGrid from '../components/portfolio/PortfolioGrid';
import QuoteCTA from '../components/home/QuoteCTA';
import { useSeo } from '../hooks/useSeo';
import { useSite } from '../context/SiteContext';
import { formatDate, whatsaapLink } from '../lib/utils';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { projects, settings } = useSite();
  const [openIndex, setOpenIndex] = useState(-1);

  const project = projects.find((p) => p.slug === slug);
  const gallery = project ? project.galleryImages || [] : [];
  const related = project
    ? projects.filter((p) => p._id !== project._id && p.categoryName === project.categoryName).slice(0, 3)
    : [];

  useSeo({
    title: project?.title,
    description:
      project?.metaDescription ||
      project?.description?.slice(0, 160) ||
      'Upholstery project by Trendz Upholstery.',
    image: project?.coverImage,
    url: typeof window !== 'undefined' ? window.location.href : '',
  });

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
        <h1 className="font-display text-3xl text-navy">Project Not Found</h1>
        <p className="mt-3 text-sm text-ink/55">This project may have been unpublished or moved.</p>
        <Link to="/our-work" className="btn-primary mt-7 px-7 py-3">
          Back to Our Work
        </Link>
      </div>
    );
  }

  const details = [
    { label: 'Service', value: project.services?.[0] || project.categoryName },
    { label: 'Material', value: project.materials || '—' },
    { label: 'Work', value: project.services?.join(', ') || 'Upholstery' },
    { label: 'Finish', value: project.fabric || project.color || 'Custom' },
  ];

  return (
    <>
      <article>
        <section className="relative bg-deep pt-28 pb-12 md:pt-36">
          <div className="container-px">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Link to="/our-work" className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-gold">
                <ArrowLeft size={15} /> All Projects
              </Link>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
                <span className="rounded-full bg-gold px-3 py-1.5 text-deep">{project.categoryName}</span>
                {project.featured && <span className="rounded-full border border-gold/40 px-3 py-1.5 text-gold">Featured</span>}
              </div>
              <h1 className="mt-5 max-w-4xl font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
                {project.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-white/60">
                {project.location && (
                  <span className="inline-flex items-center gap-2"><MapPin size={15} /> {project.location}</span>
                )}
                {project.completionDate && (
                  <span className="inline-flex items-center gap-2"><Calendar size={15} /> {formatDate(project.completionDate)}</span>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-cream">
          <div className="container-px -mt-0 pb-14 md:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[2.5rem] shadow-lift"
            >
              <Image
                src={project.coverImage || gallery[0]?.url}
                alt={project.coverImageAlt || project.title}
                className="aspect-[16/10] w-full md:aspect-[21/10]"
              />
            </motion.div>
          </div>

          <div className="container-px pb-16 md:pb-24">
            <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
              <div>
                <SectionHeading eyebrow="About This Project" title={project.title} />
                <Reveal delay={0.1}>
                  <p className="mt-5 text-base leading-relaxed text-ink/65">{project.description}</p>
                </Reveal>

                {project.beforeImage && project.afterImage && (
                  <div className="mt-10">
                    <h3 className="font-display text-2xl text-navy">Before & After</h3>
                    <BeforeAfterSlider
                      before={project.beforeImage}
                      after={project.afterImage}
                      className="mt-5"
                    />
                  </div>
                )}

                {gallery.length > 0 && (
                  <div className="mt-12">
                    <h3 className="font-display text-2xl text-navy">Project Gallery</h3>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {gallery.map((img, i) => (
                        <Reveal key={img._id || i} delay={i * 0.06}>
                          <button
                            onClick={() => setOpenIndex(i)}
                            className="group block w-full overflow-hidden rounded-3xl shadow-soft"
                            aria-label={`Open gallery image ${i + 1}`}
                          >
                            <Image
                              src={img.url}
                              alt={img.alt || img.title || `${project.title} — image ${i + 1}`}
                              className="aspect-[4/3] w-full"
                              imgClassName="transition-transform duration-700 group-hover:scale-105"
                            />
                          </button>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <aside className="lg:sticky lg:top-32 lg:self-start">
                <div className="rounded-4xl bg-surface p-6 shadow-soft sm:p-8">
                  <h3 className="font-display text-xl text-navy">Project Details</h3>
                  <dl className="mt-5 space-y-4">
                    {details.map((d) => (
                      <div key={d.label} className="border-b border-ink/8 pb-4 last:border-0">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mutedGold">{d.label}</dt>
                        <dd className="mt-1 text-sm font-medium text-navy">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-7 space-y-3">
                    <Link to="/quote" className="btn-primary w-full py-4">
                      Request a Quote <ArrowRight size={16} />
                    </Link>
                    <a
                      href={whatsaapLink(
                        settings.whatsappNumber,
                        `Hello, I saw the project "${project.title}" and would like something similar.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline w-full py-4"
                    >
                      WhatsApp Us
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </article>

      {related.length > 0 && (
        <section className="bg-warmWhite py-16 md:py-20">
          <div className="container-px">
            <div className="flex items-end justify-between">
              <SectionHeading eyebrow="More Like This" title="Similar Projects" />
              <Link to="/our-work" className="btn-outline hidden px-6 py-3 sm:inline-flex">
                View All <ArrowRight size={15} />
              </Link>
            </div>
            <PortfolioGrid projects={related} className="mt-10" />
          </div>
        </section>
      )}

      {openIndex >= 0 && gallery.length > 0 && (
        <GalleryLightbox
          images={gallery}
          index={openIndex}
          onClose={() => setOpenIndex(-1)}
        />
      )}

      <QuoteCTA />
    </>
  );
}

function GalleryLightbox({ images, index, onClose }) {
  return <Lightbox images={images} index={index} onClose={onClose} />;
}
