import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  const { admin } = useAuth();
  const { source } = useSite();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-72">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-ink/5 bg-cream/85 px-5 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-navy lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/40">Admin Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            {source === 'placeholder' && (
              <span className="hidden rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700 sm:block" title="API is offline — showing placeholder content">
                Offline mode
              </span>
            )}
            <span className="hidden text-xs text-ink/45 sm:block">{admin?.name}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-display text-sm font-bold text-navy">
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
        </header>
        <main className="px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
