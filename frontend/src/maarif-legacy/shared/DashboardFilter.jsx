import { DateRangePicker } from './DateRangePicker.jsx'
import { FilterSelect } from './FilterSelect.jsx'

export function DashboardFilter({ definition, value, onChange }) {
  if (definition.key === 'period') {
    return (
      <DateRangePicker
        label={definition.label}
        onChange={(nextValue) => onChange(definition.key, nextValue)}
        value={value}
      />
    )
  }

  return (
    <FilterSelect definition={definition} onChange={onChange} value={value} />
  )
}
