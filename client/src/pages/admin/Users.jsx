import { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Shield, Ban, CheckCircle, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { adminService } from '../../services/adminService';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [actionMsg, setActionMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers({ role: roleFilter, search });
      if (res?.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not load user accounts. Refresh to try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await adminService.toggleUserStatus(id);
      if (res?.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isActive: res.user.isActive } : u))
        );
        setActionMsg(res.user.isActive ? 'User account activated' : 'User account deactivated');
        setTimeout(() => setActionMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Status update failed. Please retry.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-[var(--color-bg)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] tracking-tight">
              Manage user accounts
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Oversee platform users, roles, and account security.
            </p>
          </div>
        </div>

        {actionMsg && (
          <div className="p-3 bg-[var(--color-soft)] text-[var(--color-brand)] border border-[var(--color-brand)]/20 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {actionMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Filters and search bar */}
        <div className="bg-[var(--color-surface)] rounded-card border border-[var(--color-line)] p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-[var(--color-line)] bg-transparent text-[var(--color-ink)] text-xs focus:outline-none focus:border-[var(--color-brand)] placeholder:text-[var(--color-muted)]"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['All', 'donor', 'charity', 'volunteer', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                aria-pressed={roleFilter === r}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                  roleFilter === r
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'bg-[var(--color-soft)]/50 text-[var(--color-ink)] hover:bg-[var(--color-soft)]'
                }`}
              >
                {r === 'All' ? 'All roles' : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[var(--color-surface)] rounded-card border border-[var(--color-line)] shadow-xs overflow-hidden">
          {loading ? (
            <Loader message="Loading users..." />
          ) : users.length === 0 ? (
            <EmptyState
              icon={UsersIcon}
              title="No users found"
              description="No user records matched your search criteria."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--color-soft)]/30 text-xs font-semibold text-[var(--color-muted)] border-b border-[var(--color-line)]">
                    <th className="py-3 px-6">User</th>
                    <th className="py-3 px-6">Role</th>
                    <th className="py-3 px-6">Phone</th>
                    <th className="py-3 px-6">Joined</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-line)]">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-[var(--color-soft)]/10 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-heading font-bold text-[var(--color-ink)] text-sm">{u.name}</p>
                            <p className="text-xs text-[var(--color-muted)]">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-soft)] text-[var(--color-brand)] capitalize">
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-xs text-[var(--color-muted)]">
                        {u.phone || '—'}
                      </td>

                      <td className="py-4 px-6 text-xs text-[var(--color-muted)]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            u.isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleStatus(u._id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                              u.isActive
                                ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300'
                                : 'bg-[var(--color-soft)] text-[var(--color-brand)] hover:opacity-90'
                            }`}
                          >
                            {u.isActive ? 'Deactivate account' : 'Activate account'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Users;
