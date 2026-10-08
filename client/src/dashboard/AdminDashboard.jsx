import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Building2,
  FolderKanban,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { adminService } from '../services/adminService';

const PIE_COLORS = ['#0b6b4d', '#f2b632', '#2563eb', '#8b5cf6', '#ec4899'];

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [pendingCharities, setPendingCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingCharities(),
      ]);

      if (statsRes?.success) setData(statsRes);
      if (pendingRes?.charities) setPendingCharities(pendingRes.charities);
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not load platform metrics. Refresh to try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id, status) => {
    try {
      await adminService.verifyCharity(id, status);
      setPendingCharities((prev) => prev.filter((c) => c._id !== id));
      setFeedback(status === 'approved' ? 'Charity approved successfully' : 'Charity registration rejected');
      fetchData();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Verification update failed');
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-[var(--color-bg)]">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Loader message="Loading platform analytics..." />
        </main>
      </div>
    );
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};

  // Formatted data for category bar chart
  const categoryData = (charts.categories || []).map((c) => ({
    name: c._id || 'General',
    raised: c.raised || 0,
    goal: c.goal || 0,
    count: c.count || 0,
  }));

  // Formatted data for role pie chart
  const roleData = (charts.roles || []).map((r) => ({
    name: r._id ? r._id.charAt(0).toUpperCase() + r._id.slice(1) : 'User',
    value: r.count || 0,
  }));

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-[var(--color-bg)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] tracking-tight">
              Platform administration
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              System-wide metrics, NGO compliance verification, and financial analytics.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/admin/charities"
              className="px-5 py-2.5 bg-[var(--color-brand)] hover:opacity-90 text-white font-semibold rounded-full text-xs shadow-xs transition"
            >
              Verify charities ({pendingCharities.length})
            </Link>
          </div>
        </div>

        {feedback && (
          <div className="p-4 bg-[var(--color-soft)] text-[var(--color-brand)] border border-[var(--color-brand)]/20 rounded-card text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[var(--color-brand)] shrink-0" />
            {feedback}
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900 rounded-card text-xs font-semibold flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* Top 5 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={TrendingUp}
            title="Total raised"
            value={`₹${(stats.totalDonationAmount || 0).toLocaleString('en-IN')}`}
            subtitle={`${stats.totalDonations || 0} donations`}
            color="emerald"
          />
          <StatCard
            icon={FolderKanban}
            title="Active causes"
            value={stats.activeCampaigns || 0}
            subtitle={`${stats.completedCampaigns || 0} completed`}
            color="emerald"
          />
          <StatCard
            icon={ShieldCheck}
            title="Verified charities"
            value={stats.verifiedCharities || 0}
            subtitle={`${stats.pendingCharities || 0} pending review`}
            color="amber"
          />
          <StatCard
            icon={Users}
            title="Registered users"
            value={stats.registeredUsers || 0}
            subtitle="Platform-wide community"
            color="emerald"
          />
          <StatCard
            icon={Building2}
            title="Volunteers"
            value={stats.volunteers || 0}
            subtitle="Active field champions"
            color="amber"
          />
        </div>

        {/* Verification Queue (If pending charities exist) */}
        {pendingCharities.length > 0 && (
          <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-heading font-bold text-[var(--color-ink)] text-base">
                  Charities awaiting verification ({pendingCharities.length})
                </h3>
              </div>
              <Link
                to="/admin/charities"
                className="text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
              >
                View full queue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingCharities.map((c) => (
                <div
                  key={c._id}
                  className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-line)] shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-[var(--color-ink)] text-base">
                      {c.organizationName}
                    </h4>
                    <p className="text-xs text-[var(--color-muted)]">
                      Reg number: <span className="font-mono text-[var(--color-ink)]">{c.registrationNumber || 'Not submitted'}</span> • {c.city || 'India'}
                    </p>
                    {c.description && (
                      <p className="text-xs text-[var(--color-ink)]/80 mt-2 line-clamp-2">
                        {c.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--color-line)] flex items-center justify-between gap-3">
                    <span className="text-xs text-[var(--color-muted)] truncate">
                      Representative: {c.user?.name || 'Administrator'}
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleVerify(c._id, 'approved')}
                        className="px-3 py-1.5 bg-[var(--color-brand)] hover:opacity-90 text-white font-semibold rounded-full text-xs transition"
                      >
                        Approve charity
                      </button>
                      <button
                        onClick={() => handleVerify(c._id, 'rejected')}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-semibold rounded-full text-xs transition"
                      >
                        Reject charity
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Category Funds Chart (8 cols) */}
          <div className="lg:col-span-8 bg-[var(--color-surface)] rounded-card border border-[var(--color-line)] p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-heading font-bold text-[var(--color-ink)] text-base">
                Funds raised by cause category
              </h3>
              <p className="text-xs text-[var(--color-muted)]">
                Comparing total funds raised in rupees across causes
              </p>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={11}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`}
                  />
                  <Tooltip
                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Raised']}
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '16px',
                      border: '1px solid var(--color-line)',
                      color: 'var(--color-ink)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="raised" fill="#0b6b4d" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Roles Pie Chart (4 cols) */}
          <div className="lg:col-span-4 bg-[var(--color-surface)] rounded-card border border-[var(--color-line)] p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-[var(--color-ink)] text-base">
                Community demographics
              </h3>
              <p className="text-xs text-[var(--color-muted)]">Distribution across user types</p>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '16px',
                      border: '1px solid var(--color-line)',
                      color: 'var(--color-ink)',
                      fontSize: '12px',
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center pt-2 border-t border-[var(--color-line)] text-xs text-[var(--color-muted)]">
              Total registered community:{' '}
              <strong className="text-[var(--color-ink)]">{stats.registeredUsers || 0}</strong> accounts
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
