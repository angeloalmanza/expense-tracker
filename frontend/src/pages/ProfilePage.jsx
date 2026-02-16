import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const AVATAR_STYLES = ["avataaars", "bottts", "fun-emoji", "lorelei", "notionists"];
const SEEDS = ["Felix", "Lily", "Max", "Luna", "Zara", "Axel"];

const AVATARS = AVATAR_STYLES.flatMap((style) =>
  SEEDS.slice(0, 4).map((seed) => ({
    url: `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`,
    label: `${style} ${seed}`,
  }))
);

const ProfilePage = () => {
  const { user, updateProfile } = useAuthContext();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile({
        name,
        email,
        avatar: avatar || null,
        current_password: currentPassword || undefined,
        new_password: newPassword || undefined,
        new_password_confirmation: newPasswordConfirmation || undefined,
      });
      toast.success("Profilo aggiornato");
      navigate("/");
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(err?.response?.data?.message || "Errore durante l'aggiornamento");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold text-gradient mb-6">Profilo</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Avatar grid */}
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
              Avatar
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-4">
              {AVATARS.map((a) => (
                <button
                  key={a.url}
                  type="button"
                  onClick={() => setAvatar(a.url)}
                  className={`flex items-center justify-center rounded-full border-2 transition-all cursor-pointer ${
                    avatar === a.url
                      ? "border-indigo-500 scale-110"
                      : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                  title={a.label}
                >
                  <img
                    src={a.url}
                    alt={a.label}
                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700"
                  />
                </button>
              ))}
            </div>
            {avatar && (
              <div className="flex items-center gap-3">
                <img
                  src={avatar}
                  alt="Avatar selezionato"
                  className="w-14 h-14 rounded-full border-2 border-indigo-500 bg-slate-100 dark:bg-slate-700"
                />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Avatar selezionato</p>
                  <button
                    type="button"
                    onClick={() => setAvatar("")}
                    className="text-xs text-red-400 hover:underline cursor-pointer mt-0.5"
                  >
                    Rimuovi
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Name + Email */}
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Informazioni personali
            </p>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Cambia password <span className="font-normal text-slate-400">(opzionale)</span>
            </p>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Password attuale
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Nuova password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={newPassword ? 8 : undefined}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Conferma nuova password
              </label>
              <input
                type="password"
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary h-10 rounded-lg disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "Salvataggio..." : "Salva modifiche"}
          </button>
        </form>
    </div>
  );
};

export default ProfilePage;
