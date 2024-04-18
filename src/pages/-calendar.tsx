import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import { Link } from "@tanstack/react-router"
import clsx from "clsx"
import { format } from "date-fns"

/* eslint-disable-next-line */
type TType = 'mora' | 'warning'

/* eslint-disable-next-line */
export type TData = {
  type: TType
  creditId: number
  client: string
  cuete: number
}

/* eslint-disable-next-line */
export type TDaysProps = { [date: string]: TData }

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
            <b>{text.title({ type: credit.type })}</b>
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

export { HoverDate }

const text = {
  title: ({ type }: { type: TType }) =>
    'Credito ' + (type === 'warning' ? 'Pendiente' : 'en Mora'),
  list: {
    client: 'Cliente',
    ammount: 'Numero de cuota',
  },
}
