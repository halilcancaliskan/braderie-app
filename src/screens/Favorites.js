import React from 'react';
import StandCard from '../components/StandCard';

function Favorites({ stands, favorites, onToggleFav, onOpenStand }) {
  const favs = stands.filter((s) => favorites.includes(s.id));
  return (
    <section className="screen favorites">
      <h1>Favoris</h1>
      {favs.length === 0 ? (
        <p>Aucun favori. Ajoutez des stands en appuyant sur le cœur.</p>
      ) : (
        <div className="list list--stands">
          {favs.map((s) => (
            <StandCard key={s.id} stand={s} onToggleFav={onToggleFav} onOpen={onOpenStand} isFav />
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
