import type { TCREDIT_GET, TCUOTE } from '@/api/credit'
import type { TPAYMENT_GET_BASE } from '@/api/payment'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useStatus } from '@/lib/context/layout'
import { useNavigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Printer } from 'lucide-react'
import { Route } from '@/pages/_layout/credit_/$creditId.lazy'
import { Switch } from '@/components/ui/switch'
import { useScreen } from '@/lib/hook/useScreens'
import { Badge } from '@/components/ui/badge'
import clsx from 'clsx'
import { credit_table as text } from '@/locale/credit'

/* eslint-disable-next-line */
type TData = {
  payment: TPAYMENT_GET_BASE
  cuote: TCUOTE
}

/* eslint-disable-next-line */
type TPaymentTable = {
  table: TData[]
  credit: TCREDIT_GET
}

/* eslint-disable-next-line */
export function PaymentTable({ table, credit }: TPaymentTable) {
  const { open, setOpen } = useStatus()
  const navigate = useNavigate()
  const screen = useScreen()

  const onPrint: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    if (!open) {
      navigate({ to: Route.to })
    }
    setOpen({ open: !open })
  }

  if (screen !== 'lg')
    return (
      <Table>
        <TableBody className="divide-y-2">
          {table?.map(({ payment, cuote }, index) => (
            <Table key={index}>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className={clsx(
                      'flex items-stretch justify-between gap-2 bg-muted [&>*]:flex [&>*]:items-center',
                      { 'rounded-t-xl': index === 0 }
                    )}
                  >
                    <p className='font-bold before:font-bold before:text-destructive before:content-["_-_"]'>
                      {' '}
                      {format(new Date(cuote?.fecha_de_pago), 'dd/MM/yyyy') +
                        '.'}
                    </p>
                    <div className="justify-end gap-2">
                      <Badge>{index + 1}</Badge>
                      <Switch
                        checked={cuote?.pagada}
                        className={'cursor-not-allowed'}
                      ></Switch>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell className="flex flex-col items-stretch gap-2 px-8">
                    <ul className="flex list-outside list-disc flex-col !items-start">
                      <li className='before:font-bold before:text-success before:content-["_+_"]'>
                        <b>{text.payDate + ':'}</b>{' '}
                        {format(
                          new Date(payment?.fecha_de_pago),
                          'dd/MM/yyyy'
                        ) + '.'}
                      </li>

                      <li>
                        <b>{text.payValue + ':'}</b> ${' '}
                        {Math.ceil(payment?.valor_del_pago) + '.'}
                      </li>

                      {cuote?.valor_de_mora > 0 && (
                        <li>
                          <b>{text.installmentsDate + ':'}</b>{' '}
                          {format(
                            new Date(cuote?.fecha_de_aplicacion_de_mora),
                            'dd/MM/yyyy'
                          ) + '.'}
                        </li>
                      )}

                      {cuote?.valor_de_mora > 0 && (
                        <li>
                          <b>{text.payInstallments + ':'}</b> ${' '}
                          {Math.ceil(cuote?.valor_de_mora) + '.'}
                        </li>
                      )}
                    </ul>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow className="[&>*]:rounded-bl-xl">
            <TableCell className="flex justify-between font-bold">
              <p>{text.total + ':'}</p>
              <GetPay credit={credit} />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

  return (
    <Table>
      <TableHeader className="[&_th]:text-center">
        <TableRow className="bg-muted [&>*:first-child]:rounded-tl-xl [&>*:last-child]:rounded-tr-xl">
          <TableHead></TableHead>
          <TableHead>{text.payDate}</TableHead>
          <TableHead>{text.payValue}</TableHead>
          <TableHead>{text.installmentsDate}</TableHead>
          <TableHead>{text.payInstallments}</TableHead>
          <TableHead>{text.payStatus}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="[&_td>*]:text-center">
        {table?.map(({ payment, cuote }, index) => (
          <TableRow key={index} className="group">
            <TableCell className="relative flex w-20 items-center justify-center">
              <p className="trasition h-full font-bold opacity-100 delay-150 duration-300 xl:group-hover:opacity-0">
                {index + 1}
              </p>
              <Link
                to={'./print'}
                search={{ index }}
                className="z-index absolute hidden xl:block"
              >
                <Button
                  onClick={onPrint}
                  variant="ghost"
                  className="opacity-0 hover:ring hover:ring-primary group-hover:opacity-100"
                  disabled={credit?.pagos?.length <= 0}
                >
                  <Printer />
                </Button>
              </Link>
            </TableCell>
            <TableCell>
              <ul>
                <li className='before:font-bold before:text-destructive before:content-["_-_"]'>
                  {format(new Date(cuote?.fecha_de_pago), 'dd/MM/yyyy')}
                </li>
                <li className='before:font-bold before:text-success before:content-["_+_"]'>
                  {format(new Date(payment?.fecha_de_pago), 'dd/MM/yyyy')}
                </li>
              </ul>
            </TableCell>
            <TableCell>
              <p>${Math.ceil(payment?.valor_del_pago)}</p>
            </TableCell>
            <TableCell>
              <p>
                {cuote?.valor_de_mora > 0
                  ? format(
                      new Date(cuote?.fecha_de_aplicacion_de_mora),
                      'dd/MM/yyyy'
                    )
                  : '-'}
              </p>
            </TableCell>
            <TableCell>
              <p>
                {cuote?.valor_de_mora > 0 ? (
                  <>$ {Math.ceil(cuote?.valor_de_mora)}</>
                ) : (
                  '-'
                )}
              </p>
            </TableCell>
            <TableCell className="flex justify-center">
              <Switch
                checked={cuote?.pagada}
                className={'cursor-not-allowed'}
              ></Switch>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow className="[&>*:first-child]:rounded-bl-xl [&>*:last-child]:rounded-br-xl">
          <TableCell colSpan={5} className="font-bold">
            <p>{text.total + ':'}</p>
          </TableCell>
          <TableCell colSpan={2} className="text-right">
            <GetPay credit={credit} />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

/* eslint-disable-next-line */
function GetPay({ credit }: { credit: TCREDIT_GET }) {
  if (!credit.cuotas || !credit.pagos) return

  return (
    <p>
      $
      {Math.ceil(
        credit.pagos
          .map(({ valor_del_pago }) => valor_del_pago)
          .reduce((prev, acc) => (acc += prev))
      )}
      <b>&#8193;/&#8193;</b>${credit?.monto}
    </p>
  )
}
