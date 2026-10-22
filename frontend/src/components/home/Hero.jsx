import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Calendar, ArrowRight } from "lucide-react";

const Hero = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/events${search ? `?search=${encodeURIComponent(search)}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-24 -left-24 h-96 w-96 animate-float rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 animate-float rounded-full bg-fuchsia-300 blur-3xl" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-white"
          >
            <Calendar className="h-3.5 w-3.5" /> Over 10,000 events hosted
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Discover Events That
            <br /> Move You
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-lg text-indigo-100"
          >
            From concerts to conferences — find, book, and experience the best events happening near you.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-2xl glass p-2 sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-4 w-4 shrink-0 text-white/70" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, venues, cities..."
                className="w-full bg-transparent py-2.5 text-white placeholder:text-white/60 outline-none"
              />
            </div>
            <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-2.5 font-semibold text-indigo-600 transition-transform hover:scale-105">
              Search <ArrowRight className="h-4 w-4" />
            </button>
          </motion.form>
        </div>
      </div>

      <div className="relative h-16 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-950" />
    </section>
  );
};

export default Hero;
