import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import campaignService from '../../services/campaignService';

const CATEGORIES = [
  'Healthcare',
  'Education',
  'Food',
  'Environment',
  'Housing',
  'Disaster Relief',
  'Animals',
];

export const CreateCampaign = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Healthcare',
    goalAmount: '',
    description: '',
    image: '',
    location: '',
    endDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.goalAmount || !formData.description) {
      setError('Please provide a campaign title, target goal amount, and description.');
      return;
    }

    if (Number(formData.goalAmount) <= 0) {
      setError('Fundraising goal must be at least ₹1.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await campaignService.createCampaign(formData);
      if (res?.success) {
        navigate('/charity/manage-campaigns');
      }
    } catch (err) {
      setError(err.message || 'Could not launch campaign. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-bg">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-4xl">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <p className="text-xs font-semibold text-brand">Campaign creation</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-heading">
            Start a new campaign
          </h1>
          <p className="mt-1 text-xs text-muted">
            Publish your charitable initiative to the CharityHub community.
          </p>
        </div>

        <div className="bg-surface rounded-card border border-line p-6 sm:p-8 shadow-card">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-800 rounded-2xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div>
              <label htmlFor="camp-title" className="block font-semibold text-muted mb-1">
                Campaign title *
              </label>
              <input
                id="camp-title"
                type="text"
                name="title"
                required
                placeholder="e.g. Critical heart surgery fund for rural children"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="camp-cat" className="block font-semibold text-muted mb-1">
                  Category *
                </label>
                <select
                  id="camp-cat"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="camp-goal" className="block font-semibold text-muted mb-1">
                  Fundraising goal (₹) *
                </label>
                <input
                  id="camp-goal"
                  type="number"
                  name="goalAmount"
                  required
                  min="1"
                  placeholder="e.g. 500000"
                  value={formData.goalAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="camp-loc" className="block font-semibold text-muted mb-1">
                  Target location
                </label>
                <input
                  id="camp-loc"
                  type="text"
                  name="location"
                  placeholder="e.g. Ahmedabad, Gujarat"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div>
                <label htmlFor="camp-end" className="block font-semibold text-muted mb-1">
                  Target end date
                </label>
                <input
                  id="camp-end"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>
            </div>

            <div>
              <label htmlFor="camp-img" className="block font-semibold text-muted mb-1">
                Cover photo URL
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="camp-img"
                  type="url"
                  name="image"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>
            </div>

            <div>
              <label htmlFor="camp-desc" className="block font-semibold text-muted mb-1">
                Detailed cause story & impact breakdown *
              </label>
              <textarea
                id="camp-desc"
                name="description"
                rows="6"
                required
                placeholder="Explain the background, who benefits, how funds are allocated, and why community help is needed..."
                value={formData.description}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-line bg-surface text-ink text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 text-xs font-semibold text-muted hover:text-ink transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-full text-xs shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                {loading ? 'Publishing...' : 'Publish campaign'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateCampaign;
