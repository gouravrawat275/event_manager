import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { toast } from "react-toastify";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thanks for subscribing! Check your inbox for confirmation.");
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-14 text-center sm:px-16">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <Mail className="mx-auto mb-4 h-10 w-10 text-white" />
        <h2 className="text-2xl font-bold text-white sm:text-3xl">Never Miss an Event</h2>
        <p className="mx-auto mt-2 max-w-md text-indigo-100">
          Subscribe to get personalized event recommendations delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 rounded-xl border-0 px-4 py-3 text-sm outline-none ring-4 ring-transparent focus:ring-white/30"
          />
          <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition-transform hover:scale-105">
            Subscribe <Send className="h-4 w-4" />
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default Newsletter;
