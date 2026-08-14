import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import Logo from './Logo';
import { useSite } from '../../context/SiteContext';

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Our Work', to: '/our-work' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

const serviceLinks = [
  { label: 'Sofa Upholstery', to: '/services' },
  { label: 'Curtains', to: '/services' },
  { label: 'Seat Covers', to: '/services' },
  { label: 'Custom Furniture', to: '/services' },
  { label: 'Cushions', to: '/services' },
];

const helpLinks = [
  { label: 'Request a Quote', to: '/quote' },
  { label: 'WhatsApp', to: '/contact' },
  { label: 'FAQs', to: '/contact' },
];

export default function Footer() {
  const { settings } = useSite();
  const socials = [
    { icon: Instagram, href: settings.instagram || '#' },
    { icon: Facebook, href: settings.facebook || '#' },
    { icon: Youtube, href: settings.youtube || '#' },
  ];

  return (
    <footer className="bg-navy text-white">
      <div className="container-px grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8 lg:py-20">
        <div>
          <Logo dark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
            Premium upholstery, custom sofas, curtains and furniture solutions crafted to fit your
            space. Your furniture. Our craftsmanship.
          </p>
          <p className="mt-5 text-sm font-medium text-white/80">{settings.address}</p>
          <p className="mt-1 text-sm text-white/80">{settings.phoneNumber}</p>
        </div>

        <div>
          <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-eyebrow text-gold">Company</h3>
          <ul className="space-y-3">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-white/65 transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-eyebrow text-gold">Services</h3>
          <ul className="space-y-3">
            {serviceLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-white/65 transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-eyebrow text-gold">Follow</h3>
          <div className="flex items-center gap-3">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label="Social link"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-gold hover:bg-gold hover:text-navy"
              >
                <s.icon size={17} />
              </a>
            ))}
          </div>
          <h3 className="mb-5 mt-8 text-[11px] font-semibold uppercase tracking-eyebrow text-gold">Help</h3>
          <ul className="space-y-3">
            {helpLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-white/65 transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.businessName}. All Rights Reserved.</p>
          <p>Custom Upholstery & Interiors</p>
        </div>
      </div>
    </footer>
  );
}
