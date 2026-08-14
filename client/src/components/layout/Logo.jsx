import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';

export default function Logo({ dark = false, className = '' }) {
  const { settings } = useSite();
  return (
    <Link to="/" className={`group inline-flex flex-col leading-none ${className}`} aria-label="Home">
      <span
        className={`font-display text-xl font-semibold tracking-tight sm:text-2xl ${
          dark ? 'text-white' : 'text-navy'
        } transition-colors`}
      >
        {settings.businessName || 'Trendz Upholstery'}
      </span>
      <span className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] ${dark ? 'text-gold' : 'text-mutedGold'}`}>
        {settings.tagline || 'Custom Upholstery & Interiors'}
      </span>
    </Link>
  );
}
