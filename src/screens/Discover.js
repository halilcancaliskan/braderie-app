import React from 'react';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import StandCard from '../components/StandCard';

function Discover({ stands, onOpenStand, onToggleFav, favorites, userCity, onCityChange }) {
  const [query, setQuery] = React.useState('');
  const [showCityInput, setShowCityInput] = React.useState(!userCity);
  const [filters, setFilters] = React.useState([
    { key: 'nearby', label: 'À proximité', active: true },
    { key: 'today', label: "Aujourd'hui", active: false },
    { key: 'weekend', label: 'Ce week-end', active: false },
  ]);

  const toggleFilter = (key) => {
    setFilters((prev) => prev.map((f) => f.key === key ? { ...f, active: !f.active } : f));
  };

  const handleCitySubmit = (e) => {
    e.preventDefault();
    const city = e.target.city.value.trim();
    if (city) {
      onCityChange(city);
      setShowCityInput(false);
    }
  };

  const filtered = stands.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.categories.join(' ').toLowerCase().includes(query.toLowerCase());
    
    const matchesCity = !userCity || 
      s.location.address.toLowerCase().includes(userCity.toLowerCase()) ||
      s.fair?.city?.toLowerCase().includes(userCity.toLowerCase());
    
    return matchesSearch && matchesCity;
  });

  return (
    <section className="screen discover">
      {showCityInput ? (
        <div className="city-selector">
          <h2>Où cherchez-vous ?</h2>
          <p className="city-selector__subtitle">Entrez votre ville pour voir les braderies près de chez vous</p>
          <form onSubmit={handleCitySubmit} className="city-form">
            <div className="city-input-group">
              <input 
                type="text" 
                name="city"
                placeholder="Ex: Lille, Paris, Lyon..."
                className="city-input"
                autoFocus
                required
              />
              <button type="submit" className="city-submit">
                🔍
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="location-header">
            <div className="location-info">
              <span className="location-icon">📍</span>
              <span className="location-text">{userCity}</span>
            </div>
            <button 
              className="change-city-btn"
              onClick={() => setShowCityInput(true)}
              aria-label="Changer de ville"
            >
              Changer
            </button>
          </div>
          <SearchBar value={query} onChange={setQuery} />
          <FilterChips filters={filters} onToggle={toggleFilter} />
          <div className="list list--stands">
            {filtered.length === 0 ? (
              <div className="no-results">
                <p>Aucune braderie trouvée{userCity ? ` à ${userCity}` : ''}.</p>
                <button 
                  className="secondary"
                  onClick={() => setShowCityInput(true)}
                >
                  Changer de ville
                </button>
              </div>
            ) : (
              filtered.map((s) => (
                <StandCard
                  key={s.id}
                  stand={s}
                  onOpen={onOpenStand}
                  onToggleFav={onToggleFav}
                  isFav={favorites.includes(s.id)}
                />
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default Discover;
