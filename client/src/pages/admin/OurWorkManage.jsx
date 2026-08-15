import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, FolderKanban, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import EmptyState from '../../components/admin/EmptyState';
import { PublishedBadge } from '../../components/admin/FormFields';
import { projectApi, getErrorMessage } from '../../lib/api';
import { useSite } from '../../context/SiteContext';

export default function OurWorkManage() {
  const { projects: siteProjects, categories, refresh } = useSite();
  const [projects, setProjects] = useState(siteProjects);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await projectApi.list();
        if (mounted) setProjects(data.projects);
      } catch {
        if (mounted) setProjects(siteProjects);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [siteProjects]);

  const reload = async () => {
    try {
      const data = await projectApi.list();
      setProjects(data.projects);
    } catch {
      setProjects(siteProjects);
    }
  };

  const filtered = useMemo(() => {
    let list = projects;
    if (category !== 'All') list = list.filter((p) => p.categoryName === category);
    if (search.trim()) list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [projects, search, category]);

  const toggleFlag = async (project, field) => {
    setError('');
    try {
      await projectApi.update(project._id, { [field]: !project[field] });
      await reload();
      refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const remove = async () => {
    setBusy(true);
    setError('');
    try {
      await projectApi.remove(confirm._id);
      await reload();
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Our Work"
        description="Manage your projects — add new work, edit, feature or publish projects."
        action={
          <Link to="/admin/our-work/new" className="btn-primary px-6 py-3">
            <Plus size={15} /> Add New Project
          </Link>
        }
      />

      {error && <p className="mb-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="input-base pl-11"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-base sm:w-56">
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={projects.length === 0 ? 'No projects yet' : 'No projects found'}
          description={
            projects.length === 0
              ? 'Add your first completed project to showcase your work to visitors.'
              : 'Try a different search or category filter.'
          }
          actionText={projects.length === 0 ? 'Add Project' : undefined}
          actionTo={projects.length === 0 ? '/admin/our-work/new' : undefined}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <article
              key={p._id}
              className="group overflow-hidden rounded-4xl bg-surface shadow-soft ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-1 hover:ring-gold/40"
            >
              <Link to={`/admin/our-work/${p._id}/edit`} className="relative block">
                <img
                  src={p.coverImage || p.galleryImages?.[0]?.url}
                  alt={p.title}
                  className="aspect-[16/11] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-charcoal/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-[11px] font-semibold text-deep">
                    <Eye size={12} /> View / Edit
                  </span>
                </div>
                <div className="absolute left-3 top-3 flex gap-2">
                  {p.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-deep">
                      <Star size={11} className="fill-deep" /> Featured
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFlag(p, 'featured');
                    }}
                    title="Toggle featured"
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                      p.featured ? 'bg-gold text-deep' : 'bg-surface/85 text-ink/50 hover:text-gold'
                    }`}
                  >
                    <Star size={13} />
                  </button>
                </div>
              </Link>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-ink">{p.title}</h3>
                    <p className="mt-0.5 truncate text-xs text-ink/50">{p.categoryName || 'Uncategorised'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFlag(p, 'published')}
                    title="Toggle publish status"
                  >
                    <PublishedBadge published={p.published} />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-ink/8 pt-3">
                  <Link to={`/our-work/${p.slug}`} target="_blank" className="text-[11px] font-semibold text-ink/50 transition-colors hover:text-gold">
                    View on site
                  </Link>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/our-work/${p._id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 text-ink/60 transition-colors hover:border-gold hover:text-gold"
                      aria-label="Edit project"
                    >
                      <Pencil size={13} />
                    </Link>
                    <button
                      onClick={() => setConfirm(p)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 text-ink/60 transition-colors hover:border-red-400/40 hover:text-red-400"
                      aria-label="Delete project"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
        loading={busy}
        title="Delete this project?"
        description={`"${confirm?.title}" will be permanently removed from the site.`}
        confirmText="Delete Project"
      />
    </>
  );
}
