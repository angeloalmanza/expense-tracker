import useRecurringTransactions from "../hook/useRecurringTransactions";
import useCategories from "../hook/useCategories";
import useTransactions from "../hook/useTransactions";
import RecurringTransactionForm from "../components/RecurringTransactionForm";
import RecurringTransactionList from "../components/RecurringTransactionList";

const RecurringPage = () => {
  const { recurringTransactions, addRecurring, removeRecurring, toggleRecurring } =
    useRecurringTransactions();
  const { categories } = useCategories();
  const { refreshTransactions } = useTransactions();
  const categoryNames = categories.map((c) => c.name).sort();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Transazioni ricorrenti
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {recurringTransactions.filter((r) => r.is_active).length} attive su{" "}
          {recurringTransactions.length} totali
        </p>
      </div>

      <div className="glass-card p-4 rounded-2xl mb-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Nuova ricorrenza
        </h2>
        <RecurringTransactionForm
          addRecurring={async (data) => {
            const result = await addRecurring(data);
            refreshTransactions();
            return result;
          }}
          categories={categoryNames}
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <RecurringTransactionList
          recurringTransactions={recurringTransactions}
          toggleRecurring={toggleRecurring}
          removeRecurring={removeRecurring}
          categories={categories}
        />
      </div>
    </>
  );
};

export default RecurringPage;
