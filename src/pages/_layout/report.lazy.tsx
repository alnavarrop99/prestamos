import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { getAllReport, typeDataByName, postReportById, type TREPORT_POST_BODY, type TREPORT_PARAMS_DATE_TYPE, type TREPORT_POST } from '@/api/report'
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
import { Annoyed, Download, PlusSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useRouter } from '@tanstack/react-router'
import { queryClient } from '@/pages/__root'
import { ErrorComponentProps } from '@tanstack/react-router'
import { main as text } from "@/locale/report.ts"
import { SpinLoader } from '@/components/ui/loader';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

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
  const [ action, setAction ] = useState<{[ k: number ]: boolean}>( Object.fromEntries( reports?.map<[number, boolean]>( (_, i) => ([ i, false ]) ) ) )
  const [ res, setRes ] = useState< unknown[] >([])

  const { mutate: reportById, isSuccess, isError, isPending, failureReason } = useMutation( {...postReportOpt} )
  useEffect( () => {
    document.title = import.meta.env.VITE_NAME + " | " + text.browser
  }, [] )

  const onSubmit: (  index: number  ) => React.FormEventHandler = ( index ) => async (ev) =>  {
    if (!form?.[index] || !reports?.[index]) return;

    const items = Object.fromEntries(
      Array.from( new FormData(form?.[index]?.current ?? undefined).entries() )?.map( ([ key, value ], i, list) => {
      if( value === "" ) return [ key, undefined ]
      return list?.[i]
    }) ) as Record<keyof TREPORT_POST_BODY, string>

    const onSuccess: ((data: TREPORT_POST, variables: { code: string; report: TREPORT_POST_BODY; }, context: unknown) => void) = (data) => {
      if( !data?.resultados?.length ) {
          toast({
          title: text[404].title,
          description: (
            <div className="text-sm">
              <p>{ text[404].description }</p>
            </div>
          ),
          variant: 'destructive',
       })
        return;
      }
      setRes( data?.resultados )
      setAction( {...action, [index]: true })
    }
    const onError = () => {
      setAction( {...action, [index]: false })
      setRes([])
    }

    reportById({
      code: reports?.[index]?.codigo,
      report: items,
    }, {
      onSuccess,
      onError
    })

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
                autoFocus={false}
                ref={form?.[index]}
                onSubmit={onSubmit(index)}
                className="p-1 grid grid-cols-none md:grid-cols-2 gap-4 md:px-4 xl:px-4 py-2 [&>label:last-child]:col-span-full [&>label>span]:font-bold [&>label]:space-y-2"
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
                  />
                </Label>
              </form>
              <div className="flex gap-1 justify-end">
                <Button
                  type={"submit"}
                  form={'report' + id}
                  variant="default"
                >
                  <PlusSquare />
                </Button>
                { action?.[index] && <Button
                  type={"button"}
                  variant="link"
                >
                  <PDFDownloadLink document={<MyDocument codigo={ nombre } resultado={ res } />} fileName={nombre + " " + format(new Date(), "yyyy-MM-dd")}>
                    {({ loading, error: _error }) => {
                       const error = failureReason ?? _error
                       if( error || isError ) toast({
                          title: error?.name,
                          description: (
                            <div className="text-sm">
                              <p>{error?.message}</p>
                            </div>
                          ),
                          variant: 'destructive',
                       })
                       if( loading || isPending ) return <SpinLoader />
                       return isSuccess && action?.[index] && <Download />
                    }
                  }
                  </PDFDownloadLink>
                </Button> }
              </div>
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
export function Error({ error }: ErrorComponentProps) {
  const [ errorMsg, setMsg ] = useState<{ type: number | string; msg?: string } | undefined>( undefined )
  useEffect( () => {
    try{
      setMsg(JSON?.parse((error as Error)?.message))
    }
    catch{
      setMsg({ type: "Error", msg: (error as Error).message })
    }
  }, [error] )
  const { history } = useRouter()
  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    history.back()
  }
  return (
    <div className="flex xl:h-full h-[80dvh] flex-col items-center items-center justify-center gap-4 md:flex-row [&>svg]:h-32 [&>svg]:w-32 [&>svg]:stroke-destructive [&_h1]:text-2xl">
      <Annoyed className="animate-bounce" />
      <div className="space-y-2">
        <h1 className="font-bold">{errorMsg?.type}</h1>
        <p className="italic">{errorMsg?.msg}</p>
        <Separator />
        <Button variant="ghost" onClick={onClick} className="text-sm">
          {' '}
          {text.back + '.'}{' '}
        </Button>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  section: {
    margin: 5,
    padding: 5,
    fontSize: 10
  },
  title: {
    margin: 10,
    padding: 10,
    paddingLeft: 20,
    fontSize: 16,
    textAlign: "justify"
  },
  footer: {
    padding: 8,
    margin: 8,
    fontSize: 10,
    textAlign: "justify"
  }
});

const MyDocument = ({ resultado, codigo }: {resultado: unknown[], codigo?: string}) => {
 return <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.title}>
        <Text style={{fontWeight: "bold"}}>{ text.doc.title + ":"} {codigo}</Text>
      </View>
      <View>
        { resultado?.map( ( items, i ) => {
          if( typeof items === "object" && !!items ) return <View style={styles.section}> <PrintDoc items={items} /> </View>
          if( typeof items === "string" && !!items ) return <Text key={i}>{ items }</Text>
        })}
      </View>
      <View style={styles.footer}>
        <Text> {text.doc.date + ":"} { format( new Date(), "dd-MM-yyyy" ) } </Text>
      </View>
    </Page>
  </Document>
};

const PrintDoc = ( { items, margin = 5 }: { items: object, margin?: number } ) => {
  return <> { Object.entries(items)?.map( ( [ name, value ], i ) => {
    if( typeof items === value ) return <PrintDoc items={value} margin={margin * i} />
    return <Text key={i} style={ { paddingLeft: margin } } > {name}: {value} </Text> 
  })} </>
}

Report.dispalyname = 'Report'
Error.dispalyname = 'ReportError'
Pending.dispalyname = 'ReportPending'
