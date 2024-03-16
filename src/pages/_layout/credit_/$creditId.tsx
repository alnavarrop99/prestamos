import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { type TCredit, getCreditIdRes } from "@/api/credit";
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { CircleDollarSign as Pay } from 'lucide-react'

export const Route = createFileRoute('/_layout/credit/$creditId')({
  component: CreditById,
  loader: getCreditIdRes
})

/* eslint-disable-next-line */
interface TCreditByIdProps {
  credit?: TCredit,
  open?: boolean
}

/* eslint-disable-next-line */
export function CreditById({ children, open: _open = false, credit: _credit = {} as TCredit }: React.PropsWithChildren<TCreditByIdProps>) {
  const credit = Route.useLoaderData() ?? _credit
  const [ open, setOpen ] = useState<boolean>(_open)

  const onOpenChange = (checked: boolean) => {
    setOpen( checked ) 
  }

  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <h1 className='text-3xl font-bold'>{ text.title }</h1>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger className='ms-auto' asChild>
            <Link to={'./new'}>
              <Button variant="ghost" > <Printer /> </Button>
            </Link>
          </DialogTrigger>

          <DialogTrigger asChild>
            <Link to={'./pay'}>
              <Button variant="default" className={clsx('hover:bg-green-700')}> <Pay /> </Button>
            </Link>
          </DialogTrigger>

          <DialogTrigger asChild>
            <Link to={'./update'}>
              <Button> {text.button.update} </Button>
            </Link>
          </DialogTrigger>

          <DialogTrigger asChild>
            <Link to={'./print'}>
              <Button className='hover:bg-destructive'> {text.button.delete} </Button>
            </Link>
          </DialogTrigger>

          {children ?? <Outlet />}
        </Dialog>

      </div>
      <Separator />
      <h2 className='text-2xl font-bold'> {text.details.title} </h2>
      <div className='px-2 flex gap-2 flex-col [&>div]:flex [&>div]:gap-2'>
        <div> <b>{text.details.id}:</b> { credit?.id  + "."}</div> 
        <div> <b>{text.details.amount}:</b> { "$" + credit?.cantidad + "." }</div> 
        <div> <b>{text.details.porcentage}:</b> { credit?.porcentaje + "%" }</div> 
        <div> <b>{text.details.frecuency}:</b> { credit?.frecuencia_del_credito?.nombre  + "."}</div> 
        <div> <b>{text.details.status}:</b> <Switch className={clsx({"cursor-not-allowed": true })} checked={credit?.estado}>{ credit?.estado }</Switch></div> 
        <div> <b>{text.details.date}:</b> { credit?.fecha_de_aprobacion  + "."}</div> 
        <div> <b>{text.details.comment}:</b> { credit?.comentario }</div> 
        <div> <b>{text.details.cuotes}:</b> { credit?.numero_de_cuotas  + "."}</div> 
        <div> <b>{text.details.aditionalsDays}:</b> { credit?.dias_adicionales  + "."}</div> 
      </div>
      <Separator />
      {credit?.cuotas && <h2 className='text-2xl font-bold'> {text.cuotes.title} </h2>}
      { credit?.cuotas && <Table className='w-fit px-4 py-2'>
        <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>{text.cuotes.payDate}</TableHead>
          <TableHead>{text.cuotes.installmantsDate}</TableHead>
          <TableHead>{text.cuotes.payValue}</TableHead>
          <TableHead>{text.cuotes.payCuote}</TableHead>
          <TableHead>{text.cuotes.payInstallmants}</TableHead>
          <TableHead>{text.cuotes.payStatus}</TableHead>
        </TableRow>
      </TableHeader>
        <TableBody>
        {credit?.cuotas.map(( cuota ) =>
          <TableRow key={cuota?.id}> 
            <TableCell> {cuota?.id} </TableCell>
            <TableCell> {cuota?.fecha_de_pago} </TableCell>
            <TableCell> {cuota?.fecha_de_aplicacion_de_mora} </TableCell>
            <TableCell> <b>$</b>{cuota?.valor_pagado} </TableCell>
            <TableCell> <b>$</b>{cuota?.valor_de_cuota} </TableCell>
            <TableCell> <b>$</b>{cuota?.valor_de_mora} </TableCell>
            <TableCell> <Switch checked={cuota?.pagada} className={clsx("cursor-not-allowed")}></Switch> </TableCell>
          </TableRow>
        )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className='font-bold'>{text.cuotes.total}:</TableCell>
            <TableCell colSpan={2} className="text-right"> <Badge> $ { credit?.cuotas?.reduce( (prev, acc) => acc = ({...acc , valor_pagado: (prev?.valor_pagado  + acc?.valor_pagado )}) )?.valor_pagado.toFixed(2) } </Badge> </TableCell>
        </TableRow>
        </TableFooter>
      </Table>}
    </div>
  )
}

CreditById.dispalyname = 'CreditById'

const text = {
  title: 'Detalles:',
  button: {
    update: "Editar",
    delete: "Eliminar",
  },
  details: {
    title: "Detalles del prestamo:",
    id: "Numero del credito",
    amount: "Monto total",
    porcentage: "Porcentaje actual",
    frecuency: "Frecuencia del credito",
    status: "Estado",
    date: "Fecha de aprobacion",
    comment: "Comentario",
    cuotes: "Numero de cuotas",
    aditionalsDays: "Dias adicionales",
  },
  cuotes: {
    title: "Historial de pagos:",
    payDate: "Fecha de pago",
    installmantsDate: "Fecha de mora",
    payValue: "Valor del pago",
    payCuote: "Valor de la cuota",
    payInstallmants: "Valor de mora",
    payStatus: "Pagada",
    total: "Monto",
  },
  pay: {
    title: "Historial de pagos:"
  }
}
