import { motion } from "framer-motion";

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 px-6 py-16 text-center"
  >
    {Icon && (
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
        <Icon className="h-7 w-7 text-gray-400" />
      </div>
    )}
    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
    {description && <p className="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </motion.div>
);

export default EmptyState;
