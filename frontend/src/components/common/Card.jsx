import { motion } from "framer-motion";

const Card = ({ children, className = "", hover = true, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm ${
      hover ? "transition-all hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 hover:-translate-y-1" : ""
    } ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

export default Card;
