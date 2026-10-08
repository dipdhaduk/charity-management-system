import { useState, useEffect } from 'react';
import {
  HandHeart,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Users,
  Send,
  X,
  AlertCircle,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import volunteerService from '../services/volunteerService';

export const VolunteerDashboard = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpp, setSelectedOpp] = useState(null);

  // Form fields for motivation, skills, availability
  const [motivation, setMotivation] = useState('');
  const [skills, setSkills] = useState('');
  const [availability, setAvailability] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = async () => {
    try {
      const [oppRes, appRes] = await Promise.all([
        volunteerService.getOpportunities({ status: 'open' }),
        volunteerService.getMyApplications(),
      ]);

      if (oppRes?.opportunities) setOpportunities(oppRes.opportunities);
      if (appRes?.applications) setMyApplications(appRes.applications);
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not load volunteer drives. Refresh the page to try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedOpp) return;

    setSubmitting(true);
    setFeedback('');
    setErrorMessage('');

    // Combine motivation, skills, and availability into detailed application message
    const combinedMessage = [
      motivation.trim(),
      skills.trim() ? `Skills: ${skills.trim()}` : '',
      availability.trim() ? `Availability: ${availability.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      const res = await volunteerService.applyOpportunity({
        opportunityId: selectedOpp._id,
        message: combinedMessage,
      });

      if (res?.success) {
        setFeedback('Application submitted. The charity coordinator will review it shortly.');
        setSelectedOpp(null);
        setMotivation('');
        setSkills('');
        setAvailability('');
        fetchData();
        setTimeout(() => setFeedback(''), 4000);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Submission failed. Please check your network connection and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const appliedOppIds = new Set(myApplications.map((a) => a.opportunity?._id));
  const approvedCount = myApplications.filter((a) => a.status === 'approved').length;
  const pendingCount = myApplications.filter((a) => a.status === 'pending').length;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-[var(--color-bg)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] tracking-tight">
            Volunteer hub
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Discover community initiatives, contribute your time, and track application responses.
          </p>
        </div>

        {feedback && (
          <div className="p-4 bg-[var(--color-soft)] text-[var(--color-brand)] border border-[var(--color-brand)]/20 rounded-card text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-brand)] shrink-0" />
            {feedback}
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900 rounded-card text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            icon={HandHeart}
            title="Available drives"
            value={opportunities.length}
            subtitle="Open for sign-ups right now"
            color="emerald"
          />
          <StatCard
            icon={CheckCircle2}
            title="Approved drives"
            value={approvedCount}
            subtitle="Confirmed volunteer placements"
            color="emerald"
          />
          <StatCard
            icon={Clock}
            title="Under review"
            value={pendingCount}
            subtitle="Pending charity coordinator approval"
            color="amber"
          />
        </div>

        {/* My Applications Section */}
        <div className="bg-[var(--color-surface)] rounded-card border border-[var(--color-line)] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[var(--color-line)]">
            <h2 className="font-heading text-lg font-bold text-[var(--color-ink)]">
              My applications status
            </h2>
            <p className="text-xs text-[var(--color-muted)] mt-0.5">
              Track responses from charity organizers
            </p>
          </div>

          {myApplications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--color-muted)]">
              You have not applied for any volunteer drives yet. Browse the open drives below to get started.
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-line)]">
              {myApplications.map((app) => (
                <div
                  key={app._id}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[var(--color-soft)]/20 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-heading font-bold text-[var(--color-ink)] text-sm">
                        {app.opportunity?.title || 'Community volunteering'}
                      </h4>
                      {/* Status badges: Pending amber, Approved green, Rejected red */}
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
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
                    <p className="text-xs text-[var(--color-muted)]">
                      Charity: {app.opportunity?.charity?.organizationName || 'CharityHub partner'} • {app.opportunity?.location || 'On site'}
                    </p>
                    {app.message && (
                      <p className="text-xs text-[var(--color-ink)]/80 italic whitespace-pre-line line-clamp-2">
                        "{app.message}"
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-[var(--color-muted)] whitespace-nowrap">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Opportunities Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-[var(--color-ink)]">
              Explore open opportunities
            </h2>
            <span className="text-xs font-medium text-[var(--color-muted)]">
              {opportunities.length} open drives
            </span>
          </div>

          {loading ? (
            <Loader message="Loading volunteer drives..." />
          ) : opportunities.length === 0 ? (
            <EmptyState
              icon={HandHeart}
              title="No open opportunities right now"
              description="Charities will publish new volunteer drives soon. Please check back shortly."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => {
                const isApplied = appliedOppIds.has(opp._id);

                return (
                  <div
                    key={opp._id}
                    className="bg-[var(--color-surface)] rounded-card border border-[var(--color-line)] p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[var(--color-brand)] bg-[var(--color-soft)] px-2.5 py-1 rounded-full">
                          {opp.charity?.organizationName || 'Charity organization'}
                        </span>
                        <span className="text-[var(--color-muted)] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {opp.location}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-[var(--color-ink)] text-base leading-snug">
                        {opp.title}
                      </h3>

                      <p className="text-xs text-[var(--color-muted)] line-clamp-3 leading-relaxed">
                        {opp.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-xs text-[var(--color-muted)] border-t border-[var(--color-line)]">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                          {opp.volunteersNeeded} needed
                        </span>
                        {opp.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(opp.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      {isApplied ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 bg-[var(--color-line)] text-[var(--color-muted)] rounded-full font-semibold text-xs cursor-not-allowed"
                        >
                          Application submitted
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedOpp(opp);
                            setMotivation('');
                            setSkills('');
                            setAvailability('');
                            setErrorMessage('');
                          }}
                          className="w-full py-2.5 px-4 bg-[var(--color-brand)] hover:opacity-90 text-white rounded-full font-semibold text-xs shadow-xs transition"
                        >
                          Apply to volunteer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Apply Modal */}
        {selectedOpp && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[var(--color-surface)] rounded-card max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[var(--color-line)] max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-3 border-b border-[var(--color-line)]">
                <div>
                  <h3 className="font-heading font-bold text-[var(--color-ink)] text-lg">
                    Volunteer application
                  </h3>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">
                    {selectedOpp.title} • {selectedOpp.charity?.organizationName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOpp(null)}
                  className="p-1 rounded-full text-[var(--color-muted)] hover:text-[var(--color-ink)] transition"
                  aria-label="Close application dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-4 text-xs">
                {/* Motivation field */}
                <div>
                  <label className="block font-semibold text-[var(--color-ink)] mb-1">
                    Motivation for joining this drive *
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Describe why you want to support this initiative and what inspires you..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-line)] bg-transparent text-[var(--color-ink)] text-xs focus:outline-none focus:border-[var(--color-brand)] placeholder:text-[var(--color-muted)] font-sans"
                  />
                </div>

                {/* Skills field */}
                <div>
                  <label className="block font-semibold text-[var(--color-ink)] mb-1">
                    Relevant skills & experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. First aid, event coordination, teaching, social media, logistics"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-line)] bg-transparent text-[var(--color-ink)] text-xs focus:outline-none focus:border-[var(--color-brand)] placeholder:text-[var(--color-muted)] font-sans"
                  />
                </div>

                {/* Availability field */}
                <div>
                  <label className="block font-semibold text-[var(--color-ink)] mb-1">
                    Your availability
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Weekends, Saturday mornings, 4 hours weekly"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-line)] bg-transparent text-[var(--color-ink)] text-xs focus:outline-none focus:border-[var(--color-brand)] placeholder:text-[var(--color-muted)] font-sans"
                  />
                </div>

                <div className="flex gap-2.5 pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-5 bg-[var(--color-brand)] text-white font-semibold rounded-full text-xs hover:opacity-90 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'Submitting...' : 'Submit application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOpp(null)}
                    className="py-3 px-5 border border-[var(--color-line)] text-[var(--color-ink)] rounded-full text-xs hover:bg-[var(--color-soft)]/30 transition"
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

export default VolunteerDashboard;
