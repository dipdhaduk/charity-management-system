import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  HandHeart,
  CheckCircle2,
  Sparkles,
  MapPin,
  X,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import CampaignCard from '../components/CampaignCard';
import CategoryCard from '../components/CategoryCard';
import Loader from '../components/Loader';
import DonationForm from '../components/DonationForm';
import campaignService from '../services/campaignService';
import volunteerService from '../services/volunteerService';
import { useAuth } from '../context/AuthContext';

const CAUSES = [
  'Healthcare',
  'Education',
  'Food',
  'Environment',
  'Housing',
  'Disaster Relief',
  'Animals',
];

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalCampaign, setActiveModalCampaign] = useState(null);
  const [modalDefaultAmount, setModalDefaultAmount] = useState(1000);

  // Interactive "Support the fund" state (inspired by Reference Image 1)
  const [supportAmount, setSupportAmount] = useState(1000);
  const [selectedSupportCampaignId, setSelectedSupportCampaignId] = useState('');

  // Volunteer quick application modal state
  const [selectedVolunteerDrive, setSelectedVolunteerDrive] = useState(null);
  const [applyMotivation, setApplyMotivation] = useState('');
  const [applySkills, setApplySkills] = useState('');
  const [applyAvailability, setApplyAvailability] = useState('');
  const [submittingVolunteer, setSubmittingVolunteer] = useState(false);
  const [volunteerFeedback, setVolunteerFeedback] = useState('');
  const [volunteerError, setVolunteerError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, vRes] = await Promise.all([
          campaignService.getCampaigns({ status: 'active' }),
          volunteerService.getOpportunities({ status: 'open' }),
        ]);

        if (cRes?.campaigns) {
          setCampaigns(cRes.campaigns);
          if (cRes.campaigns.length > 0) {
            setSelectedSupportCampaignId(cRes.campaigns[0]._id);
          }
        }
        if (vRes?.opportunities) {
          setOpportunities(vRes.opportunities.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    const targetCampaign =
      campaigns.find((c) => c._id === selectedSupportCampaignId) ||
      (campaigns.length > 0 ? campaigns[0] : null);

    if (targetCampaign) {
      setModalDefaultAmount(supportAmount);
      setActiveModalCampaign(targetCampaign);
    } else {
      navigate('/campaigns');
    }
  };

  const handleOpenVolunteerModal = (opp) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedVolunteerDrive(opp);
    setApplyMotivation('');
    setApplySkills('');
    setApplyAvailability('');
    setVolunteerFeedback('');
    setVolunteerError('');
  };

  const handleSubmitVolunteerApplication = async (e) => {
    e.preventDefault();
    if (!selectedVolunteerDrive) return;

    setSubmittingVolunteer(true);
    setVolunteerFeedback('');
    setVolunteerError('');

    const combinedMessage = [
      applyMotivation.trim(),
      applySkills.trim() ? `Skills: ${applySkills.trim()}` : '',
      applyAvailability.trim() ? `Availability: ${applyAvailability.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      const res = await volunteerService.applyOpportunity({
        opportunityId: selectedVolunteerDrive._id,
        message: combinedMessage,
      });

      if (res?.success) {
        setVolunteerFeedback('Application submitted. The charity coordinator will review it shortly.');
        setTimeout(() => {
          setSelectedVolunteerDrive(null);
          setVolunteerFeedback('');
        }, 2200);
      }
    } catch (err) {
      setVolunteerError(err.message || 'Could not submit application. Please retry.');
    } finally {
      setSubmittingVolunteer(false);
    }
  };

  // Find closing soon or featured campaign
  const featuredCampaign = campaigns.length > 0 ? campaigns[0] : null;
  const regularCampaigns = campaigns.length > 1 ? campaigns.slice(1, 7) : campaigns;
  const supportCampaign = campaigns.find((campaign) => campaign._id === selectedSupportCampaignId) || featuredCampaign;

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-20 sm:pb-16 bg-gradient-to-b from-soft/50 via-bg to-bg border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft border border-brand/20 text-brand text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Community-led campaigns</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-ink tracking-tight font-heading leading-tight">
              Give once. <br />
              Follow every campaign's progress.
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
              Find community campaigns, follow their fundraising progress, and hear from the organizations doing the work.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/campaigns"
                className="px-6 py-3 bg-brand text-white rounded-full font-bold text-sm hover:bg-brand/95 transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Explore campaigns
              </Link>
              <Link
                to="/dashboard/volunteer"
                className="px-6 py-3 bg-surface text-ink rounded-full font-bold text-sm border border-line hover:bg-soft/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Volunteer drives
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-line pt-5 sm:grid-cols-3 sm:gap-6">
            <div className="flex items-center gap-3 text-sm font-semibold text-ink"><TrendingUp className="h-5 w-5 shrink-0 text-brand" />Follow campaign progress</div>
            <div className="flex items-center gap-3 text-sm font-semibold text-ink"><ShieldCheck className="h-5 w-5 shrink-0 text-brand" />Review organization details</div>
            <div className="flex items-center gap-3 text-sm font-semibold text-ink"><HandHeart className="h-5 w-5 shrink-0 text-brand" />Support causes that matter to you</div>
          </div>
        </div>
      </section>

      {/* 2. SUPPORT THE FUND (Direct Contribution Widget inspired by Reference Image 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-amber-500" />
            <span>Direct Philanthropic Support</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight font-heading">
            Support the fund
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Select an active campaign and choose an amount. Your donation will be attached to that campaign.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
          {/* Left: Interactive Donation Calculator Card */}
          <div className="lg:col-span-7 bg-surface rounded-featured border border-line p-6 sm:p-8 shadow-card flex flex-col justify-between space-y-6">
            <p className="text-sm font-bold text-brand">One-time donation</p>

            {/* Big Amount Display */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-ink font-heading">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(supportAmount)}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-soft text-brand text-xs font-bold">
                  INR
                </span>
              </div>

              {/* Quick Additive Preset Chips */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {[250, 500, 1000, 2000, 5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSupportAmount(val)}
                    className={`py-2 px-1 text-center rounded-full text-xs font-bold border transition cursor-pointer ${
                      supportAmount === val
                        ? 'bg-brand text-white border-brand shadow-2xs'
                        : 'bg-surface text-ink border-line hover:border-brand/40'
                    }`}
                  >
                    +{val >= 1000 ? `${val / 1000}k` : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Cause Selector */}
            {campaigns.length > 0 && (
              <div className="space-y-1">
                <label
                  htmlFor="support-target"
                  className="block text-xs font-semibold text-muted"
                >
                  Allocate towards initiative
                </label>
                <select
                  id="support-target"
                  value={selectedSupportCampaignId}
                  onChange={(e) => setSelectedSupportCampaignId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-line bg-surface text-xs font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {campaigns.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} ({c.category})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Prominent Dark Button */}
            <button
              type="button"
              onClick={handleSupportSubmit}
              className="w-full py-3.5 px-6 bg-slate-950 hover:bg-slate-900 active:scale-98 text-white font-bold rounded-full transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span>
                Continue to donate
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Current campaign details */}
          <div className="lg:col-span-5 overflow-hidden rounded-featured border border-line bg-surface shadow-card">
            {supportCampaign ? (
              <>
                <img src={supportCampaign.image} alt="" className="h-48 w-full object-cover" loading="lazy" />
                <div className="space-y-4 p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-brand">{supportCampaign.category}</span>
                    <span className="text-xs text-muted">{supportCampaign.location}</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-ink">{supportCampaign.title}</h3>
                    <p className="mt-1 text-sm text-muted">Organized by {supportCampaign.charity?.organizationName || 'Community organization'}</p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, (supportCampaign.raisedAmount / Math.max(supportCampaign.goalAmount, 1)) * 100)}%` }} />
                  </div>
                  <p className="text-xs text-muted">{supportCampaign.donorCount || 0} supporters · {Math.round(Math.min(100, (supportCampaign.raisedAmount / Math.max(supportCampaign.goalAmount, 1)) * 100))}% of goal raised</p>
                  <Link to={`/campaigns/${supportCampaign._id}`} className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline">View campaign <ArrowUpRight className="h-4 w-4" /></Link>
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-64 flex-col items-center justify-center p-8 text-center">
                <Heart className="mb-3 h-8 w-8 text-brand" />
                <h3 className="font-heading text-lg font-bold text-ink">Choose a campaign to support</h3>
                <p className="mt-2 text-sm text-muted">Active campaigns will appear here when available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. FEATURED CLOSING SOON CAMPAIGN (if available) */}
      {featuredCampaign && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-brand">Campaign spotlight</p>
              <h2 className="text-2xl font-extrabold text-ink tracking-tight font-heading">
                Featured campaign
              </h2>
            </div>
            <Link
              to="/campaigns"
              className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
            >
              <span>All campaigns</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <CampaignCard
            campaign={featuredCampaign}
            featured={true}
            onDonateClick={(camp) => {
              setModalDefaultAmount(1000);
              setActiveModalCampaign(camp);
            }}
          />
        </section>
      )}

      {/* 4. CAUSE CATEGORY CHIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div>
          <p className="text-xs font-semibold text-brand">Browse by cause</p>
          <h2 className="text-2xl font-extrabold text-ink tracking-tight font-heading">
            Where your heart lies
          </h2>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {CAUSES.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              onClick={() => {
                navigate(`/campaigns?category=${encodeURIComponent(category)}`);
              }}
            />
          ))}
        </div>
      </section>

      {/* 5. FUND PROJECTS / ACTIVE INITIATIVES (Inspired by Reference Image 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand">Active initiatives</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-heading">
              Fund projects
            </h2>
          </div>
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-line bg-surface hover:border-brand/40 text-xs font-bold text-ink transition shadow-2xs"
          >
            <span>All projects</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading campaigns..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularCampaigns.map((camp) => (
              <CampaignCard
                key={camp._id}
                campaign={camp}
                onDonateClick={(c) => {
                  setModalDefaultAmount(1000);
                  setActiveModalCampaign(c);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. MISSION & OBJECTIVES (Inspired by Reference Image 1 Mobile Screen) */}
      <section className="bg-surface border-y border-line py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <p className="text-xs font-semibold text-brand">Our Philosophy</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-heading">
              Mission & objectives
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              CharityHub brings campaign discovery, fundraising, and volunteer coordination together for community organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Objective 1 */}
            <div className="p-6 sm:p-8 bg-bg rounded-featured border border-line space-y-4">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center font-heading text-sm shadow-2xs">
                1
              </div>
              <h3 className="text-xl font-bold text-ink font-heading">Fund Objectives</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Campaigns help people find local initiatives to support. Participating organizations can share updates with donors and volunteers.
              </p>
            </div>

            {/* Objective 2 */}
            <div className="p-6 sm:p-8 bg-bg rounded-featured border border-line space-y-4">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center font-heading text-sm shadow-2xs">
                2
              </div>
              <h3 className="text-xl font-bold text-ink font-heading">Platform mission</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Help people discover community campaigns, support fundraising efforts, and follow updates shared by participating organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VOLUNTEER CTA BLOCK */}
      {opportunities.length > 0 && (
        <section id="opportunities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-brand">Hands-on support</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-heading">
                Volunteer in your community
              </h2>
            </div>
            <Link
              to="/dashboard/volunteer"
              className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
            >
              <span>All drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div
                key={opp._id}
                className="bg-surface rounded-card p-6 border border-line shadow-card flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="font-semibold text-brand">
                      {opp.charity?.organizationName || 'CharityHub partner'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {opp.location}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-ink font-heading">{opp.title}</h3>
                  <p className="text-xs text-muted line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-line flex items-center justify-between">
                  <span className="text-xs text-muted font-medium">
                    {opp.volunteersNeeded} spots open
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenVolunteerModal(opp)}
                    className="inline-flex items-center px-4 py-1.5 bg-slate-950 text-white rounded-full text-xs font-bold hover:bg-slate-900 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    Apply now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* QUICK DONATION MODAL */}
      {activeModalCampaign && (
        <DonationForm
          campaign={activeModalCampaign}
          isOpen={!!activeModalCampaign}
          defaultAmount={modalDefaultAmount}
          onClose={() => setActiveModalCampaign(null)}
          onDonationSuccess={() => {
            // refreshed
          }}
        />
      )}

      {/* VOLUNTEER APPLICATION MODAL */}
      {selectedVolunteerDrive && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-card max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-line max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-line">
              <div>
                <p className="text-xs font-semibold text-brand">Hands-on support</p>
                <h3 className="font-heading font-bold text-ink text-lg">
                  Volunteer application
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVolunteerDrive(null)}
                className="text-muted hover:text-ink p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-bg rounded-xl border border-line text-xs space-y-1">
              <p className="font-bold text-ink">{selectedVolunteerDrive.title}</p>
              <p className="text-muted text-[11px]">
                Organized by {selectedVolunteerDrive.charity?.organizationName || 'CharityHub Partner'}
              </p>
              <p className="text-muted text-[11px] flex items-center gap-1 pt-1">
                <MapPin className="w-3 h-3 text-brand" /> {selectedVolunteerDrive.location}
              </p>
            </div>

            {volunteerFeedback && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{volunteerFeedback}</span>
              </div>
            )}

            {volunteerError && (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{volunteerError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitVolunteerApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">
                  Why would you like to join this initiative? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={applyMotivation}
                  onChange={(e) => setApplyMotivation(e.target.value)}
                  placeholder="Share your interest and motivation..."
                  className="w-full px-3 py-2 rounded-xl border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">
                  Relevant skills / background
                </label>
                <input
                  type="text"
                  value={applySkills}
                  onChange={(e) => setApplySkills(e.target.value)}
                  placeholder="e.g. Teaching, first aid, event logistics, driving..."
                  className="w-full px-3 py-2 rounded-xl border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">
                  Your availability
                </label>
                <input
                  type="text"
                  value={applyAvailability}
                  onChange={(e) => setApplyAvailability(e.target.value)}
                  placeholder="e.g. Saturday mornings, 4 hours / week..."
                  className="w-full px-3 py-2 rounded-xl border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedVolunteerDrive(null)}
                  className="flex-1 py-2.5 px-4 border border-line text-ink rounded-full text-xs font-semibold hover:bg-bg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingVolunteer}
                  className="flex-1 py-2.5 px-4 bg-brand text-white rounded-full text-xs font-bold hover:bg-brand-hover transition cursor-pointer disabled:opacity-50"
                >
                  {submittingVolunteer ? 'Submitting...' : 'Submit application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;



