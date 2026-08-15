import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import ThemeToggle from '../ui/ThemeToggle';
import { useSite } from '../../context/SiteContext';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Our Work', to: '/our-work' },
  { label: 'Services', to: '/services' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSite();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setScrolled(window.scrollY > 24);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-ink/5 bg-cream/80 shadow-soft backdrop-blur-xl'
            : location.pathname === '/'
              ? 'border-b border-white/10 bg-deep/25 backdrop-blur-md'
              : 'border-b border-white/10 bg-deep/90 backdrop-blur-xl'
        }`}
      >
        <div className="container-px flex h-20 items-center justify-between md:h-24">
          <Logo dark={!scrolled} />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative text-[13px] font-medium tracking-wide transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:rounded-full after:bg-gold after:transition-all after:duration-300 ${
                    isActive
                      ? scrolled
                        ? 'text-navy after:w-full'
                        : 'text-white after:w-full'
                      : scrolled
                        ? 'text-navy/65 after:w-0 hover:text-navy hover:after:w-full'
                        : 'text-white/70 after:w-0 hover:text-white hover:after:w-full'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle dark={!scrolled} className="hidden lg:flex" />
            <Link
              to="/quote"
              className="btn-primary hidden sm:inline-flex px-6 py-3"
            >
              Get a Quote <ArrowRight size={15} />
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
              className={`flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur transition-colors hover:bg-gold hover:text-deep lg:hidden ${
                scrolled
                  ? 'border-ink/10 bg-surface/70 text-navy'
                  : 'border-white/20 bg-white/10 text-white'
              }`}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex flex-col bg-deep lg:hidden"
          >
            <div className="container-px flex h-20 items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo dark />
                <ThemeToggle dark />
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-gold hover:text-deep"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="container-px flex flex-1 flex-col justify-center gap-1" aria-label="Mobile navigation">
              {links.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i + 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `block py-3 font-display text-3xl transition-colors ${
                        isActive ? 'text-gold' : 'text-white/85 hover:text-gold'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="container-px border-t border-white/10 py-8"
            >
              <Link to="/quote" className="btn-primary w-full py-4">
                Get a Quote <ArrowRight size={16} />
              </Link>
              <p className="mt-4 text-center text-xs text-white/50">{settings.businessName} · {settings.phoneNumber}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
