import { X } from "lucide-react";
import { selectClass } from "../lib/styles";

const filterInputClass =
  "h-9 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 bg-white cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

const FilterBar = ({
  filter,
  setFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setSortField,
  setSortDirection,
  setSearch,
}) => {
  const resetFilters = () => {
    setSearch("");
    setFilter("all");
    setCategoryFilter("all");
    setStartDate("");
    setEndDate("");
    setSortField("date");
    setSortDirection("asc");
  };

  const typeBtn = (value, label, activeClass) => (
    <button
      onClick={() => setFilter(value)}
      className={`h-9 px-3.5 rounded-lg text-sm font-medium transition cursor-pointer ${
        filter === value
          ? activeClass
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
      {/* Tipo */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Tipo
        </span>
        <div className="flex gap-1.5">
          {typeBtn("all", "Tutte", "bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900")}
          {typeBtn("income", "Entrate", "bg-emerald-600 text-white")}
          {typeBtn("expense", "Uscite", "bg-rose-600 text-white")}
        </div>
      </div>

      {/* Categoria */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Categoria
        </span>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={filterInputClass}
        >
          <option value="all">Tutte le categorie</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Periodo */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Periodo
        </span>
        <div className="flex gap-1.5 items-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={filterInputClass}
          />
          <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={filterInputClass}
          />
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={resetFilters}
        className="h-9 flex items-center gap-1.5 px-3.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        title="Reset filtri"
      >
        <X className="w-3.5 h-3.5" />
        Reset
      </button>
    </div>
  );
};

export default FilterBar;
