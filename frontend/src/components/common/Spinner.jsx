import { Loader2 } from "lucide-react";

const Spinner = ({ className = "h-6 w-6", full = false }) => {
  if (full) {
    return (
      <div className="flex min-h-[40vh] w-full items-center justify-center">
        <Loader2 className={`animate-spin text-indigo-500 ${className}`} />
      </div>
    );
  }
  return <Loader2 className={`animate-spin text-indigo-500 ${className}`} />;
};

export default Spinner;
