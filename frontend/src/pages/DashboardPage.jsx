import useTransactions from "../hook/useTransactions";
import useCategories from "../hook/useCategories";
import BalanceCard from "../components/BalanceCard";
import TransactionsChart from "../components/TransactionChart";
import InsightsPanel from "../components/InsightsPanel";

const DashboardPage = () => {
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const categoryNames = categories.map((c) => c.name).sort();

  return (
    <>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Dashboard personale
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-gradient">
          Spendify
        </h1>
      </div>

      <BalanceCard transactions={transactions} />
      <TransactionsChart transactions={transactions} />
      <InsightsPanel transactions={transactions} categories={categoryNames} />
    </>
  );
};

export default DashboardPage;
