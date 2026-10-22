import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, SearchX } from "lucide-react";

const NotFound = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SearchX className="mx-auto mb-6 h-20 w-20 text-indigo-300" />
      <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white">404</h1>
      <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">This page doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary mt-8 inline-flex"><Home className="h-4 w-4" /> Back to Home</Link>
    </motion.div>
  </div>
);

export default NotFound;
