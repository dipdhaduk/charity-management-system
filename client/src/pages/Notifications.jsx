import { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { notificationService } from '../services/adminService';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res?.notifications) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      window.dispatchEvent(new Event('charityhub:notifications-read'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      window.dispatchEvent(new Event('charityhub:notifications-read'));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <p className="text-xs font-semibold text-brand">Inbox</p>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight font-heading">
            Notifications
          </h1>
          <p className="mt-1 text-xs text-muted">
            Live updates regarding your donations, volunteer drives, and supported causes.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface border border-line hover:border-brand/40 rounded-full text-xs font-semibold text-ink shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <CheckCheck className="w-3.5 h-3.5 text-brand" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {loading ? (
        <Loader message="Loading your updates..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications right now"
          description="When you contribute or when an NGO posts a milestone for your cause, updates will appear here."
          actionLabel="Explore active campaigns"
          actionLink="/campaigns"
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <button
              type="button"
              key={n._id}
              onClick={() => !n.isRead && handleMarkAsRead(n._id)}
              aria-label={n.isRead ? `${n.title}, read` : `${n.title}, mark as read`}
              className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition flex items-start gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                n.isRead
                  ? 'bg-surface border-line text-ink'
                  : 'bg-soft/40 border-brand/30 shadow-xs text-ink'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  n.isRead ? 'bg-line/40 text-muted' : 'bg-soft text-brand'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold truncate">{n.title}</h4>
                  <span className="text-[11px] text-muted whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">{n.message}</p>
              </div>

              {!n.isRead && (
                <span className="w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-2" title="Unread" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
