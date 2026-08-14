import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  MessageSquare,
  Plus,
  Scissors,
  Star,
  TrendingUp,
} from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { StatusBadge } from '../../components/admin/FormFields';
import { useSite } from '../../context/SiteContext';
import { enquiryApi, projectApi } from '../../lib/api';
import { formatDate, initials } from '../../lib/utils';
import { placeholderEnquiries } from '../../lib/placeholderEnquiries';

export default function Dashboard() {
  const { projects: siteProjects, services } = useSite();
  const [projects, setProjects] = useState(siteProjects);
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [pData, eData] = await Promise.all([projectApi.list(), enquiryApi.list()]);
        setProjects(pData.projects);
        setEnquiries(eData.enquiries);
        setStats({
          total: eData.enquiries.length,
          new: eData.enquiries.filter((e) => e.status === 'New').length,
        });
      } catch {
        setProjects(siteProjects);
        setEnquiries(placeholderEnquiries);
        setStats({ total: placeholderEnquiries.length, new: placeholderEnquiries.filter((e) => e.status === 'New').length });
      }
    };
    load();
  }, [siteProjects]);

  const featured = projects.filter((p) => p.featured).length;
  const published = projects.filter((p) => p.published).length;

  const cards = [
    { label: 'Total Projects', value: projects.length, to: '/admin/portfolio', icon: FolderKanban, tone: 'bg-gold/15 text-gold' },
    { label: 'Published', value: published, to: '/admin/portfolio', icon: TrendingUp, tone: 'bg-green-100 text-green-600' },
    { label: 'Featured', value: featured, to: '/admin/portfolio', icon: Star, tone: 'bg-purple-100 text-purple-600' },
    { label: 'New Enquiries', value: stats.new, to: '/admin/enquiries', icon: MessageSquare, tone: 'bg-blue-100 text-blue-600' },
    { label: 'Services', value: services.length, to: '/admin/services', icon: Scissors, tone: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your studio content and recent enquiries."
        action={
          <Link to="/admin/portfolio/new" className="btn-primary px-6 py-3">
            <Plus size={15} /> Add New Project
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-3xl bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${c.tone}`}>
              <c.icon size={18} />
            </span>
            <p className="mt-4 font-display text-3xl text-navy">{c.value}</p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink/45">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-navy">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="text-xs font-semibold text-mutedGold hover:text-gold">
              View all
            </Link>
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="mt-5 space-y-3">
            {enquiries.slice(0, 5).map((e) => (
              <Link
                key={e._id}
                to={`/admin/enquiries/${e._id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-ink/5 bg-cream/50 px-4 py-3 transition-colors hover:border-gold/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-gold">
                    {initials(e.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy">{e.name}</p>
                    <p className="truncate text-xs text-ink/45">{e.service || 'General enquiry'} · {e.phone}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-[11px] text-ink/40 sm:block">{formatDate(e.createdAt)}</span>
                  <StatusBadge status={e.status} />
                </div>
              </Link>
            ))}
            {enquiries.length === 0 && (
              <p className="py-8 text-center text-sm text-ink/45">No enquiries yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
          <h2 className="font-display text-xl text-navy">Quick Actions</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Add Project', to: '/admin/portfolio/new', desc: 'Upload new work' },
              { label: 'Manage Enquiries', to: '/admin/enquiries', desc: 'Respond to customers' },
              { label: 'Upload Gallery', to: '/admin/gallery', desc: 'Add customer gallery images' },
              { label: 'Site Settings', to: '/admin/settings', desc: 'WhatsApp, contact, socials' },
            ].map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="rounded-3xl border border-ink/8 bg-cream/60 p-5 transition-colors hover:border-gold/50 hover:bg-gold/5"
              >
                <p className="text-sm font-semibold text-navy">{a.label}</p>
                <p className="mt-1 text-xs text-ink/45">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
