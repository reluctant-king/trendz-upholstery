import { Scissors, Gem, ThumbsUp, HandHeart } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const features = [
  {
    icon: Scissors,
    title: 'Custom Made',
    description: 'Every project is tailored to your furniture and space — never a one-size-fits-all approach.',
  },
  {
    icon: Gem,
    title: 'Quality Materials',
    description: 'Carefully selected fabrics and materials that look premium and stand up to daily life.',
  },
  {
    icon: ThumbsUp,
    title: 'Skilled Craftsmanship',
    description: 'Close attention to stitching, fitting and finishing in every single piece we make.',
  },
  {
    icon: HandHeart,
    title: 'Personal Service',
    description: 'From the first consultation to final installation, you work directly with our team.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white md:py-28">
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-px relative">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Crafted Around You"
          subtitle="We treat every sofa, chair and curtain like it's going into our own home."
          dark
          align="center"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} className="h-full">
              <div className="group flex h-full flex-col rounded-4xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/40 hover:bg-white/10">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-navy">
                  <f.icon size={22} />
                </span>
                <h3 className="mt-6 font-display text-xl text-white">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{f.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
