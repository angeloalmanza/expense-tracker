import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

const BalanceCard = ({ transactions }) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = income - expenses;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-4 flex flex-col gap-4 md:flex-row md:justify-around">
      <div>
        <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800">
          <Wallet className="w-5 h-5 " /> Saldo
        </h2>
        <p
          className={`text-center text-gray-500 ${
            balance >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {balance.toFixed(2)}
        </p>
      </div>
      <div>
        <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800">
          <TrendingUp className="w-5 h-5 " /> Entrate
        </h2>
        <p className="text-center text-gray-500">{income.toFixed(2)}</p>
      </div>
      <div>
        <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800">
          <TrendingDown className="w-5 h-5 " /> Uscite
        </h2>
        <p className="text-center text-gray-500">{expenses.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default BalanceCard;
