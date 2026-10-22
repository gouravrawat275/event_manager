import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Calendar, Users, Ticket, DollarSign, TrendingUp } from "lucide-react";
import { StatCardSkeleton } from "../../components/common/Skeleton";
import { dashboardApi } from "../../api/dashboardApi";
import { formatCurrency } from "../../utils/formatters";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

const StatCard = ({ icon: Icon, label, value, gradient, delay }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="card p-6">
    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
      <Icon className="h-5 w-5" />
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [categoryDist, setCategoryDist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, m, c] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getMonthlyBookings(),
          dashboardApi.getCategoryDistribution(),
        ]);
        setStats(s.data.stats);
        setMonthly(m.data.data);
        setCategoryDist(c.data.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Overview of your platform's performance</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon={Calendar} label="Total Events" value={stats.totalEvents} gradient="from-indigo-500 to-indigo-600" delay={0} />
            <StatCard icon={TrendingUp} label="Active Events" value={stats.activeEvents} gradient="from-violet-500 to-violet-600" delay={0.05} />
            <StatCard icon={Users} label="Total Users" value={stats.totalUsers} gradient="from-fuchsia-500 to-fuchsia-600" delay={0.1} />
            <StatCard icon={Ticket} label="Total Bookings" value={stats.totalBookings} gradient="from-amber-500 to-amber-600" delay={0.15} />
            <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(stats.revenue)} gradient="from-emerald-500 to-emerald-600" delay={0.2} />
          </>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="mb-5 font-semibold text-gray-900 dark:text-white">Monthly Bookings & Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }} />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#6366f1" strokeWidth={2.5} dot={false} name="Bookings" />
              <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2.5} dot={false} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="mb-5 font-semibold text-gray-900 dark:text-white">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryDist} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 card p-6">
        <h3 className="mb-5 font-semibold text-gray-900 dark:text-white">Bookings by Month</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }} />
            <Bar dataKey="bookings" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
