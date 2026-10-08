import { useState, useEffect } from 'react';
import { Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { charityService } from '../services/adminService';

export const Profile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });

  const [charityData, setCharityData] = useState({
    organizationName: '',
    description: '',
    registrationNumber: '',
    city: '',
    state: '',
    address: '',
    website: '',
  });

  const [charityId, setCharityId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user?.role === 'charity') {
      charityService
        .getMyCharity()
        .then((res) => {
          if (res?.charity) {
            setCharityId(res.charity._id);
            setCharityData({
              organizationName: res.charity.organizationName || '',
              description: res.charity.description || '',
              registrationNumber: res.charity.registrationNumber || '',
              city: res.charity.city || '',
              state: res.charity.state || '',
              address: res.charity.address || '',
              website: res.charity.website || '',
            });
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await authService.updateProfile(formData);
      if (res.success) {
        updateUser(res.user);
        setSuccessMsg('Account details saved successfully.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not update profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCharitySubmit = async (e) => {
    e.preventDefault();
    if (!charityId) return;
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await charityService.updateCharity(charityId, charityData);
      if (res.success) {
        setSuccessMsg('Non-profit legal information updated.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not update charity details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <p className="text-xs font-semibold text-brand">Personal settings</p>
        <h1 className="text-3xl font-extrabold text-ink tracking-tight font-heading">
          Account profile
        </h1>
        <p className="mt-1 text-xs text-muted">
          Manage your credentials, tax receipt details, and non-profit organization data.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-soft text-brand rounded-card text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 text-rose-800 rounded-card text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Basic Account Card */}
      <div className="bg-surface rounded-card border border-line p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-line">
          <img
            src={formData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt=""
            className="w-14 h-14 rounded-full object-cover border border-line"
          />
          <div>
            <h2 className="text-lg font-bold text-ink">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted">{user?.email}</span>
              <span className="px-2.5 py-0.5 text-[10px] capitalize font-bold bg-soft text-brand rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prof-name" className="block text-xs font-semibold text-muted mb-1">
                Full name
              </label>
              <input
                id="prof-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-full border border-line text-xs bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </div>

            <div>
              <label htmlFor="prof-phone" className="block text-xs font-semibold text-muted mb-1">
                Phone number
              </label>
              <input
                id="prof-phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-full border border-line text-xs bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prof-avatar" className="block text-xs font-semibold text-muted mb-1">
              Avatar photo URL
            </label>
            <input
              id="prof-avatar"
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full px-4 py-2.5 rounded-full border border-line text-xs bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-full text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Save changes
          </button>
        </form>
      </div>

      {/* Charity Organization Settings (If Charity) */}
      {user?.role === 'charity' && charityId && (
        <div className="bg-surface rounded-card border border-line p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-line">
            <Building2 className="w-5 h-5 text-brand" />
            <h2 className="text-lg font-bold text-ink font-heading">
              Non-profit organization information
            </h2>
          </div>

          <form onSubmit={handleCharitySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">
                  Legal organization name
                </label>
                <input
                  type="text"
                  value={charityData.organizationName}
                  onChange={(e) =>
                    setCharityData({ ...charityData, organizationName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-full border border-line text-xs bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">
                  Registration / 80G number
                </label>
                <input
                  type="text"
                  value={charityData.registrationNumber}
                  onChange={(e) =>
                    setCharityData({ ...charityData, registrationNumber: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-full border border-line text-xs bg-surface text-ink font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1">
                Organization mission & overview
              </label>
              <textarea
                rows="3"
                value={charityData.description}
                onChange={(e) => setCharityData({ ...charityData, description: e.target.value })}
                className="w-full p-4 rounded-2xl border border-line text-xs bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">City</label>
                <input
                  type="text"
                  value={charityData.city}
                  onChange={(e) => setCharityData({ ...charityData, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-full border border-line text-xs bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">State</label>
                <input
                  type="text"
                  value={charityData.state}
                  onChange={(e) => setCharityData({ ...charityData, state: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-full border border-line text-xs bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Official website</label>
                <input
                  type="url"
                  value={charityData.website}
                  onChange={(e) => setCharityData({ ...charityData, website: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-full border border-line text-xs bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  placeholder="https://..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-full text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Update organization profile
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
