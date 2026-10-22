import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

const Categories = ({ categories = [] }) => (
  <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Find events tailored to your interests</p>
    </div>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((cat, i) => {
        const Icon = Icons[cat.icon] || Icons.Calendar;
        return (
          <motion.div key={cat._id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Link to={`/events?category=${cat._id}`} className="card group flex flex-col items-center gap-3 p-6 text-center hover:border-indigo-300 dark:hover:border-indigo-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{cat.name}</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  </section>
);

export default Categories;
