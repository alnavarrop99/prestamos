import { getAllReport, type TREPORT_GET_ALL, typeDataByName, postReportById, TREPORT_POST_BODY, TREPORT_PARAMS_DATE_TYPE } from '@/api/report'
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
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'


export const Route = createFileRoute('/_layout/report')({
  component: Report,
  loader: getAllReport,
})

/* eslint-disable-next-line */
interface TReportProps {
  reports?: TREPORT_GET_ALL
}

/* eslint-disable-next-line */
export function Report({ reports: _reports = [] as TREPORT_GET_ALL }: TReportProps) {
  const reports = Route.useLoaderData() ?? _reports
  const form = reports?.map( () => useRef<HTMLFormElement>(null) ) 
  const { mutate: reportById } = useMutation({
    mutationKey: ["post-reports-by-id"],
    mutationFn: postReportById
  })

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
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{text.title}</h1>
      <Separator />
      <Accordion className="my-2 space-y-2" type="multiple">
        {reports.map(({ nombre, parametros, id, comentario}, index) => (
          <AccordionItem
            key={id}
            className={clsx('rounded-m px-4 py-2 shadow-lg hover:shadow-xl')}
            value={'item' + id}
          >
            <AccordionTrigger className="group !no-underline">
              <div className="place-contents-start flex flex-col place-items-start p-2 text-start">
                <p className="text-lg font-bold"> {nombre} </p>
                <p className="text-md text-muted-foreground"> {comentario} </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              <form
                ref={form?.[index]}
                onSubmit={onSubmit(index)}
                className="grid grid-cols-2 gap-4 px-6 py-2 [&>label:last-child]:col-span-full [&>label>span]:font-bold [&>label]:space-y-2"
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
    return <DatePicker required={required} label="Seleccione una fecha" name={name} />
  return (
    <Input
      type={typeDataByName(type)}
      placeholder="Escriba el parametro"
      name={name}
      required={required}
    />
  )
}

Report.dispalyname = 'Report'

const text = {
  title: 'Reportes:',
  browser: 'Reportes',
  comment: {
    label: 'Comentario:',
    placeholder: 'Escriba un comentario',
  },
}
