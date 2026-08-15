import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Loader2, Search } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import EmptyState from '../../components/admin/EmptyState';
import { StatusBadge } from '../../components/admin/FormFields';
import { enquiryApi, getErrorMessage } from '../../lib/api';
import { placeholderEnquiries } from '../../lib/placeholderEnquiries';
import { formatDate, initials } from '../../lib/utils';

const statuses = ['All', 'New', 'Contacted', 'Completed'];

export default function EnquiriesManage() {
  const [enquiries, setEnquiries] = useState([]);
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await enquiryApi.list();
        setEnquiries(data.enquiries);
        setApiConnected(true);
        setError('');
      } catch (err) {
        setEnquiries(placeholderEnquiries);
        setApiConnected(false);
        setError('API offline — showing sample enquiries. Start the server to manage real enquiries.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = enquiries.filter((e) => {
    const matchesStatus = status === 'All' || e.status === status;
    const q = search.toLowerCase();
    const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.phone.includes(q) || (e.service || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const counts = (s) => (s === 'All' ? enquiries.length : enquiries.filter((e) => e.status === s).length);

  return (
    <>
      <AdminPageHeader
        eyebrow="Business"
        title="Enquiries"
        description="Customer quote requests from the website."
        action={
          apiConnected && (
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const data = await enquiryApi.list();
                  setEnquiries(data.enquiries);
                } catch (err) {
                  setError(getErrorMessage(err));
                } finally {
                  setLoading(false);
                }
              }}
              className="btn-outline px-5 py-3"
            >
              <Loader2 size={14} /> Refresh
            </button>
          )
        }
      />

      {error && <p className="mb-5 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">{error}</p>}

      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
              status === s ? 'border-gold bg-gold text-deep' : 'border-ink/15 bg-surface text-ink/55 hover:border-mutedGold'
            }`}
          >
            {s} <span className="opacity-60">({counts(s)})</span>
          </button>
        ))}
      </div>

      <div className="relative mb-5">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone or service…" className="input-base pl-11" />
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 size={28} className="animate-spin text-gold" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No enquiries found"
          description="Try clearing the search or choosing a different status."
        />
      ) : (
        <div className="overflow-hidden rounded-4xl bg-surface shadow-soft ring-1 ring-ink/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="border-b border-ink/8 bg-ink/5 text-[11px] font-semibold uppercase tracking-wide text-ink/45">
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Open</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e._id} className="border-b border-ink/5 transition-colors hover:bg-ink/5">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-deep text-xs font-bold text-gold">{initials(e.name)}</span>
                        <div>
                          <p className="text-sm font-semibold text-ink">{e.name}</p>
                          <p className="text-xs text-ink/40">{e.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-ink/60">{e.phone}</td>
                    <td className="px-5 py-4 text-sm text-ink/60">{e.service || 'General'}</td>
                    <td className="px-5 py-4 text-sm text-ink/50">{formatDate(e.createdAt)}</td>
                    <td className="px-5 py-4"><StatusBadge status={e.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <Link to={`/admin/enquiries/${e._id}`} className="btn-outline px-4 py-2">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
