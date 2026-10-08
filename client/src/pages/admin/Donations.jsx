import { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { adminService } from '../../services/adminService';

export const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await adminService.getDonations();
        if (res?.donations) setDonations(res.donations);
      } catch (err) {
        console.error(err);
        setErrorMsg('Could not load transaction ledger. Refresh to try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const totalAmount = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-[var(--color-bg)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] tracking-tight">
              Platform donations ledger
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Review donation records, payment statuses, and campaign associations.
            </p>
          </div>

          <div className="bg-[var(--color-soft)] border border-[var(--color-brand)]/20 px-5 py-2.5 rounded-full text-right">
            <span className="text-xs font-semibold text-[var(--color-muted)] block">
              Cumulative volume
            </span>
            <span className="font-heading text-xl font-extrabold text-[var(--color-brand)]">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="bg-[var(--color-surface)] rounded-card border border-[var(--color-line)] shadow-xs overflow-hidden">
          {loading ? (
            <Loader message="Loading transactions..." />
          ) : donations.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No donation records"
              description="No donations have been recorded on the platform yet."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--color-soft)]/30 text-xs font-semibold text-[var(--color-muted)] border-b border-[var(--color-line)]">
                    <th className="py-3 px-6">Transaction ID</th>
                    <th className="py-3 px-6">Donor</th>
                    <th className="py-3 px-6">Campaign</th>
                    <th className="py-3 px-6">Amount</th>
                    <th className="py-3 px-6">Beneficiary NGO</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6">Tax status</th>
                    <th className="py-3 px-6 text-right">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-line)]">
                  {donations.map((d) => (
                    <tr key={d._id} className="hover:bg-[var(--color-soft)]/10 transition">
                      <td className="py-4 px-6 font-mono text-xs text-[var(--color-ink)]">
                        {d.transactionId}
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-heading font-semibold text-[var(--color-ink)] text-xs">
                          {d.donor?.name || 'Anonymous donor'}
                        </p>
                        <p className="text-[11px] text-[var(--color-muted)]">{d.donor?.email}</p>
                      </td>

                      <td className="py-4 px-6 font-medium text-[var(--color-ink)] text-xs max-w-xs truncate">
                        {d.campaign?.title || 'General cause support'}
                      </td>

                      <td className="py-4 px-6 font-heading font-bold text-[var(--color-brand)] text-sm">
                        ₹{(d.amount || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 px-6 text-xs text-[var(--color-ink)]/80">
                        {d.charity?.organizationName || 'CharityHub foundation'}
                      </td>

                      <td className="py-4 px-6 text-xs text-[var(--color-muted)]">
                        {new Date(d.donatedAt || d.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-xs">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-soft)] text-[var(--color-brand)]">
                          Receipt available
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 capitalize">
                          {d.paymentStatus || 'completed'}
                        </span>
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

export default Donations;
