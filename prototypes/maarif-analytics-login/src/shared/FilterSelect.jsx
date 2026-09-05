import { Select } from "@base-ui/react/select";
import { CaretDown, CaretUp, Check } from "@phosphor-icons/react";

export function FilterSelect({ definition, onChange, value }) {
  const items = definition.options.map((option) => ({
    label: option,
    value: option,
  }));

  return (
    <div className={`dashboard-filter dashboard-filter--${definition.key}`}>
      <Select.Root
        items={items}
        onValueChange={(nextValue) => onChange(definition.key, nextValue)}
        value={value}
      >
        <Select.Label className="dashboard-filter-label">
          {definition.label}
        </Select.Label>
        <Select.Trigger className="dashboard-filter-control shadcn-select-trigger">
          <Select.Value className="shadcn-select-value" />
          <Select.Icon className="shadcn-select-icon">
            <CaretDown aria-hidden="true" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner
            alignItemWithTrigger={false}
            className="shadcn-select-positioner"
            sideOffset={4}
          >
            <Select.Popup className="shadcn-select-popup">
              <Select.ScrollUpArrow className="shadcn-select-scroll-arrow">
                <CaretUp aria-hidden="true" />
              </Select.ScrollUpArrow>
              <Select.List className="shadcn-select-list">
                {items.map((item) => (
                  <Select.Item
                    className="shadcn-select-item"
                    key={item.value}
                    value={item.value}
                  >
                    <Select.ItemIndicator className="shadcn-select-item-indicator">
                      <Check aria-hidden="true" weight="bold" />
                    </Select.ItemIndicator>
                    <Select.ItemText className="shadcn-select-item-text">
                      {item.label}
                    </Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
              <Select.ScrollDownArrow className="shadcn-select-scroll-arrow">
                <CaretDown aria-hidden="true" />
              </Select.ScrollDownArrow>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
