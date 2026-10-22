import { Search, MapPin, Tag, DollarSign, Grid, List, SlidersHorizontal } from "lucide-react";

const EventFilters = ({ filters, onChange, categories, view, onViewChange }) => {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </h3>
        <div className="flex gap-1 rounded-lg border border-gray-200 dark:border-gray-800 p-1">
          <button onClick={() => onViewChange("grid")} className={`rounded-md p-1.5 ${view === "grid" ? "bg-indigo-600 text-white" : "text-gray-400"}`}>
            <Grid className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onViewChange("list")} className={`rounded-md p-1.5 ${view === "list" ? "bg-indigo-600 text-white" : "text-gray-400"}`}>
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={filters.search || ""} onChange={(e) => update("search", e.target.value)} placeholder="Search events..." className="input-field pl-9" />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500"><Tag className="h-3.5 w-3.5" /> Category</label>
          <select value={filters.category || ""} onChange={(e) => update("category", e.target.value)} className="input-field">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500"><MapPin className="h-3.5 w-3.5" /> City</label>
          <input value={filters.city || ""} onChange={(e) => update("city", e.target.value)} placeholder="Any city" className="input-field" />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">Date From</label>
          <input type="date" value={filters.dateFrom || ""} onChange={(e) => update("dateFrom", e.target.value)} className="input-field" />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500"><DollarSign className="h-3.5 w-3.5" /> Max Price</label>
          <input type="number" min="0" value={filters.maxPrice || ""} onChange={(e) => update("maxPrice", e.target.value)} placeholder="Any price" className="input-field" />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">Sort By</label>
          <select value={filters.sort || "-date"} onChange={(e) => update("sort", e.target.value)} className="input-field">
            <option value="-date">Date: Soonest</option>
            <option value="date">Date: Latest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-bookedSeats">Most Popular</option>
          </select>
        </div>

        <button onClick={() => onChange({ sort: "-date" })} className="w-full rounded-xl border border-gray-200 dark:border-gray-800 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default EventFilters;
