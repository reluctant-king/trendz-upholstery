import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import QuoteForm from '../quote/QuoteForm';

export default function QuoteSection() {
  return (
    <section className="bg-cream py-20 md:py-28" id="quote">
      <div className="container-px grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-32">
          <SectionHeading
            eyebrow="Get a Quote"
            title="Request a Free Quote"
            subtitle="Tell us about your project and receive a detailed, no-obligation quotation."
          />
          <Reveal delay={0.15}>
            <ul className="mt-8 space-y-4">
              {[
                'Free consultation and honest advice',
                'Transparent pricing, no surprises',
                'Fabric samples and swatches on request',
                'Timeline shared before work begins',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-ink/70">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <QuoteForm />
        </Reveal>
      </div>
    </section>
  );
}
