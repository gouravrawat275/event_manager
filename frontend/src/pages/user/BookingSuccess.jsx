import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Home, Ticket } from "lucide-react";
import Spinner from "../../components/common/Spinner";
import TicketCard from "../../components/booking/TicketCard";
import { bookingApi } from "../../api/bookingApi";

const BookingSuccess = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.getById(id).then(({ data }) => setBooking(data.booking)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner full />;
  if (!booking) return null;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Confirmed!</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your ticket is ready. A confirmation has been sent to your email.
        </p>
      </motion.div>

      <TicketCard booking={booking} />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-secondary flex-1 justify-center"><Home className="h-4 w-4" /> Back Home</Link>
        <Link to="/profile/bookings" className="btn-primary flex-1 justify-center"><Ticket className="h-4 w-4" /> My Bookings</Link>
      </div>
    </div>
  );
};

export default BookingSuccess;
