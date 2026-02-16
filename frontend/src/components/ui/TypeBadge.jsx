const TypeBadge = ({ type }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      type === "income"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-rose-100 text-rose-700"
    }`}
  >
    {type === "income" ? "Entrata" : "Uscita"}
  </span>
);

export default TypeBadge;
