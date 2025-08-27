import React from 'react';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import StandCard from '../components/StandCard';

function Discover({ stands, onOpenStand, onToggleFav, favorites }) {
  const [query, setQuery] = React.useState('');
  const [filters, setFilters] = React.useState([
    { key: 'nearby', label: 'À proximité', active: true },
    { key: 'today', label: "Aujourd'hui", active: false },
    { key: 'weekend', label: 'Ce week-end', active: false },
  ]);

  const toggleFilter = (key) => {
    setFilters((prev) => prev.map((f) => f.key === key ? { ...f, active: !f.active } : f));
  };

  const filtered = stands.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.categories.join(' ').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="screen discover">
      <SearchBar value={query} onChange={setQuery} />
      <FilterChips filters={filters} onToggle={toggleFilter} />
      <div className="list list--stands">
        {filtered.map((s) => (
          <StandCard
            key={s.id}
            stand={s}
            onOpen={onOpenStand}
            onToggleFav={onToggleFav}
            isFav={favorites.includes(s.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default Discover;
