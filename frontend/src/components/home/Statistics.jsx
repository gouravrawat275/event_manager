import { motion } from "framer-motion";
import { Calendar, Users, Ticket, Star } from "lucide-react";

const stats = [
  { icon: Calendar, label: "Events Hosted", value: "10,000+" },
  { icon: Users, label: "Happy Attendees", value: "500K+" },
  { icon: Ticket, label: "Tickets Sold", value: "1.2M+" },
  { icon: Star, label: "Average Rating", value: "4.9/5" },
];

const Statistics = () => (
  <section className="bg-gray-900 dark:bg-gray-900/50">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
      {stats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
          <stat.icon className="mx-auto mb-3 h-7 w-7 text-indigo-400" />
          <p className="text-3xl font-extrabold text-white">{stat.value}</p>
          <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Statistics;
