import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import { TableRowSkeleton } from "../../components/common/Skeleton";
import { eventApi } from "../../api/eventApi";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { STATUS_COLORS } from "../../utils/constants";
import { useDebounce } from "../../hooks/useDebounce";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await eventApi.getEvents({ search: debouncedSearch, status: "", page, limit: 10, sort: "-createdAt" });
      setEvents(data.events);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [debouncedSearch, page]);

  const toggleStatus = async (event) => {
    const newStatus = event.status === "published" ? "draft" : "published";
    try {
      await eventApi.updateStatus(event._id, newStatus);
      toast.success(`Event ${newStatus === "published" ? "published" : "unpublished"}.`);
      fetchEvents();
    } catch {
      toast.error("Could not update status.");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await eventApi.remove(deleteTarget._id);
      toast.success("Event deleted.");
      setDeleteTarget(null);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete event.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Events</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create, edit, and publish events</p>
        </div>
        <Link to="/admin/events/new"><Button icon={Plus}>Create Event</Button></Link>
      </div>

      <div className="card">
        <div className="border-b border-gray-100 dark:border-gray-800 p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search events..." className="input-field pl-9" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs font-medium uppercase text-gray-500">
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Seats</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
              ) : events.length === 0 ? (
                <tr><td colSpan={6} className="p-0"><EmptyState icon={Calendar} title="No events found" /></td></tr>
              ) : (
                events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={event.images?.[0]?.url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100"} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{event.title}</p>
                          <p className="text-xs text-gray-500">{event.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDate(event.date)}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{event.bookedSeats}/{event.seats}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{event.price > 0 ? formatCurrency(event.price) : "Free"}</td>
                    <td className="px-4 py-3"><Badge className={STATUS_COLORS[event.status]}>{event.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => toggleStatus(event)} title={event.status === "published" ? "Unpublish" : "Publish"} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600">
                          {event.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <Link to={`/admin/events/${event._id}/edit`} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => setDeleteTarget(event)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
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

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Event">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to delete "<strong>{deleteTarget?.title}</strong>"? This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageEvents;
