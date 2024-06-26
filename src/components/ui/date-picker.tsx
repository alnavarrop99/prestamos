import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ComponentProps, forwardRef, useState } from 'react'
import { addDays, format } from 'date-fns'
import { DateRange } from 'react-day-picker'

interface TDatePicker extends ComponentProps<typeof Button> {
  label?: string
  range?: boolean
  date?: Date
  required?: boolean
}

export const DatePicker = forwardRef<HTMLButtonElement, TDatePicker>(function (
  { label, range, date: _date, name, required, ...props },
  ref
) {
  const [date, setDate] = useState<Date | undefined>(_date)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })

  if (range) {
    return (
      <div className={cn('grid gap-2')}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              {...props}
              ref={ref}
              id="date"
              className={cn(
                '!dalay-0 !duration-150 w-full justify-start text-left font-normal ring-ring ring-offset-2 aria-expanded:ring-2',
                !dateRange && 'text-muted-foreground',
                props.className
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'dd-MM-yyyy')} a{' '}
                    {format(dateRange.to, 'dd-MM-yyyy')}
                  </>
                ) : (
                  format(dateRange.from, 'dd-MM-yyyy')
                )
              ) : (
                <span>{label}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <input
          className="hidden"
          required={required}
          type="date"
          name={name}
          value={format(date ?? new Date(), 'yyyy-MM-dd')}
        />
      </div>
    )
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            {...props}
            ref={ref}
            className={cn(
              '!dalay-0 !duration-150 w-full justify-start text-left font-normal ring-ring ring-offset-2 aria-expanded:ring-2',
              !date && 'text-muted-foreground',
              props.className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'dd-MM-yyyy') : <span>{label}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <input
        className="hidden"
        required={required}
        type="date"
        name={name}
        value={format(date ?? new Date(), 'yyyy-MM-dd')}
      />
    </>
  )
})
