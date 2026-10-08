import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Lock, Mail, User, Phone, Building2, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'donor',
    organizationName: '',
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
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please provide your name, email, and a password.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.role === 'charity' && !formData.organizationName) {
      setError('Please provide the legal name of your non-profit organization.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <span className="text-2xl font-extrabold text-ink font-heading">
            Charity<span className="text-brand">Hub</span>
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-heading">
          Create an account
        </h1>
        <p className="mt-1 text-xs text-muted">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-6 sm:rounded-card sm:px-10 border border-line shadow-card space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector chips */}
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">
                I am joining as
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'donor', label: 'Donor' },
                  { id: 'charity', label: 'Charity / NGO' },
                  { id: 'volunteer', label: 'Volunteer' },
                ].map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    role="button"
                    aria-pressed={formData.role === r.id}
                    onClick={() => setFormData((prev) => ({ ...prev, role: r.id }))}
                    className={`py-2 px-2 text-xs font-semibold rounded-full border text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      formData.role === r.id
                        ? 'bg-brand text-white border-brand shadow-xs'
                        : 'bg-surface text-muted border-line hover:border-brand/40'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra fields if Charity */}
            {formData.role === 'charity' && (
              <div>
                <label htmlFor="reg-org" className="block text-xs font-semibold text-muted mb-1">
                  Organization legal name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-org"
                    type="text"
                    name="organizationName"
                    required
                    placeholder="e.g. Care & Hope Foundation"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-line text-xs bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="reg-name" className="block text-xs font-semibold text-muted mb-1">
                Full name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-line text-xs bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold text-muted mb-1">
                Email address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-line text-xs bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-phone" className="block text-xs font-semibold text-muted mb-1">
                Phone number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-line text-xs bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-muted mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-password"
                  type="password"
                  name="password"
                  required
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-line text-xs bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-brand hover:bg-brand-hover text-white font-bold rounded-full shadow-xs transition flex items-center justify-center gap-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
