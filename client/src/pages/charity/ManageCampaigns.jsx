import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, PlusCircle, Edit2, Trash2, X } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import CampaignProgress from '../../components/CampaignProgress';
import campaignService from '../../services/campaignService';
import { charityService } from '../../services/adminService';

export const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCamp, setEditingCamp] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  const fetchCampaigns = async () => {
    try {
      const cRes = await charityService.getMyCharity();
      if (cRes?.charity) {
        const campRes = await campaignService.getCampaigns({
          charityId: cRes.charity._id,
          status: 'All',
        });
        if (campRes?.campaigns) {
          setCampaigns(campRes.campaigns);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await campaignService.deleteCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
      setActionMsg('Campaign deleted successfully.');
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Could not delete campaign.');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingCamp) return;

    try {
      const res = await campaignService.updateCampaign(editingCamp._id, {
        title: editingCamp.title,
        goalAmount: Number(editingCamp.goalAmount),
        status: editingCamp.status,
      });

      if (res?.success) {
        setCampaigns((prev) =>
          prev.map((c) => (c._id === editingCamp._id ? { ...c, ...res.campaign } : c))
        );
        setEditingCamp(null);
        setActionMsg('Campaign details updated.');
        setTimeout(() => setActionMsg(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Could not update campaign.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-bg">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-brand">Campaign operations</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-heading">
              Manage campaigns
            </h1>
            <p className="mt-1 text-xs text-muted">
              Update fundraising targets, adjust cause statuses, or remove completed appeals.
            </p>
          </div>

          <Link
            to="/charity/create-campaign"
            className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-full text-xs flex items-center gap-1.5 shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Start campaign</span>
          </Link>
        </div>

        {actionMsg && (
          <div className="p-3 bg-soft text-brand rounded-2xl text-xs font-semibold">
            {actionMsg}
          </div>
        )}

        <div className="bg-surface rounded-card border border-line shadow-card overflow-hidden">
          {loading ? (
            <Loader message="Loading campaigns..." />
          ) : campaigns.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No campaigns yet"
              description="Launch your first fundraising appeal to start receiving community donations."
              actionLabel="Launch campaign"
              actionLink="/charity/create-campaign"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-bg text-[11px] font-semibold text-muted border-b border-line">
                    <th className="py-3 px-6">Title</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Progress</th>
                    <th className="py-3 px-6">Raised / goal</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {campaigns.map((camp) => (
                    <tr key={camp._id} className="hover:bg-bg/60 transition">
                      <td className="py-4 px-6 font-bold text-ink max-w-xs truncate">
                        <Link
                          to={`/campaigns/${camp._id}`}
                          className="hover:text-brand transition"
                        >
                          {camp.title}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-muted">{camp.category}</td>
                      <td className="py-4 px-6 w-44">
                        <CampaignProgress
                          raisedAmount={camp.raisedAmount}
                          goalAmount={camp.goalAmount}
                          showLabels={false}
                        />
                      </td>
                      <td className="py-4 px-6 font-semibold text-ink">
                        ₹{camp.raisedAmount.toLocaleString('en-IN')}{' '}
                        <span className="text-muted font-normal">
                          / ₹{camp.goalAmount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            camp.status === 'active'
                              ? 'bg-soft text-brand'
                              : camp.status === 'completed'
                              ? 'bg-ink text-surface'
                              : 'bg-line text-muted'
                          }`}
                        >
                          {camp.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingCamp(camp)}
                            className="p-1.5 rounded-full text-muted hover:text-brand hover:bg-soft transition"
                            title="Edit campaign"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(camp._id)}
                            className="p-1.5 rounded-full text-muted hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Quick Edit Modal */}
        {editingCamp && (
          <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface rounded-card max-w-md w-full p-6 space-y-4 shadow-soft border border-line animate-pop-in">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="font-bold text-ink text-sm">Edit campaign details</h3>
                <button
                  type="button"
                  onClick={() => setEditingCamp(null)}
                  className="text-muted hover:text-ink p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-muted mb-1">Title</label>
                  <input
                    type="text"
                    value={editingCamp.title}
                    onChange={(e) =>
                      setEditingCamp({ ...editingCamp, title: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-muted mb-1">
                    Goal amount (₹)
                  </label>
                  <input
                    type="number"
                    value={editingCamp.goalAmount}
                    onChange={(e) =>
                      setEditingCamp({ ...editingCamp, goalAmount: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-muted mb-1">Status</label>
                  <select
                    value={editingCamp.status}
                    onChange={(e) =>
                      setEditingCamp({ ...editingCamp, status: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-brand hover:bg-brand-hover text-white font-bold rounded-full text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCamp(null)}
                    className="py-2.5 px-4 border border-line text-ink rounded-full text-xs hover:bg-bg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageCampaigns;
