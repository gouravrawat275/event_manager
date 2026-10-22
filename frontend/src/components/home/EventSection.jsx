import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import EventCard from "../events/EventCard";
import { EventCardSkeleton } from "../common/Skeleton";
import EmptyState from "../common/EmptyState";

const EventSection = ({ title, subtitle, events, loading, viewAllLink }) => (
  <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="mb-10 flex items-end justify-between">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="mt-2 text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      {viewAllLink && (
        <Link to={viewAllLink} className="hidden items-center gap-1.5 text-sm font-medium text-indigo-600 hover:gap-2.5 transition-all sm:flex">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>

    {loading ? (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)}
      </div>
    ) : events.length === 0 ? (
      <EmptyState icon={Calendar} title="No events yet" description="Check back soon for new events." />
    ) : (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {events.map((event) => (
          <motion.div key={event._id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <EventCard event={event} />
          </motion.div>
        ))}
      </motion.div>
    )}
  </section>
);

export default EventSection;
