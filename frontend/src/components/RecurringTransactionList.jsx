import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const RecurringTransactionList = ({
  recurringTransactions,
  toggleRecurring,
  removeRecurring,
  categories,
}) => {
  const formatter = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  });

  if (recurringTransactions.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
        Nessuna ricorrenza configurata.
      </p>
    );
  }

  const handleToggle = async (id) => {
    try {
      const updated = await toggleRecurring(id);
      toast.success(updated.is_active ? "Ricorrenza attivata" : "Ricorrenza disattivata");
    } catch {
      toast.error("Errore durante l'aggiornamento");
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeRecurring(id);
      toast.success("Ricorrenza eliminata");
    } catch {
      toast.error("Errore durante l'eliminazione");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b dark:text-slate-400">
            <th className="p-3">Nome</th>
            <th className="p-3">Tipo</th>
            <th className="p-3">Categoria</th>
            <th className="p-3">Frequenza</th>
            <th className="p-3 text-right">Importo</th>
            <th className="p-3 text-center">Attiva</th>
            <th className="p-3 text-right">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {recurringTransactions.map((r) => {
            const catObj = categories.find((c) => c.name === r.category);
            const hex = catObj?.color || "#64748b";

            return (
              <tr
                key={r.id}
                className="border-b last:border-none hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:border-slate-800 transition-colors"
              >
                <td className="p-3 font-medium text-slate-800 dark:text-slate-100">
                  {r.name}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.type === "income"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {r.type === "income" ? "Entrata" : "Uscita"}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: hex + "20", color: hex }}
                  >
                    {r.category}
                  </span>
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400">
                  {r.frequency === "weekly" ? "Settimanale" : "Mensile"}
                </td>
                <td
                  className={`p-3 text-right font-semibold tabular-nums ${
                    r.type === "income" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {formatter.format(r.amount)}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleToggle(r.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                      r.is_active ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                    title={r.is_active ? "Disattiva" : "Attiva"}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                        r.is_active ? "translate-x-[18px]" : "translate-x-[3px]"
                      }`}
                    />
                  </button>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-rose-500 hover:text-rose-700 transition-colors duration-200"
                    title="Elimina"
                  >
                    <Trash2 className="w-4 h-4 cursor-pointer" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecurringTransactionList;
