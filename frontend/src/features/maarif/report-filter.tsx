import { useState } from 'react'
import { Check, PlusCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

export function ReportFilter({
  title,
  value,
  defaultValue,
  options,
  disabled,
  onChange,
}: {
  title: string
  value: string
  defaultValue: string
  options: string[]
  disabled?: boolean
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='h-8 border-dashed'
          disabled={disabled}
          aria-label={title}
        >
          <PlusCircle />
          {title}
          {value !== defaultValue && (
            <>
              <Separator orientation='vertical' className='mx-1 h-4' />
              <Badge
                variant='secondary'
                className='max-w-40 truncate rounded-sm px-1 font-normal'
              >
                {value}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64 p-0' align='start'>
        <Command>
          <CommandInput
            placeholder={`Rechercher : ${title.toLocaleLowerCase('fr')}`}
          />
          <CommandList>
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={option === value ? 'opacity-100' : 'opacity-0'}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
