import { motion } from 'framer-motion';
import { useSeo } from '../hooks/useSeo';
import PageHeader from '../components/layout/PageHeader';
import Image from '../components/ui/Image';
import ColorPalette from '../components/portfolio/ColorPalette';
import QuoteCTA from '../components/home/QuoteCTA';
import { useSite } from '../context/SiteContext';

export default function Materials() {
  useSeo({
    title: 'Materials & Finishes',
    description:
      'Choose from premium velvet, linen, cotton, leather, suede, textured and performance fabrics — and find your perfect shade for upholstery, curtains and blinds.',
  });

  const { materials, projects } = useSite();

  return (
    <>
      <PageHeader
        eyebrow="Fabric & Finish"
        title="Choose Your Finish"
        subtitle="The material sets the mood. Explore our most-loved fabrics and find the perfect shade for your piece."
        image={projects[0]?.coverImage}
        crumb={[{ label: 'Materials' }]}
      />

      <section className="bg-cream py-16 md:py-24">
        <div className="container-px grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {materials.map((material, i) => (
            <motion.div
              key={material._id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
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
              <div className="p-6">
                <h3 className="font-display text-lg text-navy">{material.name}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/55">{material.description}</p>
                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">Available colors</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {(material.colors || []).map((c, ci) => (
                      <span key={ci} className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-medium text-ink/60">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-warmWhite py-16 md:py-24">
        <div className="container-px">
          <ColorPalette />
        </div>
      </section>

      <QuoteCTA />
    </>
  );
}
