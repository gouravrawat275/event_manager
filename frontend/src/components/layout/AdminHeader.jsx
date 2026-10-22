import { Menu, Sun, Moon, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const AdminHeader = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 dark:border-gray-800 glass px-4 sm:px-6">
      <button onClick={onMenuClick} className="text-gray-500 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <h2 className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back, <span className="font-medium text-gray-900 dark:text-white">{user?.name}</span>
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <button onClick={handleLogout} className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
