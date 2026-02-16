import { useState } from "react";
import { Check, Pencil, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { inputClass } from "../lib/styles";

const CategoryManager = ({ categories, addCategory, updateCategory, removeCategory }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      await addCategory(trimmed, color);
      toast.success(`Categoria "${trimmed}" aggiunta`);
      setName("");
      setColor("#6366f1");
    } catch {
      toast.error("Errore durante la creazione");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (category) => {
    try {
      await removeCategory(category.id);
      toast.success(`Categoria "${category.name}" eliminata`);
    } catch {
      toast.error("Errore durante l'eliminazione");
    }
  };

  const startEditing = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color || "#64748b");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditColor("");
  };

  const handleSaveEdit = async (id) => {
    const trimmed = editName.trim();
    if (!trimmed) return;

    try {
      await updateCategory(id, { name: trimmed, color: editColor });
      toast.success("Categoria aggiornata");
      cancelEditing();
    } catch {
      toast.error("Errore durante l'aggiornamento");
    }
  };

  return (
    <div className="glass-card p-4 rounded-2xl mb-6">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
        Categorie
      </h2>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Nuova categoria..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className={`flex-1 ${inputClass}`}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5"
          title="Scegli colore"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!name.trim() || loading}
          className="flex items-center gap-1 h-10 px-4 rounded-lg btn-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Aggiungi
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) =>
          editingId === cat.id ? (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-800"
            >
              <input
                type="color"
                value={editColor}
                onChange={(e) => setEditColor(e.target.value)}
                className="h-6 w-6 rounded-full border-0 cursor-pointer p-0"
              />
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(cat.id)}
                className="w-24 h-6 px-1 text-sm rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-100 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleSaveEdit(cat.id)}
                className="text-emerald-500 hover:text-emerald-700 transition-colors cursor-pointer"
                title="Salva"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Annulla"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ) : (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <span
                className="w-3 h-3 rounded-full inline-block flex-shrink-0"
                style={{ backgroundColor: cat.color || "#64748b" }}
              />
              {cat.name}
              <button
                type="button"
                onClick={() => startEditing(cat)}
                className="ml-0.5 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                title={`Modifica ${cat.name}`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(cat)}
                className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                title={`Elimina ${cat.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ),
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
