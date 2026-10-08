import { useState, useEffect } from 'react';
import { Megaphone, CheckCircle2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import campaignService from '../../services/campaignService';
import { charityService } from '../../services/adminService';

export const CampaignUpdates = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [newUpdate, setNewUpdate] = useState({
    title: '',
    content: '',
    image: '',
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const cRes = await charityService.getMyCharity();
        if (cRes?.charity) {
          const campRes = await campaignService.getCampaigns({ charityId: cRes.charity._id });
          if (campRes?.campaigns?.length > 0) {
            setCampaigns(campRes.campaigns);
            setSelectedCampaignId(campRes.campaigns[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaignId) {
      campaignService
        .getCampaignUpdates(selectedCampaignId)
        .then((res) => {
          if (res?.updates) setUpdates(res.updates);
        })
        .catch(console.error);
    }
  }, [selectedCampaignId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCampaignId || !newUpdate.title || !newUpdate.content) {
      setErrorMsg('Please select a campaign and provide a title and update content.');
      return;
    }

    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await campaignService.addCampaignUpdate(selectedCampaignId, newUpdate);
      if (res?.success) {
        setUpdates([res.update, ...updates]);
        setNewUpdate({ title: '', content: '', image: '' });
        setSuccessMsg('Milestone posted. Contributing donors have been notified.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not post campaign update.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-bg">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-5xl">
        <div>
          <p className="text-xs font-semibold text-brand">Transparency & updates</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-heading">
            Campaign milestone updates
          </h1>
          <p className="mt-1 text-xs text-muted">
            Share progress photos and impact reports with your donors.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 bg-soft text-brand rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-50 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <Loader message="Loading campaigns..." />
        ) : campaigns.length === 0 ? (
          <EmptyState
            title="No campaigns available"
            description="You need at least one active campaign before posting field updates."
            actionLabel="Start campaign"
            actionLink="/charity/create-campaign"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Post update form */}
            <div className="lg:col-span-5 bg-surface rounded-card border border-line p-6 shadow-card space-y-4">
              <h2 className="font-bold text-ink text-sm flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-brand" />
                <span>Post new milestone</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-muted mb-1">
                    Select campaign *
                  </label>
                  <select
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
                  >
                    {campaigns.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-muted mb-1">
                    Milestone title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. First medical supplies delivered to clinic"
                    value={newUpdate.title}
                    onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-muted mb-1">
                    Photo URL (optional)
                  </label>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newUpdate.image}
                      onChange={(e) => setNewUpdate({ ...newUpdate, image: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-muted mb-1">
                    Impact content & details *
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Describe what was accomplished, who was helped, and next milestones..."
                    value={newUpdate.content}
                    onChange={(e) =>
                      setNewUpdate({ ...newUpdate, content: e.target.value })
                    }
                    className="w-full p-3 rounded-2xl border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-brand hover:bg-brand-hover text-white font-bold rounded-full text-xs shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  Publish and notify donors
                </button>
              </form>
            </div>

            {/* Updates list */}
            <div className="lg:col-span-7 bg-surface rounded-card border border-line p-6 shadow-card space-y-4">
              <h2 className="font-bold text-ink text-sm">Published milestones</h2>

              {updates.length === 0 ? (
                <p className="text-xs text-muted py-8 text-center italic">
                  No milestones posted for this campaign yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {updates.map((u) => (
                    <div
                      key={u._id}
                      className="p-4 bg-bg rounded-2xl border border-line space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px] text-muted">
                        <span className="font-semibold text-brand">Campaign update</span>
                        <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-ink text-sm">{u.title}</h3>
                      <p className="text-xs text-muted leading-relaxed">{u.content}</p>
                      {u.image && (
                        <img
                          src={u.image}
                          alt=""
                          className="w-full h-44 object-cover rounded-xl mt-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CampaignUpdates;
