import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import EventCard from "../../components/events/EventCard";
import EmptyState from "../../components/common/EmptyState";
import { EventCardSkeleton } from "../../components/common/Skeleton";
import { userApi } from "../../api/userApi";

const SavedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getSavedEvents().then(({ data }) => setEvents(data.events)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)}
      </div>
    );
  }

  if (events.length === 0) {
    return <EmptyState icon={Heart} title="No saved events" description="Tap the heart icon on any event to save it here." />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {events.map((event) => <EventCard key={event._id} event={event} />)}
    </div>
  );
};

export default SavedEvents;
