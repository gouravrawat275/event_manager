import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Sarah Chen", role: "Frequent Attendee", quote: "Event Hub made finding and booking concerts effortless. The QR ticket system is a lifesaver.", rating: 5 },
  { name: "Marcus Reid", role: "Conference Organizer", quote: "Managing registrations for our tech summit was seamless. The admin dashboard gives me everything at a glance.", rating: 5 },
  { name: "Priya Nair", role: "Community Manager", quote: "The booking flow is smooth and the design feels premium. Our attendees love it.", rating: 5 },
];

const Testimonials = () => (
  <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Loved by Event Goers</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Here's what our community has to say</p>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t, i) => (
        <motion.div key={t.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
          <Quote className="mb-3 h-6 w-6 text-indigo-300" />
          <p className="text-sm text-gray-600 dark:text-gray-300">{t.quote}</p>
          <div className="mt-4 flex items-center gap-1">
            {Array.from({ length: t.rating }).map((_, idx) => (
              <Star key={idx} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white">
              {t.name[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Testimonials;
