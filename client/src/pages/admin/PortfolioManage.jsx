import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { projectApi } from '../../lib/api';
import { getErrorMessage } from '../../lib/api';
import { useSite } from '../../context/SiteContext';
import { formatDate } from '../../lib/utils';

export default function PortfolioManage() {
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
        title="Portfolio"
        description="Manage your portfolio projects — add new work, edit, publish or feature projects."
        action={
          <Link to="/admin/portfolio/new" className="btn-primary px-6 py-3">
            <Plus size={15} /> Add New Project
          </Link>
        }
      />

      {error && <p className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

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

      <div className="overflow-hidden rounded-4xl bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-ink/8 bg-cream/60 text-[11px] font-semibold uppercase tracking-wide text-ink/45">
                <th className="px-5 py-4">Project</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-center">Featured</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-b border-ink/5 transition-colors hover:bg-cream/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.coverImage || p.galleryImages?.[0]?.url} alt="" className="h-12 w-16 rounded-xl object-cover ring-1 ring-ink/10" />
                      <div>
                        <p className="max-w-[260px] truncate text-sm font-semibold text-navy">{p.title}</p>
                        <p className="text-xs text-ink/40">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink/60">{p.categoryName || '—'}</td>
                  <td className="px-5 py-4 text-sm text-ink/50">{formatDate(p.completionDate) || '—'}</td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => toggleFlag(p, 'featured')}
                      aria-label="Toggle featured"
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                        p.featured ? 'bg-gold text-navy' : 'bg-cream text-ink/30 hover:text-gold'
                      }`}
                    >
                      <Star size={15} />
                    </button>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => toggleFlag(p, 'published')}
                      aria-label="Toggle published"
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                        p.published ? 'bg-green-50 text-green-600' : 'bg-ink/5 text-ink/45'
                      }`}
                    >
                      {p.published ? <Eye size={12} /> : <EyeOff size={12} />}
                      {p.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/portfolio/${p._id}/edit`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition-colors hover:border-gold hover:text-navy"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </Link>
                      <Link
                        to={`/our-work/${p.slug}`}
                        target="_blank"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition-colors hover:border-gold hover:text-navy"
                        aria-label="View on site"
                      >
                        <Eye size={14} />
                      </Link>
                      <button
                        onClick={() => setConfirm(p)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition-colors hover:border-red-300 hover:text-red-500"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-sm text-ink/45">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
