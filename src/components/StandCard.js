import React from 'react';

function StandCard({ stand, onOpen, onToggleFav, isFav }) {
  return (
    <article className="card stand-card">
      <div className="card__media">
        <img src={stand.photos?.[0] || '/logo192.png'} alt={stand.title} />
        <button
          className={"fav-btn" + (isFav ? " is-active" : "")}
          aria-pressed={isFav}
          aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          onClick={(e) => { e.stopPropagation(); onToggleFav?.(stand.id); }}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="card__body" onClick={() => onOpen?.(stand)}>
        <div className="card__title">{stand.title}</div>
        <div className="card__meta">
          <span>{stand.fair?.name}</span>
          <span>• {stand.distanceKm} km</span>
        </div>
        <div className="card__tags">
          {stand.categories?.slice(0, 3).map((c) => (
            <span key={c} className="tag">{c}</span>
          ))}
        </div>
        <div className="card__items">
          {stand.items?.slice(0, 3).map((it) => (
            <span key={it.id} className="pill">{it.title} · {it.price}€</span>
          ))}
        </div>
        <div className="card__price">À partir de {stand.priceFrom}€</div>
      </div>
    </article>
  );
}

export default StandCard;
