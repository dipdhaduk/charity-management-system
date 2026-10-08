import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Trash2, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import CampaignProgress from '../../components/CampaignProgress';
import { adminService } from '../../services/adminService';
import campaignService from '../../services/campaignService';

export const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCampaigns = async () => {
    try {
      const res = await adminService.getCampaigns();
      if (res?.campaigns) setCampaigns(res.campaigns);
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not load campaigns. Refresh to try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) return;
    try {
      await campaignService.deleteCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
      setActionMsg('Campaign deleted');
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Delete operation failed. Please retry.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-[var(--color-bg)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] tracking-tight">
            All platform campaigns
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Global repository of active, draft, and completed donation initiatives.
          </p>
        </div>

        {actionMsg && (
          <div className="p-3 bg-[var(--color-soft)] text-[var(--color-brand)] border border-[var(--color-brand)]/20 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {actionMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="bg-[var(--color-surface)] rounded-card border border-[var(--color-line)] shadow-xs overflow-hidden">
          {loading ? (
            <Loader message="Loading platform campaigns..." />
          ) : campaigns.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No campaigns found"
              description="No campaigns exist in the database right now."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--color-soft)]/30 text-xs font-semibold text-[var(--color-muted)] border-b border-[var(--color-line)]">
                    <th className="py-3 px-6">Campaign</th>
                    <th className="py-3 px-6">NGO</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Progress</th>
                    <th className="py-3 px-6">Raised / Goal</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-line)]">
                  {campaigns.map((c) => (
                    <tr key={c._id} className="hover:bg-[var(--color-soft)]/10 transition">
                      <td className="py-4 px-6 font-semibold text-[var(--color-ink)] max-w-xs truncate">
                        <Link
                          to={`/campaigns/${c._id}`}
                          className="hover:text-[var(--color-brand)] transition flex items-center gap-1.5"
                        >
                          {c.title}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-xs text-[var(--color-ink)]/80">
                        {c.charity?.organizationName || 'CharityHub partner'}
                      </td>
                      <td className="py-4 px-6 text-xs text-[var(--color-muted)]">{c.category}</td>
                      <td className="py-4 px-6 w-44">
                        <CampaignProgress
                          raisedAmount={c.raisedAmount}
                          goalAmount={c.goalAmount}
                          showDetails={false}
                        />
                      </td>
                      <td className="py-4 px-6 text-xs font-bold text-[var(--color-ink)]">
                        ₹{(c.raisedAmount || 0).toLocaleString('en-IN')}{' '}
                        <span className="text-[var(--color-muted)] font-normal">
                          / ₹{(c.goalAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            c.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : c.status === 'completed'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                              : 'bg-[var(--color-soft)] text-[var(--color-muted)]'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-2 rounded-full text-[var(--color-muted)] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Delete campaign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

export default Campaigns;
