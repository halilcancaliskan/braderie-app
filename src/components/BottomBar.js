import React from 'react';

function BottomBar({ tabs = [], activeKey, onChange }) {
  return (
    <nav className="bottombar" role="navigation" aria-label="Bottom navigation">
      {tabs.map((t) => {
        const isActive = t.key === activeKey;
        return (
          <button
            key={t.key}
            className={"bottombar__item" + (isActive ? " is-active" : "")}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onChange && onChange(t.key)}
          >
            {t.icon && <span className="bottombar__icon" aria-hidden>{t.icon}</span>}
            <span className="bottombar__label">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomBar;
