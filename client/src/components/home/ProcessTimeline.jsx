import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';

const steps = [
  { n: '01', title: 'Tell Us What You Need', description: 'Send us your requirements, photos and any inspiration you have in mind.' },
  { n: '02', title: 'Consultation', description: 'We discuss fabrics, colors, design and budget together.' },
  { n: '03', title: 'Measurement', description: 'Accurate measurements are taken for a perfect fit.' },
  { n: '04', title: 'Crafting', description: 'Our team begins the upholstery or custom furniture work.' },
  { n: '05', title: 'Finishing', description: 'Every detail is checked and professionally finished.' },
  { n: '06', title: 'Delivery', description: 'Your completed work is delivered and installed in place.' },
];

export default function ProcessTimeline() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Our Process"
          title="How It Works"
          subtitle="A simple, transparent process from first message to final installation."
          align="center"
        />

        <div className="relative mt-16">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-ink/10 lg:left-1/2 lg:block" />
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-16">
            {steps.map((step, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex gap-5 lg:gap-0 ${left ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}
                >
                  <div className={`relative z-10 shrink-0 lg:absolute lg:top-1 ${left ? 'lg:right-0 lg:translate-x-1/2' : 'lg:left-0 lg:-translate-x-1/2'}`}>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold font-display text-sm font-bold text-navy shadow-gold">
                      {step.n}
                    </span>
                  </div>
                  <div className={`flex-1 ${left ? 'lg:pr-8' : 'lg:pl-8'}`}>
                    <h3 className="font-display text-xl text-navy">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/55">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
