import { Link, NavLink } from 'react-router-dom';
import {
  FileText,
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Scissors,
  Settings,
  Star,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../layout/Logo';

const navGroups = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/our-work', label: 'Our Work', icon: FolderKanban },
      { to: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
      { to: '/admin/site-content', label: 'Site Content', icon: FileText },
    ],
  },
  {
    label: 'Business',
    items: [
      { to: '/admin/services', label: 'Services', icon: Scissors },
      { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
      { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
    ],
  },
  {
    label: 'System',
    items: [{ to: '/admin/settings', label: 'Settings', icon: Settings }],
  },
];

export default function AdminSidebar({ open, onClose }) {
  const { admin, logout } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 z-[60] bg-charcoal/70 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] flex w-72 flex-col bg-deep text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <Logo dark />
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white lg:hidden" aria-label="Close sidebar">
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive ? 'bg-gold text-deep shadow-gold' : 'text-white/65 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon size={17} className={isActive ? 'text-deep' : 'text-gold/80 group-hover:text-gold'} />
                        {item.label}
                        {isActive && <span className="absolute right-4 h-1.5 w-1.5 rounded-full bg-deep/70" />}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-display text-sm font-bold text-deep shadow-gold">
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{admin?.name}</p>
              <p className="truncate text-xs text-white/50">{admin?.email}</p>
            </div>
            <button onClick={logout} title="Logout" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-gold hover:text-gold">
              <LogOut size={15} />
            </button>
          </div>
          <Link to="/" className="mt-4 block rounded-2xl border border-white/15 px-4 py-2.5 text-center text-xs font-medium text-white/70 transition-colors hover:border-gold hover:text-gold">
            View Website
          </Link>
        </div>
      </aside>
    </>
  );
}
