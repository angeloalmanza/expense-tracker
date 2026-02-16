import { useEffect, useMemo, useState } from "react";
import { Edit3, GripVertical, Trash2 } from "lucide-react";
import { formatCurrency } from "../lib/format";
import TypeBadge from "./ui/TypeBadge";
import CategoryBadge from "./ui/CategoryBadge";

const TransactionList = ({
  transactions,
  onSort,
  sortField,
  sortDirection,
  openDeleteModal,
  onEdit,
  highlightedId,
  categories,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
}) => {
  const [orderedTransactions, setOrderedTransactions] = useState(transactions);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const transactionKey = useMemo(
    () => transactions.map((t) => t.id).join("|"),
    [transactions],
  );

  useEffect(() => {
    setOrderedTransactions(transactions);
  }, [transactionKey, transactions]);

  if (transactions.length === 0)
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-500">
        <p className="text-lg font-medium text-slate-700 dark:text-slate-100">
          Nessuna transazione
        </p>
        <p className="text-sm mt-1 dark:text-slate-400">
          Inizia aggiungendone una per vedere l’andamento.
        </p>
      </div>
    );

  const handleDragStart = (id) => {
    setDraggingId(id);
  };

  const handleDragOver = (event, id) => {
    event.preventDefault();
    if (dragOverId !== id) setDragOverId(id);
  };

  const handleDrop = (event, id) => {
    event.preventDefault();
    if (!draggingId || draggingId === id) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    setOrderedTransactions((current) => {
      const next = [...current];
      const fromIndex = next.findIndex((t) => t.id === draggingId);
      const toIndex = next.findIndex((t) => t.id === id);
      if (fromIndex < 0 || toIndex < 0) return current;
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDraggingId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b bg-slate-50 dark:bg-slate-900 dark:text-slate-400">
              <th className="p-3 w-8 sticky top-0 bg-slate-50 dark:bg-slate-900" />
              <th
                onClick={() => onSort("name")}
                className="p-3 cursor-pointer select-none hover:text-slate-900 transition-colors sticky top-0 bg-slate-50 dark:bg-slate-900 dark:hover:text-slate-100"
              >
                Nome
                {sortField === "name" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                onClick={() => onSort("type")}
                className="p-3 cursor-pointer select-none hover:text-slate-900 transition-colors sticky top-0 bg-slate-50 dark:bg-slate-900 dark:hover:text-slate-100"
              >
                Tipo
                {sortField === "type" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                onClick={() => onSort("date")}
                className="p-3 cursor-pointer select-none hover:text-slate-900 transition-colors sticky top-0 bg-slate-50 dark:bg-slate-900 dark:hover:text-slate-100"
              >
                Data
                {sortField === "date" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                onClick={() => onSort("category")}
                className="p-3 cursor-pointer select-none hover:text-slate-900 transition-colors sticky top-0 bg-slate-50 dark:bg-slate-900 dark:hover:text-slate-100"
              >
                Categoria
                {sortField === "category" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                onClick={() => onSort("amount")}
                className="p-3 text-right cursor-pointer select-none hover:text-slate-900 transition-colors sticky top-0 bg-slate-50 dark:bg-slate-900 dark:hover:text-slate-100"
              >
                Importo
                {sortField === "amount" && (
                  <span className="ml-1 inline-block">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>

              <th className="p-3 text-right sticky top-0 bg-slate-50 dark:bg-slate-900">
                Azioni
              </th>
            </tr>
          </thead>

          <tbody>
            {orderedTransactions.map((t) => (
              <tr
                key={t.id}
                draggable
                onDragStart={() => handleDragStart(t.id)}
                onDragOver={(event) => handleDragOver(event, t.id)}
                onDrop={(event) => handleDrop(event, t.id)}
                onDragEnd={handleDragEnd}
                className={`border-b last:border-none transition-colors ${
                  highlightedId === t.id ? "bg-emerald-50" : "hover:bg-slate-50"
                } ${dragOverId === t.id ? "bg-slate-100" : ""} ${
                  draggingId === t.id ? "opacity-70" : ""
                } dark:hover:bg-slate-800/50 dark:border-slate-800`}
              >
                <td className="p-3 text-slate-400">
                  <GripVertical className="w-4 h-4 cursor-move" />
                </td>
                <td className="p-3 font-medium text-slate-800 dark:text-slate-100">
                  {t.name}
                </td>
                <td className="p-3">
                  <TypeBadge type={t.type} />
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400">
                  {t.date ? new Date(t.date).toLocaleDateString("it-IT") : "-"}
                </td>
                <td className="p-3">
                  <CategoryBadge name={t.category} categories={categories} />
                </td>
                <td
                  className={`p-3 text-right font-semibold tabular-nums ${
                    t.type === "income" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {formatCurrency(t.amount)}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onEdit(t)}
                    className="mr-2 text-slate-500 hover:text-slate-800 transition-colors duration-200 dark:text-slate-400 dark:hover:text-slate-100"
                    title="Modifica"
                  >
                    <Edit3 className="w-4 h-4 cursor-pointer" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(t.id)}
                    className="text-rose-500 hover:text-rose-700 transition-colors duration-200"
                    title="Elimina"
                  >
                    <Trash2 className="w-4 h-4 cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
        <span>{totalCount} transazioni totali</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            &laquo; Prec
          </button>
          <span className="text-slate-700 dark:text-slate-300">
            Pagina {currentPage} di {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Succ &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
