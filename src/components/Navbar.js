import React from 'react';

function Navbar({ title = 'Mobile App', leftSlot, rightSlot }) {
  return (
    <header className="navbar" role="banner">
      <div className="navbar__side navbar__side--left" aria-label="Left actions">
        {leftSlot || (
          <button className="icon-btn" aria-label="Menu" title="Menu">
            {/* hamburger icon */}
            <span className="icon icon--hamburger" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </button>
        )}
      </div>
      <div className="navbar__title" aria-live="polite">{title}</div>
      <div className="navbar__side navbar__side--right" aria-label="Right actions">
        {rightSlot || (
          <button className="icon-btn" aria-label="Search" title="Search">
            <span className="icon icon--search" aria-hidden />
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
