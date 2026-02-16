import { inputClass } from "../lib/styles";

const SearchBar = ({ search, setSearch }) => {
  return (
    <input
      type="text"
      placeholder="Cerca Transazione..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className={`${inputClass} placeholder:text-slate-400 transition dark:placeholder:text-slate-500`}
    />
  );
};

export default SearchBar;
