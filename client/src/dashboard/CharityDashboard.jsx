import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  FolderKanban,
  Users,
  HandHeart,
  PlusCircle,
  Megaphone,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import CampaignProgress from '../components/CampaignProgress';
import { useAuth } from '../context/AuthContext';
import campaignService from '../services/campaignService';
import volunteerService from '../services/volunteerService';
import { charityService } from '../services/adminService';

export const CharityDashboard = () => {
  const { user } = useAuth();
  const [charity, setCharity] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cProfile = await charityService.getMyCharity();
        if (cProfile?.charity) {
          setCharity(cProfile.charity);

          const [campRes, volRes] = await Promise.all([
            campaignService.getCampaigns({ charityId: cProfile.charity._id, status: 'All' }),
            volunteerService.getCharityApplications(),
          ]);

          if (campRes?.campaigns) setCampaigns(campRes.campaigns);
          if (volRes?.applications) setVolunteers(volRes.applications);
        }
      } catch (err) {
        console.error('Failed to load charity dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRaised = campaigns.reduce((acc, curr) => acc + (curr.raisedAmount || 0), 0);
  const activeCount = campaigns.filter((c) => c.status === 'active').length;
  const totalDonors = campaigns.reduce((acc, curr) => acc + (curr.donorCount || 0), 0);
  const totalVolunteerApps = volunteers.length;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-bg">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl">
        {/* Verification banner if pending */}
        {charity && !charity.isVerified && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Your non-profit profile ({charity.organizationName}) is currently under review by administrators. Once approved, your campaigns will display the verified badge.
              </span>
            </div>
            <Link to="/profile" className="font-bold underline ml-2 whitespace-nowrap">
              Review details
            </Link>
          </div>
        )}

        {/* Header and Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-brand">Organization hub</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-heading">
              {charity?.organizationName || 'Charity'} dashboard
            </h1>
            <p className="mt-1 text-xs text-muted">
              Manage your fundraising campaigns, track community donations, and coordinate volunteers.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/charity/create-campaign"
              className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-full text-xs flex items-center gap-1.5 shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Start campaign</span>
            </Link>
            <Link
              to="/charity/updates"
              className="px-5 py-2.5 bg-surface border border-line hover:border-brand/40 text-ink font-semibold rounded-full text-xs flex items-center gap-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Megaphone className="w-3.5 h-3.5 text-brand" />
              <span>Post milestone</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            icon={TrendingUp}
            title="Total funds raised"
            value={`₹${totalRaised.toLocaleString('en-IN')}`}
            subtitle="Across all campaigns"
          />
          <StatCard
            icon={FolderKanban}
            title="Active appeals"
            value={activeCount}
            subtitle={`${campaigns.length} total initiatives`}
          />
          <StatCard
            icon={Users}
            title="Total backers"
            value={totalDonors}
            subtitle="Unique donations received"
          />
          <StatCard
            icon={HandHeart}
            title="Volunteer applications"
            value={totalVolunteerApps}
            subtitle="Community requests"
          />
        </div>

        {/* Campaign Performance Table */}
        <div className="bg-surface rounded-card border border-line shadow-card overflow-hidden">
          <div className="p-6 border-b border-line flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-ink font-heading">Campaign performance</h2>
              <p className="text-xs text-muted">Real-time status and donation progress</p>
            </div>
            <Link
              to="/charity/manage-campaigns"
              className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading campaigns..." />
          ) : campaigns.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No campaigns created yet"
              description="Launch your first fundraising campaign to start receiving contributions."
              actionLabel="Start campaign"
              actionLink="/charity/create-campaign"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-bg text-[11px] font-semibold text-muted border-b border-line">
                    <th className="py-3 px-6">Campaign title</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Progress</th>
                    <th className="py-3 px-6">Raised / goal</th>
                    <th className="py-3 px-6">Backers</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {campaigns.map((camp) => (
                    <tr key={camp._id} className="hover:bg-bg/60 transition">
                      <td className="py-4 px-6 font-bold text-ink">
                        <Link
                          to={`/campaigns/${camp._id}`}
                          className="hover:text-brand transition flex items-center gap-2 truncate max-w-xs"
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
                      <td className="py-4 px-6 text-muted font-medium">
                        {camp.donorCount}
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
                        <Link
                          to={`/campaigns/${camp._id}`}
                          className="text-xs font-bold text-brand hover:underline"
                        >
                          View appeal
                        </Link>
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

export default CharityDashboard;
