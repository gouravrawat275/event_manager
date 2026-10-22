import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Heart } from "lucide-react";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";
import { userApi } from "../../api/userApi";
import { toast } from "react-toastify";
import { useState } from "react";

const EventCard = ({ event, view = "grid" }) => {
  const { isAuthenticated, user } = useAuth();
  const [saved, setSaved] = useState(user?.savedEvents?.includes(event._id));
  const remaining = event.remainingSeats ?? Math.max(event.seats - event.bookedSeats, 0);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.info("Please login to save events.");
    try {
      const { data } = await userApi.toggleSavedEvent(event._id);
      setSaved(data.saved);
      toast.success(data.saved ? "Added to saved events" : "Removed from saved events");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const fallbackImg = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600";

  if (view === "list") {
    return (
      <motion.div whileHover={{ y: -2 }} className="card flex flex-col sm:flex-row overflow-hidden">
        <Link to={`/events/${event.slug}`} className="relative h-48 w-full shrink-0 sm:h-auto sm:w-64">
          <img src={event.images?.[0]?.url || fallbackImg} alt={event.title} className="h-full w-full object-cover" />
        </Link>
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {event.category?.name}
              </span>
              <button onClick={handleSave}>
                <Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              </button>
            </div>
            <Link to={`/events/${event.slug}`}>
              <h3 className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 line-clamp-1">{event.title}</h3>
            </Link>
            <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
              <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(event.date)}</p>
              <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {event.venue}, {event.city}</p>
              <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {remaining} seats left</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {event.price > 0 ? formatCurrency(event.price) : "Free"}
            </span>
            <Link to={`/events/${event.slug}`} className="btn-primary !px-4 !py-2 text-sm">View Details</Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ y: -4 }} className="card group overflow-hidden">
      <Link to={`/events/${event.slug}`} className="relative block h-48 overflow-hidden">
        <img src={event.images?.[0]?.url || fallbackImg} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <button onClick={handleSave} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
          <Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
        </button>
        {remaining <= 10 && remaining > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white">Only {remaining} left</span>
        )}
        {remaining === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">Sold Out</span>
        )}
      </Link>
      <div className="p-5">
        <span className="rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
          {event.category?.name}
        </span>
        <Link to={`/events/${event.slug}`}>
          <h3 className="mt-2.5 font-semibold text-gray-900 dark:text-white hover:text-indigo-600 line-clamp-1">{event.title}</h3>
        </Link>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-3.5 w-3.5 shrink-0" /> {formatDate(event.date)}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> {event.city}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {event.price > 0 ? formatCurrency(event.price) : "Free"}
          </span>
          <Link to={`/events/${event.slug}`} className="btn-primary !px-4 !py-2 text-sm">Book Now</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
