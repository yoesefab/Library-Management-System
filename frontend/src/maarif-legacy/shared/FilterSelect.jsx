import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function FilterSelect({ definition, onChange, value }) {
  const items = definition.options.map((option) => ({
    label: option,
    value: option,
  }))

  return (
    <div className={`dashboard-filter dashboard-filter--${definition.key}`}>
      <span className='dashboard-filter-label'>{definition.label}</span>
      <Select
        onValueChange={(nextValue) => onChange(definition.key, nextValue)}
        value={value}
      >
        <SelectTrigger className='dashboard-filter-control shadcn-select-trigger'>
          <SelectValue className='shadcn-select-value' />
        </SelectTrigger>
        <SelectContent
          align='start'
          className='shadcn-select-popup'
          position='popper'
          sideOffset={4}
        >
          {items.map((item) => (
            <SelectItem
              className='shadcn-select-item'
              key={item.value}
              value={item.value}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
