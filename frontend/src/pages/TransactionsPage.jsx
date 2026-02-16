import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import useTransactions from "../hook/useTransactions";
import useCategories from "../hook/useCategories";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import EditModal from "../components/EditModal";
import EditTransactionForm from "../components/EditTransactionForm";
import ConfirmModal from "../components/ConfirmModal";
import { exportCsv, exportJson } from "../lib/export";

const PAGE_SIZE = 10;

const TransactionsPage = () => {
  const { transactions, addTransaction, updateTransaction, removeTransaction } =
    useTransactions();
  const { categories } = useCategories();
  const categoryNames = categories.map((c) => c.name).sort();

  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTransactionToDelete(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  const filteredTransactions = transactions
    .filter((t) => (filter === "all" ? true : t.type === filter))
    .filter((t) =>
      categoryFilter === "all" ? true : t.category === categoryFilter,
    )
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => {
      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;
      return true;
    });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortField) return 0;

    let valueA = a[sortField];
    let valueB = b[sortField];

    if (typeof valueA === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
  });

  const totalPages = Math.ceil(sortedTransactions.length / PAGE_SIZE) || 1;
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, categoryFilter, search, startDate, endDate, sortField, sortDirection]);

  const openDeleteModal = (id) => {
    setTransactionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await removeTransaction(transactionToDelete);
      toast.success("Transazione eliminata");
      closeDeleteModal();
    } catch {
      toast.error("Errore durante l'eliminazione");
    } finally {
      setDeleting(false);
    }
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    if (!highlightedId) return;
    const timer = setTimeout(() => setHighlightedId(null), 1500);
    return () => clearTimeout(timer);
  }, [highlightedId]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Transazioni
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gestisci tutte le tue transazioni
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportCsv(transactions)}
            className="h-9 px-3 flex items-center gap-2 rounded-lg btn-primary transition-colors cursor-pointer text-sm"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={() => exportJson(transactions)}
            className="h-9 px-3 flex items-center gap-2 rounded-lg btn-primary transition-colors cursor-pointer text-sm"
          >
            <Download className="w-4 h-4" />
            JSON
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 md:p-5 mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Ricerca e filtri
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Affina per tipo, data o categoria
            </p>
          </div>
          <SearchBar search={search} setSearch={setSearch} />
          <FilterBar
            filter={filter}
            setFilter={setFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categoryNames}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setSortField={setSortField}
            setSortDirection={setSortDirection}
            setSearch={setSearch}
          />
        </div>
      </div>

      <TransactionForm
        categories={categoryNames}
        addTransaction={async (transaction) => {
          const saved = await addTransaction(transaction);
          setHighlightedId(saved.id);
        }}
      />

      <EditModal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <EditTransactionForm
          categories={categoryNames}
          editingTransaction={editingTransaction}
          updateTransaction={async (updated) => {
            const saved = await updateTransaction(updated);
            setHighlightedId(saved.id);
          }}
          onClose={closeEditModal}
        />
      </EditModal>

      <TransactionList
        transactions={paginatedTransactions}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
        openDeleteModal={openDeleteModal}
        onEdit={openEditModal}
        highlightedId={highlightedId}
        categories={categories}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalCount={sortedTransactions.length}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </>
  );
};

export default TransactionsPage;
