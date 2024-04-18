import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { format } from 'date-fns'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card'
import clsx from 'clsx'
import { Link } from '@tanstack/react-router'
import { Badge } from './badge'
import { Separator } from '@radix-ui/react-separator'

/* eslint-disable-next-line */
export type TData = {
  type: TType
  creditId: number
  client: string
  cuete: number
}

/* eslint-disable-next-line */
export type TDaysProps = { [date: string]: TData }

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  days?: TDaysProps
}
type TType = 'mora' | 'warning'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  days,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: (props) => <ChevronLeft {...props} className="h-4 w-4" />,
        IconRight: (props) => <ChevronRight {...props} className="h-4 w-4" />,
        Day: ({ date }) => (
          <HoverDate credit={days?.[format(date, 'dd-MM-yyyy')]} date={date} />
        ),
      }}
      {...props}
    />
  )
}

/* eslint-disable-next-line */
interface THoverDate {
  date: Date
  credit?: TData
}

/* eslint-disable-next-line */
function HoverDate({ date, credit }: THoverDate) {
  if (!credit)
    return <span className="!font-normal"> {format(date, 'dd')} </span>
  return (
    <HoverCard>
      <HoverCardTrigger
        className={clsx('cursor-pointer', {
          "font-bold text-destructive after:content-['*']":
            credit.type === 'mora',
          "font-bold text-primary before:content-['-'] after:content-['-']":
            credit.type === 'warning',
        })}
      >
        <Link
          className="hover:underline"
          to={'/credit/$creditId'}
          params={{ creditId: credit?.creditId }}
        >
          {' '}
          {format(date, 'dd')}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-[15rem] space-y-2 rounded-sm p-2">
        <div className="space-x-2 align-middle">
          <Link
            className="hover:underline"
            to={'/credit/$creditId'}
            params={{ creditId: credit?.creditId }}
          >
            {' '}
            {text.title({ type: credit.type })}
          </Link>
          <Badge>{credit.creditId}</Badge>
        </div>
        <Separator />
        <ul className="[&>*]:text-start [&>li]:line-clamp-1">
          <li>
            {' '}
            <b>{text.list.client + ':'}</b> {credit.client}{' '}
          </li>
          <li>
            {' '}
            <b>{text.list.ammount + ':'}</b> {credit.cuete}{' '}
          </li>
        </ul>
      </HoverCardContent>
    </HoverCard>
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }

const text = {
  title: ({ type }: { type: TType }) =>
    'Credito ' + (type === 'warning' ? 'Pendiente' : 'en Mora'),
  list: {
    client: 'Cliente',
    ammount: 'Numero de cuota',
  },
}
