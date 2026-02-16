import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import client from "../api/client";
import { formatCurrency } from "../lib/format";

const parseLocalDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getPreviousMonthDate = (date) =>
  new Date(date.getFullYear(), date.getMonth() - 1, 1);

const InsightsPanel = ({ transactions, categories }) => {
  const budgetCategories = categories.filter((c) => c !== "Stipendio");
  const [budgets, setBudgets] = useState({});
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  useEffect(() => {
    client.get("/api/budgets").then(({ data }) => {
      const map = {};
      data.forEach((b) => { map[b.category] = b.amount; });
      setBudgets(map);
    }).catch(() => {});
  }, []);

  const today = new Date();
  const currentMonthKey = getMonthKey(today);
  const previousMonthKey = getMonthKey(getPreviousMonthDate(today));

  const { currentMonth, previousMonth } = useMemo(() => {
    const base = {
      income: 0,
      expense: 0,
      perCategory: {},
    };
    const current = { ...base, perCategory: {} };
    const previous = { ...base, perCategory: {} };

    transactions.forEach((transaction) => {
      const parsed = parseLocalDate(transaction.date);
      if (!parsed) return;
      const key = getMonthKey(parsed);
      const amount = Number(transaction.amount) || 0;
      const category = transaction.category || "Altro";

      const target = key === currentMonthKey
        ? current
        : key === previousMonthKey
          ? previous
          : null;

      if (!target) return;

      if (transaction.type === "income") {
        target.income += amount;
      } else {
        target.expense += amount;
        if (category !== "Stipendio") {
          target.perCategory[category] =
            (target.perCategory[category] || 0) + amount;
        }
      }
    });

    return { currentMonth: current, previousMonth: previous };
  }, [transactions, currentMonthKey, previousMonthKey]);

  const buildDelta = (current, previous) => {
    const diff = current - previous;
    const percent =
      previous === 0 ? null : Math.round((diff / previous) * 100);
    return { diff, percent };
  };

  const incomeDelta = buildDelta(currentMonth.income, previousMonth.income);
  const expenseDelta = buildDelta(currentMonth.expense, previousMonth.expense);
  const netDelta = buildDelta(
    currentMonth.income - currentMonth.expense,
    previousMonth.income - previousMonth.expense,
  );

  const topCategory = Object.entries(currentMonth.perCategory).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState(false);

  const fetchAiInsights = useCallback(() => {
    setAiLoading(true);
    setAiError(false);
    client.get("/api/ai/insights")
      .then(({ data }) => {
        setAiInsights(data.insights || null);
        if (!data.insights) setAiError(true);
      })
      .catch(() => setAiError(true))
      .finally(() => setAiLoading(false));
  }, []);

  useEffect(() => {
    fetchAiInsights();
  }, [fetchAiInsights]);

  const exceededCategories = budgetCategories.filter((category) => {
    const budgetValue = Number(budgets[category] || 0);
    const spent = Number(currentMonth.perCategory[category] || 0);
    return budgetValue > 0 && spent > budgetValue && !dismissedAlerts.has(category);
  });

  const deleteBudget = (category) => {
    const current = budgets[category];
    setBudgets((prev) => {
      const next = { ...prev };
      delete next[category];
      return next;
    });
    setDismissedAlerts((prev) => {
      const next = new Set(prev);
      next.delete(category);
      return next;
    });
    if (current) {
      client.get("/api/budgets").then(({ data }) => {
        const match = data.find((b) => b.category === category);
        if (match) client.delete(`/api/budgets/${match.id}`).catch(() => {});
      }).catch(() => {});
    }
  };

  const confirmBudget = (category) => {
    const value = Number(budgets[category] || 0);
    const spent = Number(currentMonth.perCategory[category] || 0);

    client.post("/api/budgets", { category, amount: value }).catch(() => {});

    setDismissedAlerts((prev) => {
      const next = new Set(prev);
      next.delete(category);
      return next;
    });

    if (value > 0 && spent > value) {
      toast.error(
        `Budget ${category} superato! ${formatCurrency(spent)} / ${formatCurrency(value)}`,
        { duration: 5000 }
      );
    }
  };

  return (
    <div className="glass-card p-5 rounded-2xl mb-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Analisi del mese
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Confronto con il mese precedente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Entrate mese corrente
            </p>
            <p className="text-xl font-semibold text-emerald-600">
              {formatCurrency(currentMonth.income)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {incomeDelta.percent === null
                ? "Nessun dato mese precedente"
                : `${incomeDelta.diff >= 0 ? "+" : ""}${incomeDelta.percent}%`}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Uscite mese corrente
            </p>
            <p className="text-xl font-semibold text-rose-600">
              {formatCurrency(currentMonth.expense)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {expenseDelta.percent === null
                ? "Nessun dato mese precedente"
                : `${expenseDelta.diff >= 0 ? "+" : ""}${expenseDelta.percent}%`}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Saldo mese corrente
            </p>
            <p className="text-xl font-semibold text-sky-600">
              {formatCurrency(currentMonth.income - currentMonth.expense)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {netDelta.percent === null
                ? "Nessun dato mese precedente"
                : `${netDelta.diff >= 0 ? "+" : ""}${netDelta.percent}%`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              Budget per categoria (mese corrente)
            </h3>
            {exceededCategories.length > 0 && (
              <div className="mb-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 px-3 py-2 flex flex-col gap-1">
                {exceededCategories.map((category) => (
                  <div key={category} className="flex items-center justify-between">
                    <p className="text-xs text-rose-600 dark:text-rose-400">
                      ⚠ Budget <strong>{category}</strong> superato di{" "}
                      {formatCurrency(
                        Number(currentMonth.perCategory[category] || 0) -
                          Number(budgets[category] || 0)
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setDismissedAlerts((prev) => new Set([...prev, category]))
                      }
                      className="text-rose-400 hover:text-rose-600 ml-2 text-xs cursor-pointer"
                      title="Chiudi avviso"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-3">
              {budgetCategories.map((category) => {
                const budgetValue = Number(budgets[category] || 0);
                const spent = Number(currentMonth.perCategory[category] || 0);
                const progress =
                  budgetValue > 0 ? Math.min(spent / budgetValue, 1) : 0;
                return (
                  <div key={category} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">
                        {category}
                      </span>
                      <span className="text-slate-400">
                        {formatCurrency(spent)} / {formatCurrency(budgetValue)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full dark:bg-slate-800">
                        <div
                          className={`h-2 rounded-full ${
                            progress >= 1 ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                      <input
                        type="number"
                        placeholder="Budget"
                        value={budgets[category] ?? ""}
                        onChange={(e) =>
                          setBudgets((prev) => ({ ...prev, [category]: e.target.value === "" ? "" : Number(e.target.value) }))
                        }
                        onKeyDown={(e) => e.key === "Enter" && confirmBudget(category)}
                        className="w-24 h-8 border border-slate-200 rounded-md px-2 text-xs text-slate-700 bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => confirmBudget(category)}
                        className="h-8 px-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-xs cursor-pointer"
                        title="Conferma budget"
                      >
                        ✓
                      </button>
                      {budgets[category] != null && budgets[category] !== "" && (
                        <button
                          type="button"
                          onClick={() => deleteBudget(category)}
                          className="h-8 px-2 rounded-md bg-rose-500 hover:bg-rose-600 text-white text-xs cursor-pointer"
                          title="Elimina budget"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              Insight AI
            </h3>

            {aiLoading && (
              <div className="flex flex-col gap-3 animate-pulse">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/6" />
              </div>
            )}

            {!aiLoading && !aiError && aiInsights && (
              <>
                <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {aiInsights}
                </p>
                <p className="text-xs text-slate-400 mt-4">
                  Generato da AI
                </p>
              </>
            )}

            {!aiLoading && aiError && (
              <>
                <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Categoria più onerosa</span>
                    <span className="font-semibold">
                      {topCategory
                        ? `${topCategory[0]} (${formatCurrency(topCategory[1])})`
                        : "Nessun dato"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Entrate vs Uscite</span>
                    <span className="font-semibold">
                      {currentMonth.income === 0 && currentMonth.expense === 0
                        ? "Nessun dato"
                        : `${Math.round(
                            (currentMonth.income /
                              Math.max(currentMonth.expense, 1)) *
                              100,
                          )}%`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Totale spese mese</span>
                    <span className="font-semibold">
                      {formatCurrency(currentMonth.expense)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Totale entrate mese</span>
                    <span className="font-semibold">
                      {formatCurrency(currentMonth.income)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  Insight AI non disponibili — dati calcolati localmente.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
