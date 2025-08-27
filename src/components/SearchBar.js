import React from 'react';

function SearchBar({ value, onChange, onSubmit, placeholder = 'Que cherchez-vous ?' }) {
  const [q, setQ] = React.useState(value || '');
  React.useEffect(() => setQ(value || ''), [value]);
  return (
    <form
      className="searchbar"
      role="search"
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(q); }}
    >
      <span className="icon icon--search" aria-hidden />
      <input
        type="search"
        value={q}
        onChange={(e) => { setQ(e.target.value); onChange?.(e.target.value); }}
        placeholder={placeholder}
        aria-label="Rechercher"
      />
      {q && (
        <button type="button" className="clear-btn" onClick={() => { setQ(''); onChange?.(''); }} aria-label="Effacer">✕</button>
      )}
    </form>
  );
}

export default SearchBar;
