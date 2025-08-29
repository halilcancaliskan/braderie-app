import React from 'react';

function SideDrawer({ open, onClose, onNavigate }) {
  const panelRef = React.useRef(null);
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) {
      document.addEventListener('keydown', onKey);
      // lock scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // focus panel for a11y
      setTimeout(() => {
        try { panelRef.current?.focus(); } catch {}
      }, 0);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = prev;
      };
    }
  }, [open, onClose]);

  return (
    <div className={`drawer ${open ? 'is-open' : ''}`} id="app-drawer" aria-hidden={!open}>
      {open && (
        <button
          className="drawer__backdrop"
          aria-label="Fermer le menu"
          onClick={onClose}
        />
      )}
      <aside
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        tabIndex={-1}
        ref={panelRef}
      >
        <div className="drawer__header">
          <div className="drawer__brand">
            <div className="drawer__logo">🏪</div>
            <div>
              <div className="drawer__title" id="drawer-title">Braderie Finder</div>
              <div className="drawer__subtitle">Découvrez les braderies</div>
            </div>
          </div>
          <button className="drawer__close" aria-label="Fermer" onClick={onClose}>
            <span>✕</span>
          </button>
        </div>
        <nav className="drawer__nav" role="navigation" aria-label="Navigation principale">
          <button className="drawer__item" onClick={() => onNavigate?.('discover')}>
            <span className="drawer__item-icon">🏠</span>
            <span className="drawer__item-text">Découvrir</span>
          </button>
          <button className="drawer__item" onClick={() => onNavigate?.('publish')}>
            <span className="drawer__item-icon">➕</span>
            <span className="drawer__item-text">Publier</span>
          </button>
          <button className="drawer__item" onClick={() => onNavigate?.('map')}>
            <span className="drawer__item-icon">🗺️</span>
            <span className="drawer__item-text">Carte</span>
          </button>
          <div className="drawer__divider"></div>
          <button className="drawer__item" onClick={() => onNavigate?.('profile')}>
            <span className="drawer__item-icon">👤</span>
            <span className="drawer__item-text">Profil</span>
          </button>
        </nav>
      </aside>
    </div>
  );
}

export default SideDrawer;
