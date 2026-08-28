import { CaretDown } from "@phosphor-icons/react";

export function DashboardFilter({ definition, value, onChange }) {
  const Icon = definition.icon;

  return (
    <label className={`dashboard-filter dashboard-filter--${definition.key}`}>
      <span>{definition.label}</span>
      <span className="dashboard-filter-control">
        {Icon ? <Icon aria-hidden="true" /> : null}
        <select
          aria-label={definition.label}
          onChange={(event) => onChange(definition.key, event.target.value)}
          value={value}
        >
          {definition.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <CaretDown aria-hidden="true" className="dashboard-filter-caret" />
      </span>
    </label>
  );
}
