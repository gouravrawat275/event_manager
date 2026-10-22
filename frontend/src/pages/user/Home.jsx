import { useEffect, useState } from "react";
import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";
import EventSection from "../../components/home/EventSection";
import Statistics from "../../components/home/Statistics";
import Testimonials from "../../components/home/Testimonials";
import Newsletter from "../../components/home/Newsletter";
import { eventApi } from "../../api/eventApi";
import { categoryApi } from "../../api/categoryApi";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popular, setPopular] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [f, u, p, c] = await Promise.all([
          eventApi.getFeatured(),
          eventApi.getUpcoming(),
          eventApi.getPopular(),
          categoryApi.getAll(),
        ]);
        setFeatured(f.data.events);
        setUpcoming(u.data.events);
        setPopular(p.data.events);
        setCategories(c.data.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <Hero />
      <Categories categories={categories} />
      <EventSection title="Featured Events" subtitle="Hand-picked experiences you shouldn't miss" events={featured} loading={loading} viewAllLink="/events" />
      <EventSection title="Upcoming Events" subtitle="Don't miss what's coming next" events={upcoming} loading={loading} viewAllLink="/events" />
      <Statistics />
      <EventSection title="Popular Right Now" subtitle="Trending among our community" events={popular} loading={loading} viewAllLink="/events" />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;
