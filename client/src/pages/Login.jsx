import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email address and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loggedUser = await login(email, password);
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        switch (loggedUser?.role) {
          case 'admin':
            navigate('/dashboard/admin');
            break;
          case 'charity':
            navigate('/dashboard/charity');
            break;
          case 'volunteer':
            navigate('/dashboard/volunteer');
            break;
          default:
            navigate('/dashboard/donor');
            break;
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-bg transition-colors duration-200">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-surface rounded-featured border border-line shadow-card overflow-hidden">
        {/* Left Visual Column */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-soft/80 via-surface to-bg p-8 sm:p-10 flex-col justify-between border-r border-line">
          <div className="space-y-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center shadow-xs transition duration-200 group-hover:scale-105 group-hover:bg-brand-hover">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-ink font-heading">
                Charity<span className="text-brand">Hub</span>
              </span>
            </Link>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold font-heading text-ink leading-tight">
                Welcome back to community impact
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Log in to follow campaign milestones, view your instant donation receipts, and engage with verified charity drives.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-muted">
                <ShieldCheck className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <span>100% verified non-profit organizations</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted">
                <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <span>Live milestone updates with photo verification</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted">
                <Sparkles className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <span>Secure payments with automated digital receipts</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-line/60">
            <p className="text-[11px] text-muted leading-relaxed italic">
              "Every single contribution brings dignity, relief, and hope to someone in need."
            </p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1.5">
            {/* Mobile Brand Logo */}
            <div className="lg:hidden mb-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-lg group"
              >
                <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center shadow-xs">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="text-lg font-extrabold text-ink font-heading">
                  Charity<span className="text-brand">Hub</span>
                </span>
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-heading tracking-tight">
              Sign In
            </h1>
            <p className="text-xs sm:text-sm text-muted">
              Enter your credentials to access your dashboard and saved receipts.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-medium flex items-center gap-2.5 animate-pop-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold text-ink mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line text-xs bg-bg text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold text-ink"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-line text-xs bg-bg text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition cursor-pointer p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-muted pt-2 border-t border-line">
            <span>Don't have an account yet? </span>
            <Link
              to="/register"
              className="font-bold text-brand hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
