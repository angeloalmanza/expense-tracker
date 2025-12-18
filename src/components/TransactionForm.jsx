import { useState } from "react";
import { PlusCircle } from "lucide-react";

const TransactionForm = ({ addTransaction }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    addTransaction({ id: Date.now(), name, amount: Number(amount), type });
    setName("");
    setAmount("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-lg mb-4 grid grid-cols-1 gap-3 md:grid-cols-4 md:items-end"
    >
      <input
        type="text"
        placeholder="Nome Transazione"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="md:col-span-2 border border-gray-400 p-2 rounded-lg"
      />
      <input
        type="number"
        placeholder="Importo"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border border-gray-400 p-2 rounded-lg"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border border-gray-400 p-2 rounded-lg cursor-pointer"
      >
        <option value="income" className="cursor-pointer">
          Entrata
        </option>
        <option value="expense" className="cursor-pointer">
          Uscita
        </option>
      </select>
      <button
        type="submit"
        className="md:col-span-4 md:justify-self-end flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        <PlusCircle className="w-4 h-4" />
        Aggiungi
      </button>
    </form>
  );
};

export default TransactionForm;
