import { useEffect, useState } from "react";
import { Bell, BellOff, Calendar, Ticket, Info } from "lucide-react";
import EmptyState from "../../components/common/EmptyState";
import { Skeleton } from "../../components/common/Skeleton";
import { notificationApi } from "../../api/notificationApi";
import { timeAgo } from "../../utils/formatters";

const typeIcons = { booking: Ticket, reminder: Calendar, system: Info, admin: Bell };

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const { data } = await notificationApi.getMy();
    setNotifications(data.notifications);
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkAll = async () => {
    await notificationApi.markAllRead();
    fetchNotifications();
  };

  const handleClick = async (n) => {
    if (!n.isRead) {
      await notificationApi.markRead(n._id);
      fetchNotifications();
    }
  };

  if (loading) {
    return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>;
  }

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        {notifications.some((n) => !n.isRead) && (
          <button onClick={handleMarkAll} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Mark all as read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={BellOff} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = typeIcons[n.type] || Info;
            return (
              <button
                key={n._id}
                onClick={() => handleClick(n)}
                className={`flex w-full items-start gap-3 rounded-xl p-4 text-left transition-colors ${
                  n.isRead ? "hover:bg-gray-50 dark:hover:bg-gray-800" : "bg-indigo-50 dark:bg-indigo-500/10"
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{n.message}</p>
                  <p className="mt-1 text-xs text-gray-400">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
