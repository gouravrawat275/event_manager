import { NavLink, Outlet } from "react-router-dom";
import { User, Ticket, Heart, Bell, Lock } from "lucide-react";

const tabs = [
  { to: "/profile", label: "Edit Profile", icon: User, end: true },
  { to: "/profile/bookings", label: "My Bookings", icon: Ticket },
  { to: "/profile/saved", label: "Saved Events", icon: Heart },
  { to: "/profile/notifications", label: "Notifications", icon: Bell },
  { to: "/profile/security", label: "Change Password", icon: Lock },
];

const ProfileLayout = () => (
  <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">My Account</h1>
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <Icon className="h-4 w-4" /> {label}
          </NavLink>
        ))}
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  </div>
);

export default ProfileLayout;
