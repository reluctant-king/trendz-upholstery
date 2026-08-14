import Reveal from './Reveal';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  dark = false,
  className = '',
}) {
  const alignment = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';
  return (
    <Reveal className={`flex max-w-3xl flex-col ${alignment} ${className}`}>
      {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
      <h2
        className={`font-display text-3xl leading-tight sm:text-4xl md:text-[2.9rem] md:leading-[1.15] ${
          dark ? 'text-white' : 'text-navy'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${dark ? 'text-white/65' : 'text-ink/60'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
