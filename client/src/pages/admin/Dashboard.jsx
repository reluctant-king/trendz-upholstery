import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  FolderKanban,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  Scissors,
  Sparkles,
  Star,
  UploadCloud,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import { StatusBadge } from '../../components/admin/FormFields';
import EmptyState from '../../components/admin/EmptyState';
import { enquiryApi, projectApi } from '../../lib/api';
import { formatDate, initials } from '../../lib/utils';
import { placeholderEnquiries } from '../../lib/placeholderEnquiries';

export default function Dashboard() {
  const { admin } = useAuth();
  const { projects: siteProjects, galleryImages, services, testimonials } = useSite();
  const [projects, setProjects] = useState(siteProjects);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [pData, eData] = await Promise.all([projectApi.list(), enquiryApi.list()]);
        setProjects(pData.projects);
        setEnquiries(eData.enquiries);
      } catch {
        setProjects(siteProjects);
        setEnquiries(placeholderEnquiries);
      }
    };
    load();
  }, [siteProjects]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = admin?.name?.split(' ')[0] || 'there';

  const newEnquiries = enquiries.filter((e) => e.status === 'New').length;

  const cards = [
    { label: 'Total Projects', value: projects.length, to: '/admin/our-work', icon: FolderKanban, tone: 'bg-gold/15 text-gold' },
    { label: 'Gallery Images', value: galleryImages.length, to: '/admin/gallery', icon: ImageIcon, tone: 'bg-purple-500/15 text-purple-300' },
    { label: 'New Enquiries', value: newEnquiries, to: '/admin/enquiries', icon: MessageSquare, tone: 'bg-blue-500/15 text-blue-300' },
    { label: 'Services', value: services.length, to: '/admin/services', icon: Scissors, tone: 'bg-amber-500/15 text-amber-300' },
    { label: 'Testimonials', value: testimonials.length, to: '/admin/testimonials', icon: Star, tone: 'bg-green-500/15 text-green-300' },
  ];

  return (
    <>
      <div className="relative mb-8 overflow-hidden rounded-4xl bg-deep p-8 text-white shadow-lift sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative">
          <p className="eyebrow !text-gold">{greeting}, {firstName}</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">Your upholstery studio at a glance</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
            Track projects, respond to enquiries and keep your showcase fresh — all from one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/admin/our-work/new" className="btn-primary px-6 py-3">
              <Plus size={15} /> Add Project
            </Link>
            <Link to="/admin/gallery" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-gold hover:bg-gold hover:text-deep">
              <UploadCloud size={15} /> Upload Images
            </Link>
            <Link to="/admin/enquiries" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-gold hover:bg-gold hover:text-deep">
              Review Enquiries <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="group rounded-3xl bg-surface p-5 shadow-soft ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-1 hover:ring-gold/40"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${c.tone} transition-transform duration-300 group-hover:scale-110`}>
              <c.icon size={18} />
            </span>
            <p className="mt-4 font-display text-3xl text-ink">{c.value}</p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink/50">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-4xl bg-surface p-6 shadow-soft ring-1 ring-ink/10 sm:p-8 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-ink">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="inline-flex items-center gap-1 text-xs font-semibold text-gold transition-colors hover:text-gold/70">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {enquiries.slice(0, 6).map((e) => (
              <Link
                key={e._id}
                to={`/admin/enquiries/${e._id}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-ink/5 px-4 py-3 transition-all hover:border-gold/40 hover:bg-ink/10"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-deep text-xs font-bold text-gold">
                    {initials(e.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{e.name}</p>
                    <p className="truncate text-xs text-ink/50">{e.service || 'General enquiry'} · {e.phone}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-[11px] text-ink/45 sm:block">{formatDate(e.createdAt)}</span>
                  <StatusBadge status={e.status} />
                </div>
              </Link>
            ))}
            {enquiries.length === 0 && (
              <EmptyState
                icon={MessageSquare}
                title="No enquiries yet"
                description="Enquiries submitted through the website will appear here."
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl bg-surface p-6 shadow-soft ring-1 ring-ink/10 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Recent Projects</h2>
              <Link to="/admin/our-work" className="inline-flex items-center gap-1 text-xs font-semibold text-gold transition-colors hover:text-gold/70">
                View all <ArrowRight size={13} />
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {projects.slice(0, 5).map((p) => (
                <Link
                  key={p._id}
                  to={`/admin/our-work/${p._id}/edit`}
                  className="group flex items-center gap-3 rounded-2xl border border-ink/10 bg-ink/5 p-2.5 transition-all hover:border-gold/40 hover:bg-ink/10"
                >
                  <img
                    src={p.coverImage || p.galleryImages?.[0]?.url}
                    alt=""
                    className="h-12 w-16 shrink-0 rounded-xl object-cover ring-1 ring-ink/10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{p.title}</p>
                    <p className="truncate text-xs text-ink/50">{p.categoryName || 'Uncategorised'}</p>
                  </div>
                  <ArrowRight size={14} className="shrink-0 text-ink/30 transition-colors group-hover:text-gold" />
                </Link>
              ))}
              {projects.length === 0 && (
                <EmptyState
                  icon={FolderKanban}
                  title="No projects yet"
                  description="Add your first completed project to showcase your work."
                  actionText="Add Project"
                  actionTo="/admin/our-work/new"
                />
              )}
            </div>
          </div>

          <div className="rounded-4xl bg-deep p-6 text-white">
            <h2 className="font-display text-lg">Quick Actions</h2>
            <div className="mt-4 grid gap-3">
              <Link to="/admin/our-work/new" className="btn-primary w-full px-6 py-3">
                <Plus size={15} /> Add Project
              </Link>
              <Link to="/admin/gallery" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-gold hover:bg-gold hover:text-deep">
                <UploadCloud size={15} /> Upload Images
              </Link>
              <Link to="/admin/site-content" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-gold hover:bg-gold hover:text-deep">
                <Sparkles size={15} /> Edit Site Content
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
