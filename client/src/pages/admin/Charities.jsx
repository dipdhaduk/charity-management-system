import { useState, useEffect } from 'react';
import { Building2, ShieldCheck, CheckCircle2, XCircle, Search, Clock, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { adminService } from '../../services/adminService';

export const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionMsg, setActionMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCharities = async () => {
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await adminService.getCharities(params);
      if (res?.charities) {
        setCharities(res.charities);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not load charity records. Refresh to try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, [statusFilter]);

  const handleVerify = async (id, status) => {
    try {
      const res = await adminService.verifyCharity(id, status);
      if (res?.success) {
        setCharities((prev) =>
          prev.map((c) =>
            c._id === id
              ? {
                  ...c,
                  verificationStatus: status,
                  isVerified: status === 'approved',
                }
              : c
          )
        );
        setActionMsg(status === 'approved' ? 'Charity verified and approved' : 'Charity registration rejected');
        setTimeout(() => setActionMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Verification update failed. Please retry.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-[var(--color-bg)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] tracking-tight">
              Charity & NGO verification
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Audit registered charitable organizations and legal credentials.
            </p>
          </div>
        </div>

        {actionMsg && (
          <div className="p-3 bg-[var(--color-soft)] text-[var(--color-brand)] border border-[var(--color-brand)]/20 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {actionMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'pending', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              aria-pressed={statusFilter === s}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-[var(--color-brand)] text-white shadow-xs'
                  : 'bg-[var(--color-surface)] border border-[var(--color-line)] text-[var(--color-ink)] hover:bg-[var(--color-soft)]/30'
              }`}
            >
              {s === 'All' ? 'All charities' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Charities Table */}
        <div className="bg-[var(--color-surface)] rounded-card border border-[var(--color-line)] shadow-xs overflow-hidden">
          {loading ? (
            <Loader message="Loading charities..." />
          ) : charities.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No charities found"
              description="No registered charities matched the current filter."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--color-soft)]/30 text-xs font-semibold text-[var(--color-muted)] border-b border-[var(--color-line)]">
                    <th className="py-3 px-6">Organization</th>
                    <th className="py-3 px-6">Reg number</th>
                    <th className="py-3 px-6">Representative</th>
                    <th className="py-3 px-6">Location</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-line)]">
                  {charities.map((c) => (
                    <tr key={c._id} className="hover:bg-[var(--color-soft)]/10 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-[var(--color-line)]"
                          />
                          <div>
                            <p className="font-heading font-bold text-[var(--color-ink)] flex items-center gap-1.5 text-sm">
                              {c.organizationName}
                              {c.isVerified && (
                                <ShieldCheck className="w-4 h-4 text-[var(--color-brand)] shrink-0" />
                              )}
                            </p>
                            <p className="text-xs text-[var(--color-muted)]">{c.email || c.website || 'No email provided'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-xs text-[var(--color-ink)]">
                        {c.registrationNumber || 'Not provided'}
                      </td>

                      <td className="py-4 px-6 text-xs text-[var(--color-ink)]/80">
                        {c.user?.name || 'Administrator'}
                      </td>

                      <td className="py-4 px-6 text-xs text-[var(--color-muted)]">
                        {c.city ? `${c.city}, ${c.state || ''}` : 'India'}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            c.verificationStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : c.verificationStatus === 'rejected'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                          }`}
                        >
                          {c.verificationStatus === 'approved'
                            ? 'Approved'
                            : c.verificationStatus === 'rejected'
                            ? 'Rejected'
                            : 'Pending'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleVerify(c._id, 'approved')}
                            className="px-3 py-1 bg-[var(--color-soft)] hover:opacity-90 text-[var(--color-brand)] font-semibold text-xs rounded-full transition"
                          >
                            Approve charity
                          </button>
                          <button
                            onClick={() => handleVerify(c._id, 'rejected')}
                            className="px-3 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold text-xs rounded-full transition"
                          >
                            Reject charity
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Charities;
