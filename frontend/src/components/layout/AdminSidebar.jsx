import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, CalendarDays, Tag, Users, Ticket, Bell, Settings, Calendar, X, Activity } from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Manage Events", icon: CalendarDays },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/users", label: "Manage Users", icon: Users },
  { to: "/admin/bookings", label: "Manage Bookings", icon: Ticket },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/activity-logs", label: "Activity Logs", icon: Activity },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2 font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <Calendar className="h-5 w-5" />
          </div>
          <span>Event Hub</span>
        </div>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-400">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white">
          <p className="text-sm font-semibold">Need help?</p>
          <p className="mt-1 text-xs text-indigo-100">Check our admin docs for guidance.</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-gray-900/60" onClick={() => setMobileOpen(false)} />
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="relative h-full w-64 bg-white dark:bg-gray-900">
            {content}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
