import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import AdminSidebar from './AdminSidebar';

const pageTitles = {
  '/admin': ['Overview', 'Dashboard'],
  '/admin/our-work': ['Content', 'Our Work'],
  '/admin/our-work/new': ['Content', 'New Project'],
  '/admin/services': ['Business', 'Services'],
  '/admin/gallery': ['Content', 'Gallery'],
  '/admin/testimonials': ['Business', 'Testimonials'],
  '/admin/enquiries': ['Business', 'Enquiries'],
  '/admin/site-content': ['Content', 'Site Content'],
  '/admin/settings': ['System', 'Settings'],
};

function titleFor(pathname) {
  for (const [key, value] of Object.entries(pageTitles)) {
    if (pathname.startsWith(key)) return value;
  }
  return ['Admin', 'Dashboard'];
}

export default function AdminLayout() {
  const { admin } = useAuth();
  const { source } = useSite();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [group, page] = titleFor(pathname);

  useEffect(() => {
    document.documentElement.classList.add('is-admin');
    return () => document.documentElement.classList.remove('is-admin');
  }, []);

  return (
    <div className="admin-shell dark min-h-screen bg-cream text-ink">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-72">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-ink/10 bg-cream/85 px-5 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink/40">{group}</span>
              <span className="h-3 w-px bg-ink/15" />
              <h2 className="font-display text-sm text-ink">{page}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {source === 'placeholder' && (
              <span className="hidden rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-300 sm:block" title="API is offline — showing placeholder content">
                Offline mode
              </span>
            )}
            <span className="hidden text-xs text-ink/50 sm:block">{admin?.name}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-display text-sm font-bold text-deep shadow-gold ring-2 ring-gold/30">
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
        </header>
        <main className="px-5 py-8 lg:px-8 lg:py-10"><Outlet /></main>
      </div>
      <div id="admin-modal-root" className="dark" />
    </div>
  );
}
