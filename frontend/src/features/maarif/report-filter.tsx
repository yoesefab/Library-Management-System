import { useState } from 'react'
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
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
          <PlusCircledIcon className='size-4' />
          {title}
          {value !== defaultValue && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
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
      <PopoverContent className='w-50 p-0' align='start'>
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
                  <div
                    className={cn(
                      'flex size-4 items-center justify-center rounded-sm border border-primary',
                      option === value
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <CheckIcon className='size-4 text-background' />
                  </div>
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
            {value !== defaultValue && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className='justify-center text-center'
                    onSelect={() => {
                      onChange(defaultValue)
                      setOpen(false)
                    }}
                  >
                    Effacer le filtre
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
