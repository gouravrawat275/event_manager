import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, Clock, Users, Heart, Facebook, Twitter, Linkedin, Link as LinkIcon,
  ArrowLeft, Timer,
} from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Spinner from "../../components/common/Spinner";
import EventCard from "../../components/events/EventCard";
import { eventApi } from "../../api/eventApi";
import { userApi } from "../../api/userApi";
import { bookingApi } from "../../api/bookingApi";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency, formatDateLong } from "../../utils/formatters";

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return setTimeLeft(null);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return timeLeft;
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [attendee, setAttendee] = useState({ name: "", email: "", phone: "" });

  const countdown = useCountdown(event?.date);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await eventApi.getById(id);
        setEvent(data.event);
        setSaved(!!user?.savedEvents?.includes(data.event._id));
        const { data: relatedData } = await eventApi.getRelated(data.event._id);
        setRelated(relatedData.events);
        if (isAuthenticated) userApi.addRecentlyViewed(data.event._id).catch(() => {});
      } catch {
        toast.error("Event not found.");
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };
    load();

  }, [id]);

  useEffect(() => {
    if (user) setAttendee({ name: user.name, email: user.email, phone: user.phone || "" });
  }, [user]);

  const openConfirm = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to book this event.");
      return navigate("/login", { state: { from: { pathname: `/events/${id}` } } });
    }
    setConfirmOpen(true);
  };

  const handleBook = async () => {
    setBooking(true);
    try {
      const { data } = await bookingApi.create({
        eventId: event._id,
        ticketCount,
        attendeeName: attendee.name,
        attendeeEmail: attendee.email,
        attendeePhone: attendee.phone,
      });
      toast.success("Booking confirmed! Check your ticket details.");
      setConfirmOpen(false);
      navigate(`/booking-success/${data.booking._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return toast.info("Please login to save events.");
    const { data } = await userApi.toggleSavedEvent(event._id);
    setSaved(data.saved);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${event.title} on Event Hub!`;
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } else {
      window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
    }
  };

  if (loading) return <Spinner full />;
  if (!event) return null;

  const remaining = event.remainingSeats ?? Math.max(event.seats - event.bookedSeats, 0);
  const mapQuery = encodeURIComponent(`${event.venue}, ${event.city}`);
  const fallbackImg = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl">
            <img src={event.images?.[activeImg]?.url || fallbackImg} alt={event.title} className="h-72 w-full object-cover sm:h-96" />
          </div>
          {event.images?.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {event.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${activeImg === i ? "border-indigo-600" : "border-transparent"}`}>
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {event.category?.name}
            </span>
            {countdown && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400">
                <Timer className="h-3.5 w-3.5" /> {countdown.days}d {countdown.hours}h {countdown.minutes}m left
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{event.title}</h1>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="card flex items-center gap-3 p-4">
              <Calendar className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDateLong(event.date)}</p>
              </div>
            </div>
            <div className="card flex items-center gap-3 p-4">
              <Clock className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{event.time}</p>
              </div>
            </div>
            <div className="card flex items-center gap-3 p-4">
              <Users className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500">Seats Left</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{remaining} of {event.seats}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">About this event</h2>
            <p className="whitespace-pre-line leading-relaxed text-gray-600 dark:text-gray-300">{event.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Venue</h2>
            <p className="mb-3 flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4 text-indigo-500" /> {event.venue}, {event.address ? `${event.address}, ` : ""}{event.city}
            </p>
            <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
              <iframe title="Event location" width="100%" height="320" loading="lazy" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Organizer</h2>
            <div className="card flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-semibold text-white">
                {event.organizer?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{event.organizer?.name}</p>
                {event.organizer?.email && <p className="text-sm text-gray-500">{event.organizer.email}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {event.price > 0 ? formatCurrency(event.price) : "Free"}
              </span>
              <button onClick={handleSave} className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800">
                <Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              </button>
            </div>

            {remaining > 0 ? (
              <>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Tickets</label>
                <div className="mb-5 flex items-center gap-3">
                  <button onClick={() => setTicketCount((c) => Math.max(1, c - 1))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 font-semibold">−</button>
                  <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">{ticketCount}</span>
                  <button onClick={() => setTicketCount((c) => Math.min(remaining, 10, c + 1))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 font-semibold">+</button>
                  <span className="ml-auto text-sm text-gray-500">Total: {formatCurrency(event.price * ticketCount)}</span>
                </div>
                <Button onClick={openConfirm} className="w-full">Register Now</Button>
              </>
            ) : (
              <Button disabled className="w-full">Sold Out</Button>
            )}

            <div className="mt-5 flex items-center justify-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-5">
              <span className="text-xs text-gray-500">Share:</span>
              <button onClick={() => handleShare("facebook")} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-indigo-600"><Facebook className="h-3.5 w-3.5" /></button>
              <button onClick={() => handleShare("twitter")} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-indigo-600"><Twitter className="h-3.5 w-3.5" /></button>
              <button onClick={() => handleShare("linkedin")} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-indigo-600"><Linkedin className="h-3.5 w-3.5" /></button>
              <button onClick={() => handleShare("copy")} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-indigo-600"><LinkIcon className="h-3.5 w-3.5" /></button>
            </div>
          </motion.div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Related Events</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((e) => <EventCard key={e._id} event={e} />)}
          </div>
        </div>
      )}

      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Your Booking">
        <div className="space-y-4">
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4">
            <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
            <p className="mt-1 text-sm text-gray-500">{formatDateLong(event.date)} • {event.time}</p>
            <div className="mt-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3 text-sm">
              <span className="text-gray-500">{ticketCount} ticket(s)</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(event.price * ticketCount)}</span>
            </div>
          </div>
          <Input label="Attendee Name" value={attendee.name} onChange={(e) => setAttendee({ ...attendee, name: e.target.value })} />
          <Input label="Email" value={attendee.email} onChange={(e) => setAttendee({ ...attendee, email: e.target.value })} />
          <Input label="Phone" value={attendee.phone} onChange={(e) => setAttendee({ ...attendee, phone: e.target.value })} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button loading={booking} onClick={handleBook}>Confirm & Book</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventDetails;
