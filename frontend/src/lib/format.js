const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

export const formatCurrency = (value) => currencyFormatter.format(value || 0);
