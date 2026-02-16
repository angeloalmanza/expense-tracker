import { useState, useEffect, useRef } from "react";
import { PlusCircle, Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { inputClass, selectClass } from "../lib/styles";
import client from "../api/client";

const TransactionForm = ({ addTransaction, categories }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState(categories[0] || "");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState("");
  const [parsing, setParsing] = useState(false);
  const userPickedCategory = useRef(false);

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [categories]);

  const suggestCategory = async (transactionName) => {
    if (!transactionName.trim() || categories.length === 0 || userPickedCategory.current) return;

    try {
      const { data } = await client.post("/api/ai/categorize", {
        name: transactionName,
        categories,
      });
      if (data.category && !userPickedCategory.current) {
        setCategory(data.category);
      }
    } catch {
      // fallback silenzioso
    }
  };

  const handleAiParse = async () => {
    if (!aiText.trim() || categories.length === 0) return;

    setParsing(true);
    try {
      const { data } = await client.post("/api/ai/parse-transaction", {
        text: aiText,
        categories,
      });
      if (data.transaction) {
        setName(data.transaction.name);
        setAmount(String(data.transaction.amount));
        setType(data.transaction.type);
        setCategory(data.transaction.category);
        setDate(data.transaction.date);
        userPickedCategory.current = true;
        setAiText("");
        toast.success("Campi compilati dall'AI — controlla e conferma");
      } else {
        toast.error("Non sono riuscito a interpretare il testo");
      }
    } catch {
      toast.error("Non sono riuscito a interpretare il testo");
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount || !date) return;

    setLoading(true);
    try {
      await addTransaction({
        name,
        amount: Number(amount),
        type,
        category,
        date,
      });

      toast.success(`${type === "income" ? "Entrata" : "Spesa"} aggiunta`);

      setName("");
      setAmount("");
      setType("income");
      setCategory(categories[0] || "");
      setDate("");
      userPickedCategory.current = false;
    } catch {
      toast.error("Errore durante il salvataggio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card p-4 rounded-2xl mb-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Aggiungi transazione
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          I campi con * sono obbligatori
        </p>
      </div>

      <div className="flex gap-2 items-center border border-indigo-300/50 dark:border-indigo-500/30 rounded-xl p-2 bg-indigo-50/30 dark:bg-indigo-950/20">
        <input
          type="text"
          placeholder="Es. Speso 25 euro al supermercato ieri"
          value={aiText}
          onChange={(e) => setAiText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAiParse();
            }
          }}
          disabled={parsing}
          className={`${inputClass} flex-1`}
        />
        <button
          type="button"
          onClick={handleAiParse}
          disabled={parsing || !aiText.trim()}
          className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors cursor-pointer shrink-0"
        >
          {parsing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Nome *
          </label>
          <input
            type="text"
            placeholder="Es. Stipendio"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={(e) => suggestCategory(e.target.value)}
            className={inputClass}
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
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Tipo
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={selectClass}
          >
            <option value="income">Entrata</option>
            <option value="expense">Uscita</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Data *
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={selectClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              userPickedCategory.current = true;
            }}
            className={selectClass}
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
          disabled={!name || !amount || loading}
          className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-10 px-4 rounded-lg transition-colors cursor-pointer btn-primary"
        >
          <PlusCircle className="w-4 h-4" />
          {loading ? "Salvataggio..." : "Aggiungi"}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
