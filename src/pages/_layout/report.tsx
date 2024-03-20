import { type TReport, getReportsRes, getTypeElementForm } from '@/api/report'
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
import { useRef } from 'react'

export const Route = createFileRoute('/_layout/report')({
  component: Report,
  loader: getReportsRes,
})

/* eslint-disable-next-line */
interface TReportProps {
  reports?: TReport[]
}

/* eslint-disable-next-line */
export function Report({ reports: _reports = [] as TReport[] }: TReportProps) {
  const reports = Route.useLoaderData() ?? _reports
  const form = useRef<HTMLFormElement>(null)

  const onSubmit: React.FormEventHandler = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      new FormData(form.current).entries()
    ) as Record<keyof string, string>

    console.table(items)

    form.current?.reset()
    ev.preventDefault()
  }

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{text.title}</h1>
      <Separator />
      <Accordion className="my-2 space-y-2" type="multiple">
        {reports.map(({ nombre, parametros, id, comentario }) => (
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
                ref={form}
                onSubmit={onSubmit}
                className="grid grid-cols-2 gap-4 px-6 py-2 [&>label:last-child]:col-span-full [&>label>span]:font-bold [&>label]:space-y-2"
                id={'report' + id}
              >
                {parametros.map(({ nombre, id, tipo_dato }) => (
                  <Label key={id}>
                    <span>{nombre}:</span>
                    <FormElement name={nombre} type={tipo_dato} />
                  </Label>
                ))}
                <Label>
                  <span>{text.comment}</span>
                  <Textarea
                    name="comentario"
                    rows={5}
                    placeholder={'Escriba un comentario'}
                  >
                    {' '}
                  </Textarea>
                </Label>
              </form>
              <Button
                type="submit"
                form={'report' + id}
                variant="default"
                className=" group ms-auto flex gap-2 transition delay-150 duration-500"
              >
                {' '}
                <Download />{' '}
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
}: {
  type: 'fecha' | 'texto' | 'numero' | 'like'
  name?: string
}) {
  if (type === 'fecha')
    return <DatePicker label="Seleccione una fecha" name={name} />
  return (
    <Input
      type={getTypeElementForm(type)}
      placeholder="Escriba el parametro"
      name={name}
    />
  )
}

Report.dispalyname = 'Report'

const text = {
  title: 'Reportajes:',
  comment: 'Comentario:',
}
