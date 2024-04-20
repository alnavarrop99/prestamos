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
import { Route } from '@/pages/_layout/credit_/$creditId'
import { Switch } from '@radix-ui/react-switch'

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

  const onPrint: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    if (!open) {
      navigate({ to: Route.to })
    }
    setOpen({ open: !open })
  }
  return (
    <Table className="hidden rounded-xl bg-background xl:table">
      <TableHeader className="bg-muted [&_th]:text-center">
        <TableRow>
          <TableHead></TableHead>
          <TableHead>{text.payDate}</TableHead>
          <TableHead>{text.payValue}</TableHead>
          <TableHead>{text.installmantsDate}</TableHead>
          <TableHead>{text.payInstallmants}</TableHead>
          <TableHead>{text.payStatus}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="[&_td>*]:text-center">
        {table?.map(({ payment, cuote }, index) => (
          <TableRow key={index} className="group">
            <TableCell className="relative flex w-20 items-center justify-center">
              <p className="trasition h-full font-bold opacity-100 delay-150 duration-300 group-hover:opacity-0">
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
              <p>
                <b>$</b>
                {payment?.valor_del_pago?.toFixed(2)}
              </p>
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
                  <>
                    <b>$</b> {cuote?.valor_de_mora?.toFixed(2)}
                  </>
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
        <TableRow>
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
      <b>$</b>
      {credit.pagos
        .map(({ valor_del_pago }) => valor_del_pago)
        .reduce((prev, acc) => (acc += prev))
        ?.toFixed(2)}
      <b>&#8193;/&#8193;</b>
      <b>$</b>
      {credit?.monto}
    </p>
  )
}

const text = {
  payDate: 'Fecha de pago',
  installmantsDate: 'Fecha de aplicacion de mora',
  payValue: 'Monto del pago',
  payInstallmants: 'Monto de la mora',
  payStatus: 'Pagada',
  total: 'Monto total',
}
