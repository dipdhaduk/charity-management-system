import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Heart,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Moon,
  Sun,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/adminService';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userDropdownRef = useRef(null);

  // Direct clean navigation links (No dropdowns)
  const navLinks = [
    { label: 'Who We Are', to: '/about' },
    { label: 'What We Do', to: '/our-work' },
    { label: 'Our Story', to: '/about#story' },
    { label: 'Campaigns', to: '/campaigns' },
    { label: 'Contact', to: '/contact' },
  ];

  // Theme Management
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme
      ? savedTheme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Close menus on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname, location.search, location.hash]);

  // Click outside and escape key handling
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Notifications sync
  useEffect(() => {
    if (!isAuthenticated) return undefined;

    let isMounted = true;
    const fetchUnread = () => {
      notificationService
        .getNotifications()
        .then((res) => {
          if (isMounted) setUnreadCount(res?.unreadCount || 0);
        })
        .catch(() => {});
    };

    fetchUnread();
    window.addEventListener('charityhub:notifications-read', fetchUnread);
    return () => {
      isMounted = false;
      window.removeEventListener('charityhub:notifications-read', fetchUnread);
    };
  }, [isAuthenticated, location.pathname]);

  const dashboardPath =
    {
      charity: '/dashboard/charity',
      volunteer: '/dashboard/volunteer',
      admin: '/dashboard/admin',
    }[user?.role] || '/dashboard/donor';

  const handleLogout = useCallback(() => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  }, [logout, navigate]);

  const isLinkActive = (to) => {
    if (to.includes('#')) {
      const [path, hash] = to.split('#');
      return location.pathname === path && location.hash === `#${hash}`;
    }
    if (to === '/about') {
      return location.pathname === '/about' && (!location.hash || location.hash !== '#story');
    }
    if (to === '/campaigns') {
      return location.pathname.startsWith('/campaigns');
    }
    return location.pathname === to;
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-line shadow-2xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0 group py-1"
            aria-label="CharityHub Homepage"
          >
            <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center shadow-xs transition duration-200 group-hover:scale-105 group-hover:bg-brand-hover">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-ink font-heading">
              Charity<span className="text-brand">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation Links (Direct, Simple, No Dropdowns) */}
          <nav
            className="hidden lg:flex items-center gap-1.5 text-sm font-medium"
            aria-label="Main navigation"
          >
            {navLinks.map(({ label, to }) => {
              const active = isLinkActive(to);
              return (
                <Link
                  key={label}
                  to={to}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    active
                      ? 'bg-soft text-brand font-semibold shadow-2xs'
                      : 'text-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="p-2 rounded-lg text-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-accent" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className={`relative p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    location.pathname === '/notifications'
                      ? 'bg-soft text-brand'
                      : 'text-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                  }`}
                  aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-accent text-slate-950 rounded-full text-[10px] font-extrabold flex items-center justify-center leading-none">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Dashboard Pill Button */}
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-soft border border-line rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-brand" />
                  <span>Dashboard</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-line transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
                    aria-expanded={userDropdownOpen}
                    aria-haspopup="true"
                    aria-label="User account menu"
                  >
                    <img
                      src={
                        user?.avatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                      }
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-line/60"
                    />
                    <span className="text-xs font-semibold text-ink max-w-[100px] truncate">
                      {user?.name || 'Account'}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${
                        userDropdownOpen ? 'rotate-180 text-brand' : ''
                      }`}
                    />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl shadow-soft border border-line p-1.5 z-50 animate-pop-in"
                      role="menu"
                    >
                      <div className="px-3 py-2.5 border-b border-line mb-1">
                        <p className="text-[11px] text-muted">Signed in as</p>
                        <p className="text-xs font-bold text-ink truncate mt-0.5">
                          {user?.name}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] capitalize font-bold bg-soft text-brand rounded-full">
                          {user?.role} account
                        </span>
                      </div>

                      <Link
                        to={dashboardPath}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink hover:bg-soft rounded-xl transition"
                        role="menuitem"
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand shrink-0" />
                        <span>My dashboard</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink hover:bg-soft rounded-xl transition"
                        role="menuitem"
                      >
                        <User className="w-4 h-4 text-muted shrink-0" />
                        <span>Account settings</span>
                      </Link>

                      <div className="border-t border-line my-1 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition cursor-pointer"
                          role="menuitem"
                        >
                          <LogOut className="w-4 h-4 shrink-0" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 text-xs font-semibold text-ink bg-soft hover:bg-brand hover:text-white rounded-full transition-colors border border-brand/20 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">

            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="p-2 text-muted hover:text-ink rounded-lg transition cursor-pointer"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-accent" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 text-ink rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-line bg-surface/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 shadow-lg animate-pop-in">
          <nav className="space-y-1" aria-label="Mobile navigation">
            {navLinks.map(({ label, to }) => {
              const active = isLinkActive(to);
              return (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    active
                      ? 'bg-soft text-brand'
                      : 'text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Controls for Mobile */}
          {isAuthenticated ? (
            <div className="pt-3 border-t border-line space-y-3">
              <div className="p-3 bg-bg rounded-2xl border border-line flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={
                      user?.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                    }
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-line"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink truncate">{user?.name}</p>
                    <span className="inline-block px-1.5 py-0.2 text-[10px] capitalize font-bold text-brand bg-soft rounded-full">
                      {user?.role} account
                    </span>
                  </div>
                </div>

                <Link
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative p-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-accent text-slate-950 rounded-full text-[9px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Link
                  to={dashboardPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 bg-brand text-white rounded-xl font-bold text-center block text-xs shadow-xs hover:bg-brand-hover transition"
                >
                  Go to dashboard
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 px-4 text-center text-ink border border-line bg-surface rounded-xl font-semibold text-xs block hover:bg-soft transition"
                >
                  Account settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 px-4 text-rose-600 font-semibold text-center text-xs block hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-line">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-ink border border-line rounded-xl font-semibold text-xs block hover:bg-soft transition"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
