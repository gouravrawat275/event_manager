import { useEffect, useState } from "react";
import { Search, Ban, CheckCircle, Trash2, Users as UsersIcon, Eye } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import { TableRowSkeleton } from "../../components/common/Skeleton";
import { userApi } from "../../api/userApi";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { STATUS_COLORS } from "../../utils/constants";
import { useDebounce } from "../../hooks/useDebounce";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [historyUser, setHistoryUser] = useState(null);
  const [history, setHistory] = useState([]);
  const debouncedSearch = useDebounce(search, 400);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await userApi.getUsers({ search: debouncedSearch, page, limit: 10 });
    setUsers(data.users);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [debouncedSearch, page]);

  const handleToggleBlock = async (user) => {
    try {
      await userApi.toggleBlock(user._id);
      toast.success(user.isBlocked ? "User unblocked." : "User blocked.");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed.");
    }
  };

  const handleDelete = async () => {
    try {
      await userApi.remove(deleteTarget._id);
      toast.success("User deleted.");
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete user.");
    }
  };

  const viewHistory = async (user) => {
    setHistoryUser(user);
    const { data } = await userApi.getUserBookings(user._id);
    setHistory(data.bookings);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View and manage registered users</p>
      </div>

      <div className="card">
        <div className="border-b border-gray-100 dark:border-gray-800 p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." className="input-field pl-9" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs font-medium uppercase text-gray-500">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="p-0"><EmptyState icon={UsersIcon} title="No users found" /></td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar?.url ? (
                          <img src={user.avatar.url} alt="" className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white">{user.name[0]}</div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge className={user.isBlocked ? STATUS_COLORS.cancelled : STATUS_COLORS.published}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => viewHistory(user)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600" title="View bookings"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleToggleBlock(user)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-amber-600" title={user.isBlocked ? "Unblock" : "Block"}>
                          {user.isBlocked ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                        </button>
                        <button onClick={() => setDeleteTarget(user)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 p-4">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User">
        <p className="text-sm text-gray-600 dark:text-gray-300">Are you sure you want to delete "<strong>{deleteTarget?.name}</strong>"? This cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>

      <Modal isOpen={!!historyUser} onClose={() => setHistoryUser(null)} title={`Booking History — ${historyUser?.name}`} size="lg">
        {history.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No bookings found" />
        ) : (
          <div className="space-y-3">
            {history.map((b) => (
              <div key={b._id} className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{b.eventId?.title}</p>
                  <p className="text-xs text-gray-500">{formatDate(b.createdAt)} • {b.ticketCount} ticket(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(b.totalAmount)}</p>
                  <Badge className={STATUS_COLORS[b.bookingStatus]}>{b.bookingStatus}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageUsers;
