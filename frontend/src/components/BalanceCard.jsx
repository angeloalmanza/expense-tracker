import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "../lib/format";

const BalanceCard = ({ transactions }) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = income - expenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="glass-card p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Wallet className="w-4 h-4" />
          Saldo
        </div>
        <p
          className={`mt-2 text-2xl font-semibold ${
            balance >= 0 ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {formatCurrency(balance)}
        </p>
      </div>
      <div className="glass-card p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <TrendingUp className="w-4 h-4" />
          Entrate
        </div>
        <p className="mt-2 text-2xl font-semibold text-emerald-600">
          {formatCurrency(income)}
        </p>
      </div>
      <div className="glass-card p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <TrendingDown className="w-4 h-4" />
          Uscite
        </div>
        <p className="mt-2 text-2xl font-semibold text-rose-600">
          {formatCurrency(expenses)}
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;
