import React from 'react';

const Chip = ({ active, children, onClick }) => (
  <button className={"chip" + (active ? " is-active" : "")} onClick={onClick}>
    {children}
  </button>
);

function FilterChips({ filters, onToggle }) {
  return (
    <div className="chips">
      {filters.map((f) => (
        <Chip key={f.key} active={f.active} onClick={() => onToggle?.(f.key)}>
          {f.label}
        </Chip>
      ))}
    </div>
  );
}

export default FilterChips;
