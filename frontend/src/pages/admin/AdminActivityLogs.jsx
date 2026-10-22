import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import EmptyState from "../../components/common/EmptyState";
import { Skeleton } from "../../components/common/Skeleton";
import { dashboardApi } from "../../api/dashboardApi";
import { timeAgo } from "../../utils/formatters";

const AdminActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getActivityLogs().then(({ data }) => setLogs(data.logs)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Logs</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Recent admin actions across the platform</p>
      </div>

      <div className="card p-6">
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : logs.length === 0 ? (
          <EmptyState icon={Activity} title="No activity yet" />
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <div key={log._id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 py-3 last:border-0">
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">{log.action}</p>
                  <p className="text-xs text-gray-500">{log.admin?.name} • {log.details}</p>
                </div>
                <span className="text-xs text-gray-400">{timeAgo(log.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActivityLogs;
