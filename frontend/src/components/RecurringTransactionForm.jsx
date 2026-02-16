import { useState } from "react";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

const RecurringTransactionForm = ({ addRecurring, categories }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState(categories[0] || "");
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount || !startDate) return;

    setLoading(true);
    try {
      await addRecurring({
        name,
        amount: Number(amount),
        type,
        category,
        frequency,
        start_date: startDate,
      });

      toast.success("Ricorrenza creata");

      setName("");
      setAmount("");
      setType("expense");
      setCategory(categories[0] || "");
      setFrequency("monthly");
      setStartDate("");
    } catch {
      toast.error("Errore durante il salvataggio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Nome *
          </label>
          <input
            type="text"
            placeholder="Es. Affitto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Importo *
          </label>
          <input
            type="number"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Tipo
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 text-slate-700 bg-white cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="income">Entrata</option>
            <option value="expense">Uscita</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Frequenza
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 text-slate-700 bg-white cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="weekly">Settimanale</option>
            <option value="monthly">Mensile</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Data inizio *
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 text-slate-700 bg-white cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 text-slate-700 bg-white cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!name || !amount || !startDate || loading}
          className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-10 px-4 rounded-lg transition-colors cursor-pointer btn-primary"
        >
          <PlusCircle className="w-4 h-4" />
          {loading ? "Salvataggio..." : "Aggiungi ricorrenza"}
        </button>
      </div>
    </form>
  );
};

export default RecurringTransactionForm;
