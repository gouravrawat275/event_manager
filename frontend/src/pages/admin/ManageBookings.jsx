import { useEffect, useState } from "react";
import { Search, Download, CheckCircle, XCircle, Ticket, Ban } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import { TableRowSkeleton } from "../../components/common/Skeleton";
import { bookingApi } from "../../api/bookingApi";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { STATUS_COLORS } from "../../utils/constants";
import { useDebounce } from "../../hooks/useDebounce";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await bookingApi.getAll({ search: debouncedSearch, status, page, limit: 10 });
    setBookings(data.bookings);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [debouncedSearch, status, page]);

  const handleStatusUpdate = async (booking, bookingStatus) => {
    try {
      await bookingApi.updateStatus(booking._id, bookingStatus);
      toast.success(`Booking ${bookingStatus}.`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed.");
    }
  };

  const handleCancel = async (booking) => {
    try {
      await bookingApi.cancel(booking._id, {});
      toast.success("Booking cancelled.");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel booking.");
    }
  };

  const handleExport = async () => {
    try {
      const response = await bookingApi.exportCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "bookings.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Could not export bookings.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Bookings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Review, approve, and track all bookings</p>
        </div>
        <Button variant="secondary" icon={Download} onClick={handleExport}>Export CSV</Button>
      </div>

      <div className="card">
        <div className="flex flex-col gap-3 border-b border-gray-100 dark:border-gray-800 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by ticket, name, email..." className="input-field pl-9" />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field sm:max-w-[180px]">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs font-medium uppercase text-gray-500">
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
              ) : bookings.length === 0 ? (
                <tr><td colSpan={6} className="p-0"><EmptyState icon={Ticket} title="No bookings found" /></td></tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300">{b.ticketId}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white line-clamp-1">{b.eventId?.title}</td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900 dark:text-white">{b.userId?.name}</p>
                      <p className="text-xs text-gray-500">{b.userId?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatCurrency(b.totalAmount)}</td>
                    <td className="px-4 py-3"><Badge className={STATUS_COLORS[b.bookingStatus]}>{b.bookingStatus}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.bookingStatus === "pending" && (
                          <>
                            <button onClick={() => handleStatusUpdate(b, "approved")} className="rounded-lg p-2 text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600" title="Approve"><CheckCircle className="h-4 w-4" /></button>
                            <button onClick={() => handleStatusUpdate(b, "rejected")} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600" title="Reject"><XCircle className="h-4 w-4" /></button>
                          </>
                        )}
                        {!["cancelled", "rejected", "completed"].includes(b.bookingStatus) && (
                          <button onClick={() => handleCancel(b)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600" title="Cancel"><Ban className="h-4 w-4" /></button>
                        )}
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
    </div>
  );
};

export default ManageBookings;
