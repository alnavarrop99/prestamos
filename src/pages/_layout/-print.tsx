import { forwardRef } from "react"
import brand from '@/assets/menu-brand.avif'
import { credit_print as text } from "@/locale/credit";

interface TPrintCredit
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  client: string
  ssn: string
  telephone: string
  phone: string
  date: string
  pay: number
  mora?: number
  cuoteNumber: number
  pending: number
  comment?: string
}

export const PrintCredit = forwardRef<HTMLDivElement, TPrintCredit>(function (
  {
    client,
    cuoteNumber,
    mora,
    pay,
    date,
    comment,
    pending,
    telephone,
    ssn,
    phone,
  },
  ref
) {
  return (
    <main
      ref={ref}
      className="space-y-3 divide-y-2 divide-gray-900 p-4 py-6 text-sm dark:divide-gray-300 [&>section>p>span]:font-normal [&>section>p>span]:italic [&>section>p]:font-bold"
    >
      <header>
        <img
          alt="brand"
          src={brand}
          className="light:brightness-50 mx-auto grayscale filter dark:brightness-200"
          width={160}
        />
        <h4 className="text-sm font-bold">{text.title + ':'}</h4>
      </header>
      <section>
        <p>
          {text.client + ':'}
          <span>{client + '.'}</span>{' '}
        </p>
        <p>
          {text.ssn + ':'}
          <span>{ssn + '.'}</span>{' '}
        </p>
        <p>
          {text.telephone + ':'}
          <span>{telephone + '.'}</span>{' '}
        </p>
        <p>
          {text.phone + ':'}
          <span>{phone + '.'}</span>{' '}
        </p>
        <p>
          {text.date + ':'}
          <span>{date + '.'}</span>
        </p>
        <p>
          {text.cuoteNumber + ':'}
          <span>{cuoteNumber + '.'}</span>
        </p>
        <p>
          {text.pay + ':'}
          <span> $ {pay + '.'} </span>
        </p>
        {mora && (
          <p>
            {text.mora + ':'}
            <span> $ {mora + '.'}</span>
          </p>
        )}
      </section>
      <section>
        <p>
          {text.pending + ''} <span>$ {pending + '.'}</span>
        </p>
        {comment && (
          <>
            <p>{text.comment + ':'}</p>
            <p className="line-clamp-3 !font-normal italic">{comment}</p>
          </>
        )}
      </section>
      <footer>
        <p className="my-4 ms-auto w-fit italic underline">
          {' '}
          {text.services}{' '}
          <span className="font-bold not-italic">
            {import.meta.env.VITE_NAME}
          </span>
        </p>
      </footer>
    </main>
  )
})
