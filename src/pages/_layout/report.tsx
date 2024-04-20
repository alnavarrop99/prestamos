import { getAllReport, typeDataByName, postReportById, type TREPORT_POST_BODY, type TREPORT_PARAMS_DATE_TYPE } from '@/api/report'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@radix-ui/react-label'
import { createFileRoute } from '@tanstack/react-router'
import clsx from 'clsx'
import { Annoyed, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useRef } from 'react'
import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useRouter } from '@tanstack/react-router'
import { queryClient } from '@/pages/__root'

export const getReportsOpt = {
  queryKey: [ "get-reports" ],
  queryFn: getAllReport
}

export const postReportOpt = {
  mutationKey: [ "post-report" ],
  mutationFn: postReportById
}

export const Route = createFileRoute('/_layout/report')({
  component: Report,
  errorComponent: Error,
  pendingComponent: Pending,
  loader: () => queryClient.ensureQueryData( queryOptions( getReportsOpt ) ),
})

const LENGTH = 5

/* eslint-disable-next-line */
export function Report() {
  const { data: reports } = useSuspenseQuery( queryOptions( getReportsOpt ) )
  const form = reports?.map( () => useRef<HTMLFormElement>(null) ) 
  const { mutate: reportById } = useMutation( postReportOpt )

  useEffect( () => {
    document.title = import.meta.env.VITE_NAME + " | " + text.browser
  }, [] )

  const onSubmit: (  index: number  ) => React.FormEventHandler = ( index ) => (ev) =>  {
    if (!form?.[index]) return;

    const items = Object.fromEntries(
      Array.from( new FormData(form?.[index]?.current ?? undefined).entries() )?.map( ([ key, value ], i, list) => {
      if( value === "" ) return [ key, undefined ]
      return list?.[i]
    }) ) as Record<keyof TREPORT_POST_BODY, string>

    reportById({
      code: reports?.[index]?.codigo,
      report: items,
    })

    form?.[index]?.current?.reset()
    ev.preventDefault()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold md:text-3xl">{text.title}</h1>
      <Separator />
      <Accordion className="my-2 space-y-2" type="single">
        {reports.map(({ nombre, parametros, id, comentario}, index) => (
          <AccordionItem
            key={id}
            className={clsx('rounded-m px-4 py-2 shadow-lg hover:shadow-xl bg-card rounded-md')}
            value={'item' + id}
          >
            <AccordionTrigger className="group !no-underline">
              <div className="place-contents-start flex flex-col place-items-start p-2 text-start">
                <p className="text-base md:text-lg font-bold"> {nombre} </p>
                <p className="text-sm md:text-base text-muted-foreground"> {comentario} </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              <form
                ref={form?.[index]}
                onSubmit={onSubmit(index)}
                className="px-1 grid grid-cols-none md:grid-cols-2 gap-4 md:px-4 xl:px-4 py-2 [&>label:last-child]:col-span-full [&>label>span]:font-bold [&>label]:space-y-2"
                id={'report' + id}
              >
                {parametros.map(({ nombre, id, tipo_dato, obligatorio }) => (
                  <Label key={id}>
                    <span>{nombre}:</span>
                    <FormElement required={obligatorio} name={nombre} type={tipo_dato} />
                  </Label>
                ))}
                <Label>
                  <span>{text.comment.label}</span>
                  <Textarea
                    name="Comentario"
                    rows={5}
                    placeholder={text.comment.placeholder}
                  ></Textarea>
                </Label>
              </form>
              <Button
                type="submit"
                form={'report' + id}
                variant="default"
                className=" group ms-auto flex gap-2"
              >
                <Download />
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

function FormElement({
  type,
  name,
  required
}: {
  type: TREPORT_PARAMS_DATE_TYPE
  name?: string
  required?: boolean
}) {
  if (type === 'date')
    return <DatePicker
    required={required}
    label="Seleccione una fecha"
    name={name} 
  />
  return (
    <Input
      type={typeDataByName(type)}
      placeholder="Escriba el parametro"
      name={name}
      required={required}
    />
  )
}

/* eslint-disable-next-line */
export function Pending() {
  return <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className='w-48 h-8' />
        </div>
        <Separator />
        <div className='flex flex-col flex-wrap gap-4 px-2'>
        {Array.from( { length: LENGTH } )?.map( (_, index) => 
          <Card key={index} className='shadow-lg' >
            <CardHeader> <Skeleton className='w-1/4 h-6' /> </CardHeader>
            <CardContent>
              <div className="flex flex-col items-start gap-4">
                <Skeleton className='w-full h-6' /> 
                <Skeleton className='w-full h-6' /> 
                <Skeleton className='w-1/4 h-6' /> 
              </div>
            </CardContent>
          </Card>
          )}
        </div>
    </div>
  </>
}

/* eslint-disable-next-line */
export function Error() {
  const { history } = useRouter()
  const onClick: React.MouseEventHandler< React.ComponentRef< typeof Button > > = () => {
    history.back()
  }
  return <div className='flex items-center h-full [&>svg]:w-32 [&>svg]:stroke-destructive [&>svg]:h-32 items-center justify-center gap-4 [&_h1]:text-2xl'>
      <Annoyed  className='animate-bounce' />
      <div className='space-y-2'>
        <h1 className='font-bold'>{text.error}</h1>
        <p className='italic'>{text.errorDescription}</p>
        <Separator />
        <Button variant="ghost" onClick={onClick} className='text-sm'> {text.back + "."} </Button>
      </div>
    </div>
}

Report.dispalyname = 'Report'
Error.dispalyname = 'ReportError'
Pending.dispalyname = 'ReportPending'

const text = {
  title: 'Reportes:',
  browser: 'Reportes',
  error: 'Ups!!! ha ocurrido un error',
  errorDescription: 'El listado de reportes ha fallado.',
  back: 'Intente volver a la pestaña anterior',
  comment: {
    label: 'Comentario:',
    placeholder: 'Escriba un comentario',
  },
}
