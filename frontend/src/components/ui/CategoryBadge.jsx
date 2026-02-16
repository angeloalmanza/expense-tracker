const CategoryBadge = ({ name, categories }) => {
  const catName = name || "Altro";
  const catObj = categories.find((c) => c.name === catName);
  const hex = catObj?.color || "#64748b";

  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: hex + "20", color: hex }}
    >
      {catName}
    </span>
  );
};

export default CategoryBadge;
