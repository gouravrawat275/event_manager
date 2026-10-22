import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import EventCard from "../../components/events/EventCard";
import EventFilters from "../../components/events/EventFilters";
import { EventCardSkeleton } from "../../components/common/Skeleton";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import { eventApi } from "../../api/eventApi";
import { categoryApi } from "../../api/categoryApi";
import { useDebounce } from "../../hooks/useDebounce";

const EventListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    dateFrom: searchParams.get("dateFrom") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "-date",
  });
  const [view, setView] = useState("grid");
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(filters.search, 400);

  useEffect(() => {
    categoryApi.getAll().then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, search: debouncedSearch, page, limit: 12 };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const { data } = await eventApi.getEvents(params);
      setEvents(data.events);
      setTotalPages(data.totalPages);
      setSearchParams(params);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

  }, [filters, debouncedSearch, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Events</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Discover experiences that match your interests</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <EventFilters filters={filters} onChange={handleFilterChange} categories={categories} view={view} onViewChange={setView} />
        </aside>

        <div>
          {loading ? (
            <div className={`grid gap-6 ${view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
            </div>
          ) : events.length === 0 ? (
            <EmptyState icon={SearchX} title="No events found" description="Try adjusting your filters or search terms." />
          ) : (
            <>
              <motion.div layout className={`grid gap-6 ${view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {events.map((event) => <EventCard key={event._id} event={event} view={view} />)}
              </motion.div>
              <div className="mt-10">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventListing;
