import React from "react";
import useTransactions from "./hook/useTransactions";
import BalanceCard from "./components/BalanceCard";
import TransactionForm from "./components/TransactionForm";

const App = () => {
  const { transactions, addTransaction, removeTransaction } = useTransactions();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Expense Tracker</h1>
      <BalanceCard transactions={transactions} />
      <TransactionForm addTransaction={addTransaction} />
    </div>
  );
};

export default App;
