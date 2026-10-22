import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import { toast } from "react-toastify";
import TicketCard from "../../components/booking/TicketCard";
import EmptyState from "../../components/common/EmptyState";
import { Skeleton } from "../../components/common/Skeleton";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import { bookingApi } from "../../api/bookingApi";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await bookingApi.getMy({ page, limit: 6 });
      setBookings(data.bookings);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [page]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await bookingApi.cancel(cancelTarget._id, {});
      toast.success("Booking cancelled.");
      setCancelTarget(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel booking.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
      </div>
    );
  }

  if (bookings.length === 0) {
    return <EmptyState icon={Ticket} title="No bookings yet" description="Explore events and book your first ticket!" />;
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        {bookings.map((b) => <TicketCard key={b._id} booking={b} onCancel={setCancelTarget} />)}
      </div>
      <div className="mt-8">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel Booking">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setCancelTarget(null)}>Keep Booking</Button>
          <Button variant="danger" loading={cancelling} onClick={handleCancel}>Yes, Cancel</Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookings;
