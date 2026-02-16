import useCategories from "../hook/useCategories";
import CategoryManager from "../components/CategoryManager";

const CategoriesPage = () => {
  const { categories, addCategory, updateCategory, removeCategory } =
    useCategories();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Categorie
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gestisci le categorie delle tue transazioni
        </p>
      </div>

      <CategoryManager
        categories={categories}
        addCategory={addCategory}
        updateCategory={updateCategory}
        removeCategory={removeCategory}
      />
    </>
  );
};

export default CategoriesPage;
