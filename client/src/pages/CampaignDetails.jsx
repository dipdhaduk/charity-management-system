import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BadgeCheck,
  MapPin,
  Calendar,
  Megaphone,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import CampaignProgress from '../components/CampaignProgress';
import DonationForm from '../components/DonationForm';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import campaignService from '../services/campaignService';

export const CampaignDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const res = await campaignService.getCampaignById(id);
        if (res?.campaign) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load campaign details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDonationSuccess = async () => {
    // Refresh server totals so repeat donations do not inflate the donor count.
    try {
      const res = await campaignService.getCampaignById(id);
      if (res?.campaign) setData(res);
    } catch (err) {
      console.error('Could not refresh campaign totals:', err);
    }
  };

  if (loading) return <Loader message="Loading campaign details..." />;

  if (!data?.campaign) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4">
        <EmptyState
          title="Campaign not found"
          description="The cause you are looking for has been removed or is no longer accessible."
          actionLabel="Explore active campaigns"
          actionLink="/campaigns"
        />
      </div>
    );
  }

  const { campaign, updates = [], recentDonations = [] } = data;
  const charity = campaign.charity;

  const calculateDaysLeft = () => {
    if (!campaign.endDate) return null;
    const diff = new Date(campaign.endDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : 'Completed';
  };

  const daysLeft = calculateDaysLeft();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/campaigns"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-brand transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-full pr-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to campaigns</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-surface border border-line hover:border-brand/40 rounded-full text-xs font-semibold text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Share2 className="w-3.5 h-3.5 text-muted" />
          <span>{copied ? 'Link copied' : 'Share cause'}</span>
        </button>
      </div>

      {/* Main Grid: Left story & updates, Right Sticky Donation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Main Visual & Header */}
          <div className="bg-surface rounded-featured border border-line overflow-hidden shadow-card">
            <div className="relative h-72 sm:h-96 w-full bg-line/20">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-surface/90 text-ink text-xs font-bold rounded-full shadow-xs backdrop-blur-xs">
                  {campaign.category}
                </span>
                {campaign.status === 'completed' && (
                  <span className="px-3 py-1 bg-ink text-surface text-xs font-semibold rounded-full">
                    Completed
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-ink text-sm">{charity?.organizationName}</span>
                  {charity?.isVerified && (
                    <BadgeCheck className="w-4 h-4 text-brand" title="Verified NGO" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {campaign.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Started {new Date(campaign.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-ink leading-tight font-heading">
                {campaign.title}
              </h1>

              {/* Progress and numbers */}
              <div className="pt-2 pb-4 border-y border-line space-y-3">
                <CampaignProgress
                  raisedAmount={campaign.raisedAmount}
                  goalAmount={campaign.goalAmount}
                />
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="bg-bg p-3 rounded-2xl border border-line">
                    <p className="text-base sm:text-xl font-bold text-ink">
                      ₹{campaign.raisedAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-muted font-medium">Raised so far</p>
                  </div>
                  <div className="bg-bg p-3 rounded-2xl border border-line">
                    <p className="text-base sm:text-xl font-bold text-ink">
                      {campaign.donorCount}
                    </p>
                    <p className="text-[11px] text-muted font-medium">Generous donors</p>
                  </div>
                  <div className="bg-bg p-3 rounded-2xl border border-line">
                    <p className="text-base sm:text-xl font-bold text-ink">{daysLeft}</p>
                    <p className="text-[11px] text-muted font-medium">Time remaining</p>
                  </div>
                </div>
              </div>

              {/* Detailed cause story */}
              <div className="space-y-3 pt-2">
                <h2 className="text-lg font-bold text-ink font-heading">About this cause</h2>
                <p className="text-muted text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {campaign.description}
                </p>
              </div>
            </div>
          </div>

          {/* Charity Profile Card */}
          {charity && (
            <div className="bg-surface rounded-card border border-line p-6 shadow-card space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={charity.logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80'}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border border-line"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-ink">{charity.organizationName}</h3>
                    {charity.isVerified && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold bg-soft text-brand rounded-full flex items-center gap-0.5">
                        <BadgeCheck className="w-3 h-3" /> Verified NGO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    {charity.registrationNumber ? `Reg No: ${charity.registrationNumber} • ` : ''}{charity.city || 'India'}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {charity.description}
              </p>
            </div>
          )}

          {/* Milestone Updates Timeline */}
          <div className="bg-surface rounded-card border border-line p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-brand" />
                <h3 className="text-base font-bold text-ink font-heading">
                  Field milestone updates
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-bg rounded-full text-muted border border-line">
                {updates.length} updates
              </span>
            </div>

            {updates.length === 0 ? (
              <p className="text-xs text-muted py-4 text-center">
                No milestone updates posted yet. As soon as the organizer posts progress photos, you will see them here.
              </p>
            ) : (
              <div className="space-y-5">
                {updates.map((up) => (
                  <div
                    key={up._id}
                    className="p-5 bg-bg rounded-2xl border border-line space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span className="font-semibold text-brand">Field milestone</span>
                      <span>{new Date(up.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-base font-bold text-ink">{up.title}</h4>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed">{up.content}</p>
                    {up.image && (
                      <img
                        src={up.image}
                        alt=""
                        className="w-full h-48 sm:h-64 object-cover rounded-xl mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Backers List */}
          {recentDonations.length > 0 && (
            <div className="bg-surface rounded-card border border-line p-6 shadow-card space-y-4">
              <h3 className="text-base font-bold text-ink font-heading">Recent backers</h3>
              <div className="divide-y divide-line">
                {recentDonations.map((d) => (
                  <div key={d._id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={d.donor?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-ink">
                          {d.donor?.name || 'Anonymous donor'}
                        </p>
                        <p className="text-[10px] text-muted">
                          {new Date(d.donatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-brand">
                      ₹{d.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Column (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6">
          <DonationForm campaign={campaign} onDonationSuccess={handleDonationSuccess} />
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
