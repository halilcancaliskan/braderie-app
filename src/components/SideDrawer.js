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
          <div className="drawer__title" id="drawer-title">Menu</div>
          <button className="drawer__close" aria-label="Fermer" onClick={onClose}>✕</button>
        </div>
        <nav className="drawer__nav" role="navigation" aria-label="Navigation principale">
          <button className="drawer__item" onClick={() => onNavigate?.('discover')}>Découvrir</button>
          <button className="drawer__item" onClick={() => onNavigate?.('publish')}>Publier</button>
          <button className="drawer__item" onClick={() => onNavigate?.('map')}>Carte</button>
          <button className="drawer__item" onClick={() => onNavigate?.('profile')}>Profil</button>
        </nav>
      </aside>
    </div>
  );
}

export default SideDrawer;
