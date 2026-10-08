import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  PlusCircle,
  FolderKanban,
  Users,
  HandHeart,
  FileText,
  Bell,
  User,
  ShieldCheck,
  Megaphone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'donor';

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
      isActive
        ? 'bg-brand text-white shadow-xs'
        : 'text-muted hover:text-ink hover:bg-soft/40'
    }`;

  return (
    <aside className="w-full lg:w-64 bg-surface border-r border-line p-4 min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div className="space-y-6">
        {/* User preview */}
        <div className="p-3 bg-bg rounded-2xl border border-line flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt=""
            className="w-10 h-10 rounded-full object-cover border border-line"
          />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-ink truncate">{user?.name}</h4>
            <span className="inline-block px-2 py-0.5 text-[10px] capitalize font-semibold bg-soft text-brand rounded-full">
              {role} account
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {/* DONOR LINKS */}
          {role === 'donor' && (
            <>
              <NavLink to="/dashboard/donor" end className={linkClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </NavLink>
              <NavLink to="/campaigns" className={linkClass}>
                <Heart className="w-4 h-4" />
                <span>Explore causes</span>
              </NavLink>
              <NavLink to="/dashboard/volunteer" className={linkClass}>
                <HandHeart className="w-4 h-4" />
                <span>Volunteer drives</span>
              </NavLink>
              <NavLink to="/notifications" className={linkClass}>
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                <User className="w-4 h-4" />
                <span>My profile</span>
              </NavLink>
            </>
          )}

          {/* CHARITY LINKS */}
          {role === 'charity' && (
            <>
              <NavLink to="/dashboard/charity" end className={linkClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/charity/create-campaign" className={linkClass}>
                <PlusCircle className="w-4 h-4" />
                <span>Start campaign</span>
              </NavLink>
              <NavLink to="/charity/manage-campaigns" className={linkClass}>
                <FolderKanban className="w-4 h-4" />
                <span>Manage campaigns</span>
              </NavLink>
              <NavLink to="/charity/volunteers" className={linkClass}>
                <Users className="w-4 h-4" />
                <span>Volunteer requests</span>
              </NavLink>
              <NavLink to="/charity/updates" className={linkClass}>
                <Megaphone className="w-4 h-4" />
                <span>Post milestone</span>
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                <User className="w-4 h-4" />
                <span>Charity profile</span>
              </NavLink>
            </>
          )}

          {/* VOLUNTEER LINKS */}
          {role === 'volunteer' && (
            <>
              <NavLink to="/dashboard/volunteer" end className={linkClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Volunteer hub</span>
              </NavLink>
              <NavLink to="/campaigns" className={linkClass}>
                <Heart className="w-4 h-4" />
                <span>Explore campaigns</span>
              </NavLink>
              <NavLink to="/notifications" className={linkClass}>
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                <User className="w-4 h-4" />
                <span>Profile</span>
              </NavLink>
            </>
          )}

          {/* ADMIN LINKS */}
          {role === 'admin' && (
            <>
              <NavLink to="/dashboard/admin" end className={linkClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin analytics</span>
              </NavLink>
              <NavLink to="/admin/charities" className={linkClass}>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify charities</span>
              </NavLink>
              <NavLink to="/admin/users" className={linkClass}>
                <Users className="w-4 h-4" />
                <span>Manage users</span>
              </NavLink>
              <NavLink to="/admin/campaigns" className={linkClass}>
                <FolderKanban className="w-4 h-4" />
                <span>All campaigns</span>
              </NavLink>
              <NavLink to="/admin/donations" className={linkClass}>
                <FileText className="w-4 h-4" />
                <span>Donation ledger</span>
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                <User className="w-4 h-4" />
                <span>Admin profile</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="pt-4 border-t border-line text-xs text-muted">
        <p className="font-semibold text-ink">CharityHub</p>
        <p>Organization workspace</p>
      </div>
    </aside>
  );
};

export default Sidebar;
