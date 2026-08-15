import { Check } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import BeforeAfterSlider from '../portfolio/BeforeAfterSlider';
import Reveal from '../ui/Reveal';
import { useSite } from '../../context/SiteContext';

const comparisons = [
  { before: 'Old fabric, faded and worn', after: 'New premium fabric' },
  { before: 'Worn-out cushioning', after: 'Refreshed, supportive cushion' },
  { before: 'Outdated design', after: 'Modern, tailored finish' },
];

export default function BeforeAfterSection() {
  const { projects } = useSite();
  const demo = projects.find((p) => p.beforeImage && p.afterImage);

  return (
    <section className="bg-deep py-20 text-white md:py-28">
      <div className="container-px grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <BeforeAfterSlider
            before={demo?.beforeImage}
            after={demo?.afterImage}
            labels={{ before: 'Before', after: 'After' }}
          />
        </div>

        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="The Transformation"
            title="From Worn Out to Wonderful"
            subtitle="The value of upholstery is in what it brings back to life. See the difference careful work can make."
            dark
          />
          <Reveal delay={0.15} className="mt-8 space-y-4">
            {comparisons.map((c, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-deep">
                  <Check size={14} strokeWidth={3} />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white/90">{c.after}</p>
                  <p className="mt-0.5 text-xs text-white/50 line-through decoration-white/30">{c.before}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
