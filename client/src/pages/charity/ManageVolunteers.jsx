import { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle, XCircle, X } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import volunteerService from '../../services/volunteerService';
import campaignService from '../../services/campaignService';
import { charityService } from '../../services/adminService';

export const ManageVolunteers = () => {
  const [applications, setApplications] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const [newOpp, setNewOpp] = useState({
    title: '',
    description: '',
    volunteersNeeded: 5,
    location: '',
    date: '',
    campaignId: '',
  });

  const fetchData = async () => {
    try {
      const cRes = await charityService.getMyCharity();
      if (cRes?.charity) {
        const [appRes, campRes] = await Promise.all([
          volunteerService.getCharityApplications(),
          campaignService.getCampaigns({ charityId: cRes.charity._id }),
        ]);

        if (appRes?.applications) setApplications(appRes.applications);
        if (campRes?.campaigns) setCampaigns(campRes.campaigns);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await volunteerService.updateApplicationStatus(id, status);
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
      setStatusMsg(`Application was marked as ${status}.`);
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Could not update application status.');
    }
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    if (!newOpp.title || !newOpp.description) return;

    try {
      await volunteerService.createOpportunity(newOpp);
      setShowCreateModal(false);
      setNewOpp({
        title: '',
        description: '',
        volunteersNeeded: 5,
        location: '',
        date: '',
        campaignId: '',
      });
      setStatusMsg('Volunteer drive posted successfully.');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Could not create volunteer drive.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-bg">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-brand">Community outreach</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-heading">
              Volunteer applications
            </h1>
            <p className="mt-1 text-xs text-muted">
              Review volunteer applications and create on-ground community drives.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-full text-xs flex items-center gap-1.5 shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post volunteer drive</span>
          </button>
        </div>

        {statusMsg && (
          <div className="p-3 bg-soft text-brand rounded-2xl text-xs font-semibold">
            {statusMsg}
          </div>
        )}

        <div className="bg-surface rounded-card border border-line shadow-card overflow-hidden">
          {loading ? (
            <Loader message="Loading applications..." />
          ) : applications.length === 0 ? (
            <EmptyState
              title="No volunteer applications yet"
              description="When individuals apply for your volunteer drives, their submissions will appear here."
              actionLabel="Create volunteer drive"
              onAction={() => setShowCreateModal(true)}
            />
          ) : (
            <div className="divide-y divide-line">
              {applications.map((app) => (
                <div key={app._id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={app.volunteer?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border border-line"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-ink text-sm">{app.volunteer?.name}</h4>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            app.status === 'approved'
                              ? 'bg-soft text-brand'
                              : app.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20'
                              : 'bg-amber-50 text-amber-800 dark:bg-amber-950/20'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        Applied for: <strong className="text-ink">{app.opportunity?.title}</strong>
                      </p>
                      <p className="text-xs text-ink/90 mt-2 bg-bg p-3 rounded-2xl border border-line max-w-xl">
                        "{app.message}"
                      </p>
                      <p className="text-[11px] text-muted mt-1">
                        Contact: {app.volunteer?.email} • {app.volunteer?.phone || 'No phone'}
                      </p>
                    </div>
                  </div>

                  {app.status === 'pending' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(app._id, 'approved')}
                        className="px-4 py-1.5 bg-brand hover:bg-brand-hover text-white rounded-full text-xs font-bold transition flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(app._id, 'rejected')}
                        className="px-4 py-1.5 bg-surface border border-line hover:border-rose-400 text-rose-600 rounded-full text-xs font-semibold transition flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Opportunity Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface rounded-card max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-soft border border-line animate-pop-in">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="font-bold text-ink text-base">Post volunteer opportunity</h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-muted hover:text-ink p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateOpportunity} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-muted mb-1">
                    Opportunity title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Weekend community nutrition drive"
                    value={newOpp.title}
                    onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-muted mb-1">
                      Volunteers needed
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newOpp.volunteersNeeded}
                      onChange={(e) =>
                        setNewOpp({ ...newOpp, volunteersNeeded: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-muted mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newOpp.date}
                      onChange={(e) => setNewOpp({ ...newOpp, date: e.target.value })}
                      className="w-full px-4 py-2 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-muted mb-1">
                    Location / venue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Indiranagar Community Hall, Bengaluru"
                    value={newOpp.location}
                    onChange={(e) => setNewOpp({ ...newOpp, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-muted mb-1">
                    Associated campaign (optional)
                  </label>
                  <select
                    value={newOpp.campaignId}
                    onChange={(e) => setNewOpp({ ...newOpp, campaignId: e.target.value })}
                    className="w-full px-4 py-2 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
                  >
                    <option value="">General outreach drive</option>
                    {campaigns.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-muted mb-1">
                    Description & expectations *
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Detail the activities, timing, requirements for volunteers..."
                    value={newOpp.description}
                    onChange={(e) => setNewOpp({ ...newOpp, description: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-brand hover:bg-brand-hover text-white font-bold rounded-full text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    Create volunteer drive
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
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

export default ManageVolunteers;
