import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw } from 'lucide-react';
import CampaignCard from '../components/CampaignCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import DonationForm from '../components/DonationForm';
import campaignService from '../services/campaignService';

const CATEGORIES = [
  'All',
  'Healthcare',
  'Education',
  'Food',
  'Environment',
  'Housing',
  'Disaster Relief',
  'Animals',
];

export const Campaigns = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [sortBy, setSortBy] = useState('recent');
  const [activeModalCampaign, setActiveModalCampaign] = useState(null);

  // Sync state when URL search parameters change (e.g. from navbar category links)
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setSelectedCategory(cat);
    const search = searchParams.get('search') || '';
    setSearchTerm(search);
  }, [searchParams]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (selectedStatus && selectedStatus !== 'All') {
          params.status = selectedStatus;
        }
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }
        if (sortBy === 'popular') {
          params.sort = 'popular';
        } else if (sortBy === 'raised') {
          params.sort = 'raised';
        }

        const res = await campaignService.getCampaigns(params);
        if (res?.campaigns) {
          setCampaigns(res.campaigns);
        }
      } catch (err) {
        console.error('Failed to load campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [selectedCategory, selectedStatus, searchTerm, sortBy]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedStatus('active');
    setSearchTerm('');
    setSortBy('recent');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-brand">Community appeals</p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight font-heading">
          Explore active campaigns
        </h1>
        <p className="mt-1.5 text-muted text-sm sm:text-base max-w-xl">
          Browse community campaigns, review their goals and updates, and choose a cause to support.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-card border border-line p-4 sm:p-5 shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by cause, keywords, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-line bg-surface text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
          </div>

          {/* Status selector */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2.5 px-4 rounded-full border border-line text-xs bg-surface font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <option value="active">Active appeals</option>
              <option value="completed">Completed causes</option>
              <option value="All">All statuses</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-4 rounded-full border border-line text-xs bg-surface font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <option value="recent">Newest first</option>
              <option value="popular">Most donors</option>
              <option value="raised">Highest raised</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="sm:col-span-1 flex justify-end">
            <button
              type="button"
              onClick={resetFilters}
              title="Reset all filters"
              className="p-2.5 rounded-full border border-line text-muted hover:text-ink hover:bg-bg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills with aria-pressed */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-muted whitespace-nowrap mr-1">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="button"
              aria-pressed={selectedCategory === cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                selectedCategory === cat
                  ? 'bg-brand text-white shadow-xs'
                  : 'bg-bg text-muted hover:text-ink border border-line'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        {loading ? (
          <Loader message="Loading campaigns..." />
        ) : campaigns.length === 0 ? (
          <EmptyState
            title="No campaigns match your filters"
            description="Try searching with a broader keyword or select another cause category to see active appeals."
            actionLabel="Reset filters"
            onAction={resetFilters}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-muted">
              <span>Showing {campaigns.length} campaigns</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((camp) => (
                <CampaignCard
                  key={camp._id}
                  campaign={camp}
                  onDonateClick={(c) => setActiveModalCampaign(c)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Donation Form */}
      {activeModalCampaign && (
        <DonationForm
          campaign={activeModalCampaign}
          isOpen={!!activeModalCampaign}
          onClose={() => setActiveModalCampaign(null)}
          onDonationSuccess={async () => {
            // The API owns first-time donor counting; use its saved campaign values.
            try {
              const res = await campaignService.getCampaignById(activeModalCampaign._id);
              if (res?.campaign) {
                setCampaigns((prev) => prev.map((c) =>
                  c._id === activeModalCampaign._id ? res.campaign : c
                ));
              }
            } catch (err) {
              console.error('Could not refresh campaign totals:', err);
            }
          }}
        />
      )}
    </div>
  );
};

export default Campaigns;
