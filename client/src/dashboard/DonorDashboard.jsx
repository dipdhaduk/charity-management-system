import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  TrendingUp,
  Receipt as ReceiptIcon,
  Printer,
  Calendar,
  ShieldCheck,
  X,
  HandHeart,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import donationService from '../services/donationService';
import volunteerService from '../services/volunteerService';

export const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [volunteerApps, setVolunteerApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donRes, volRes] = await Promise.all([
          donationService.getMyDonations(),
          volunteerService.getMyApplications().catch(() => ({ applications: [] })),
        ]);

        if (donRes?.donations) {
          setDonations(donRes.donations);
        }
        if (volRes?.applications) {
          setVolunteerApps(volRes.applications);
        }
      } catch (err) {
        console.error('Failed to load donor data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalDonated = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const uniqueCampaigns = new Set(donations.map((d) => d.campaign?._id)).size;
  const currentYear = new Date().getFullYear();
  const donationsThisYear = donations
    .filter((d) => new Date(d.donatedAt).getFullYear() === currentYear)
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-bg">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold text-brand">Donor portal</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-heading">
            Your giving footprint
          </h1>
          <p className="mt-1 text-xs text-muted">
            Track your donations, view receipts, and revisit the community campaigns you support.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <StatCard
            icon={Heart}
            title="Lifetime donated"
            value={`₹${totalDonated.toLocaleString('en-IN')}`}
            subtitle="Total financial support provided"
          />
          <StatCard
            icon={TrendingUp}
            title="Causes supported"
            value={uniqueCampaigns}
            subtitle="Campaigns supported"
          />
          <StatCard
            icon={Calendar}
            title={`Donations in ${currentYear}`}
            value={`₹${donationsThisYear.toLocaleString('en-IN')}`}
            subtitle="Current tax year receipts"
          />
          <StatCard
            icon={HandHeart}
            title="Volunteer drives"
            value={volunteerApps.length}
            subtitle="Hands-on community initiatives"
          />
        </div>

        {/* Transaction History Table */}
        <div className="bg-surface rounded-card border border-line shadow-card overflow-hidden">
          <div className="p-6 border-b border-line flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-ink font-heading">Donation history</h2>
              <p className="text-xs text-muted">Donation history and receipts for successful contributions</p>
            </div>
            <Link
              to="/campaigns"
              className="px-4 py-2 text-xs font-bold text-brand bg-soft hover:bg-soft/80 rounded-full transition"
            >
              Explore more causes
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading your donations..." />
          ) : donations.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No donations recorded yet"
              description="Make your first gift to an active campaign to see it in your donation history."
              actionLabel="Browse causes"
              actionLink="/campaigns"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-bg text-[11px] font-semibold text-muted border-b border-line">
                    <th className="py-3 px-6">Campaign</th>
                    <th className="py-3 px-6">Amount</th>
                    <th className="py-3 px-6">Organization</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6 text-right">Tax receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {donations.map((d) => (
                    <tr key={d._id} className="hover:bg-bg/60 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {d.campaign?.image && (
                            <img
                              src={d.campaign.image}
                              alt=""
                              className="w-9 h-9 rounded-xl object-cover"
                            />
                          )}
                          <div>
                            <Link
                              to={`/campaigns/${d.campaign?._id}`}
                              className="font-bold text-ink hover:text-brand transition truncate max-w-xs block"
                            >
                              {d.campaign?.title || 'Relief appeal'}
                            </Link>
                            <span className="text-[10px] text-muted">
                              TXN {d.transactionId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-bold text-brand text-sm">
                        ₹{d.amount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 px-6 text-muted">
                        {d.charity?.organizationName || 'CharityHub Partner'}
                      </td>

                      <td className="py-4 px-6 text-muted">
                        {new Date(d.donatedAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {d.receipt ? (
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(d.receipt)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg hover:bg-soft text-ink hover:text-brand font-semibold rounded-full border border-line transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          >
                            <ReceiptIcon className="w-3.5 h-3.5 text-muted" />
                            <span>View receipt</span>
                          </button>
                        ) : (
                          <span className="text-muted">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Community Volunteer Drives for Donor */}
        <div className="bg-surface rounded-card border border-line shadow-card overflow-hidden">
          <div className="p-6 border-b border-line flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-brand">Hands-on support</p>
              <h2 className="text-base font-bold text-ink font-heading">
                Community volunteer drives
              </h2>
              <p className="text-xs text-muted">
                Drives you have signed up for or supported in your local community
              </p>
            </div>
            <Link
              to="/dashboard/volunteer"
              className="px-4 py-2 text-xs font-bold text-brand bg-soft hover:bg-soft/80 rounded-full transition flex items-center gap-1"
            >
              <span>Explore open drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {volunteerApps.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-xs text-muted">
                You have not signed up for any local volunteer drives yet. Lending your time is a great way to deepen your community impact!
              </p>
              <Link
                to="/dashboard/volunteer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink text-surface rounded-full text-xs font-bold hover:bg-ink/90 transition"
              >
                <HandHeart className="w-3.5 h-3.5" />
                <span>Browse volunteer drives</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {volunteerApps.map((app) => (
                <div
                  key={app._id}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-bg/40 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-ink text-sm">
                        {app.opportunity?.title || 'Community volunteering'}
                      </h4>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                        }`}
                      >
                        {app.status === 'approved'
                          ? 'Approved'
                          : app.status === 'rejected'
                          ? 'Rejected'
                          : 'Pending review'}
                      </span>
                    </div>
                    <p className="text-xs text-muted">
                      Organizer: {app.opportunity?.charity?.organizationName || 'CharityHub partner'} • {app.opportunity?.location || 'Local community'}
                    </p>
                    {app.message && (
                      <p className="text-xs text-ink/80 italic line-clamp-1">
                        "{app.message}"
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Receipt Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface rounded-card max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-soft border border-line animate-pop-in">
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-soft text-brand flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink text-base">CharityHub donation receipt</h3>
                    <p className="text-[11px] text-muted">Your donation record and receipt details</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="text-muted hover:text-ink p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  aria-label="Close receipt"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-bg rounded-2xl border border-line text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-muted">Receipt number</span>
                  <span className="font-mono font-bold text-ink">{selectedReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Donor name</span>
                  <span className="font-semibold text-ink">{selectedReceipt.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Campaign</span>
                  <span className="font-semibold text-ink max-w-[200px] truncate text-right">
                    {selectedReceipt.campaignName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Donation amount</span>
                  <span className="font-extrabold text-brand text-sm">
                    ₹{selectedReceipt.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Transaction ID</span>
                  <span className="font-mono text-muted text-[11px]">{selectedReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Date & time</span>
                  <span className="text-ink">
                    {new Date(selectedReceipt.donationDate || Date.now()).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 px-4 bg-ink hover:bg-ink/90 text-surface font-bold rounded-full text-xs flex items-center justify-center gap-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Save receipt as PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="py-2.5 px-5 bg-surface hover:bg-bg border border-line text-ink font-semibold rounded-full text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DonorDashboard;
