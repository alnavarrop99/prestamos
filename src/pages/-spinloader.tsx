import { Input } from '@/components/ui/input'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { memo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getUsersListOpt } from '@/pages/_layout/user.lazy'
import {
  getUserByIdOpt,
  updateUserByIdOpt,
} from '@/pages/_layout/user/$userId/update'
import { postUserOpt } from '@/pages/_layout/user/new'
import { getClientListOpt } from '@/pages/_layout/client.lazy'
import {
  getClientByIdOpt,
  updateClientByIdOpt,
} from '@/pages/_layout/client/$clientId/update'
import { postClientOpt } from '@/pages/_layout/client/new'
import { deleteClientByIdOpt } from '@/pages/_layout/client/$clientId/delete'
import { getCreditsListOpt } from '@/pages/_layout/credit.lazy'
import { postCreditOpt } from '@/pages/_layout/credit/new'
import {
  deletePaymentByIdOpt,
  updateCreditByIdOpt,
  updatePaymentByIdOpt,
} from '@/pages/_layout/credit_/$creditId_/update.confirm'
import { deleteCreditByIdOpt } from '@/pages/_layout/credit_/$creditId/delete'
import { postPaymentOpt } from '@/pages/_layout/credit_/$creditId/pay'
import { getCreditByIdOpt } from '@/pages/_layout/credit_/$creditId.lazy'
import { getReportsOpt, postReportOpt } from '@/pages/_layout/report.lazy'
import { SpinLoader as Loader } from '@/components/ui/loader'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { translate } from '@/lib/route'
import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import brand from '@/assets/menu-brand.avif'
import { loader as text } from '@/locale/layout'

/* eslint-disable-next-line */
type TSpinLoader = {
  rchild?: string
  value?: string
  onChange: React.ChangeEventHandler<React.ComponentRef<typeof Input>>
}

/* eslint-disable-next-line */
export const SpinLoader = memo<TSpinLoader>(function ({
  onChange,
  rchild,
  value,
}) {
  const [menu, setMenu] = useState<boolean>(false)

  const onOpenChange = (open: boolean) => {
    setMenu(open)
  }

  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    setMenu(!menu)
  }

  const onSearch: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    if (!value || value === '') return
    setMenu(!menu)
  }

  const onKeyDown: React.KeyboardEventHandler<
    React.ComponentRef<typeof Input>
  > = (ev) => {
    const key = ev.key
    if (key === 'Enter') setMenu(!menu)
  }

  const getUser = useIsFetching({
    fetchStatus: 'fetching',
    type: 'inactive',
    stale: true,
    queryKey: ([] as string[]).concat(getUsersListOpt.queryKey),
  })

  const userId = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(
      getUserByIdOpt({ userId: '' }).queryKey[0] as string
    ),
  })

  const postUser = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(postUserOpt.mutationKey),
  })

  const updateUser = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(updateUserByIdOpt?.mutationKey),
  })

  const getClient = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(getClientListOpt.queryKey),
  })

  const clientId = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(
      getClientByIdOpt({ clientId: '' }).queryKey[0] as string
    ),
  })

  const postClient = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(postClientOpt.mutationKey),
  })

  const updateClient = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(updateClientByIdOpt?.mutationKey),
  })

  const deleteClient = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(deleteClientByIdOpt?.mutationKey),
  })

  const getCredit = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(getCreditsListOpt.queryKey),
  })

  const creditId = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(
      getCreditByIdOpt({ creditId: '' }).queryKey[0] as string
    ),
  })

  const postCredit = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(postCreditOpt.mutationKey),
  })

  const updateCredit = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(updateCreditByIdOpt?.mutationKey),
  })

  const deleteCredit = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(deleteCreditByIdOpt?.mutationKey),
  })

  const postPayment = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(postPaymentOpt.mutationKey),
  })

  const updatePayment = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(updatePaymentByIdOpt?.mutationKey),
  })

  const deletePayment = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(deletePaymentByIdOpt?.mutationKey),
  })

  const getReports = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(getReportsOpt.queryKey),
  })

  const postReport = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(postReportOpt.mutationKey),
  })

  const className =
    'text-muted-foreground italic text-xs flex items-center gap-2'

  if (getUser || userId) {
    return (
      <span className={className}>
        <Loader /> {text.user.get}
      </span>
    )
  } else if (postUser) {
    return (
      <span className={className}>
        <Loader /> {text.user.new}{' '}
      </span>
    )
  } else if (updateUser) {
    return (
      <span className={className}>
        <Loader /> {text.user.update}{' '}
      </span>
    )
  }

  if (getClient || clientId) {
    return (
      <span className={className}>
        <Loader /> {text.client.get}
      </span>
    )
  } else if (postClient) {
    return (
      <span className={className}>
        <Loader /> {text.client.new}{' '}
      </span>
    )
  } else if (updateClient) {
    return (
      <span className={className}>
        <Loader /> {text.client.update}{' '}
      </span>
    )
  } else if (deleteClient) {
    return (
      <span className={className}>
        <Loader /> {text.client.delete}{' '}
      </span>
    )
  }

  if (getCredit || creditId) {
    return (
      <span className={className}>
        <Loader /> {text.credit.get}
      </span>
    )
  } else if (postCredit) {
    return (
      <span className={className}>
        <Loader /> {text.credit.new}{' '}
      </span>
    )
  } else if (updateCredit) {
    return (
      <span className={className}>
        <Loader /> {text.credit.update}{' '}
      </span>
    )
  } else if (deleteCredit) {
    return (
      <span className={className}>
        <Loader /> {text.credit.delete}{' '}
      </span>
    )
  }

  if (postPayment) {
    return (
      <span className={className}>
        <Loader /> {text.payment.new}{' '}
      </span>
    )
  } else if (updatePayment) {
    return (
      <span className={className}>
        <Loader /> {text.payment.update}{' '}
      </span>
    )
  } else if (deletePayment) {
    return (
      <span className={className}>
        <Loader /> {text.payment.delete}{' '}
      </span>
    )
  }

  if (getReports) {
    return (
      <span className={className}>
        <Loader /> {text.report.get}{' '}
      </span>
    )
  } else if (postReport) {
    return (
      <span className={className}>
        <Loader /> {text.report.post}{' '}
      </span>
    )
  }

  return (
    <Popover open={menu} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild className="xl:hidden">
        <img alt="brand" src={brand} className={clsx('aspect-contain h-12')} />
      </PopoverTrigger>
      <PopoverContent className="min-sm:rounded-t-none w-screen space-y-2 shadow-xl md:mx-4 md:mt-4 md:w-[96dvw]">
        <Label className="flex items-center gap-2 px-4 md:hidden">
          <Input
            type="search"
            placeholder={text.search.placeholder({
              pathname: rchild,
            })}
            onChange={onChange}
            value={value}
            onKeyDown={onKeyDown}
          />
          <Button
            variant="outline"
            className="duration-450 px-2 opacity-100 transition delay-300 group-hover:invisible group-hover:opacity-0 xl:hidden"
            onClick={onSearch}
          >
            <Search />
          </Button>
        </Label>
        <Separator className="my-2" />
        <ul className="space-y-3 px-4 md:px-20 [&_button]:w-full">
          {Object.entries(translate())
            ?.filter(([, { validation }]) => validation)
            ?.map(([url, { name: title, icon: Icon }], index) => {
              return (
                <li key={index}>
                  <Link to={url}>
                    {({ isActive }) => (
                      <Button
                        onClick={onClick}
                        variant={!isActive ? 'link' : 'default'}
                        className={clsx(
                          'delay-50 flex justify-start gap-2 font-bold  duration-300 md:justify-center'
                        )}
                      >
                        <Icon />
                        {title}
                      </Button>
                    )}
                  </Link>
                </li>
              )
            })}
        </ul>
      </PopoverContent>
    </Popover>
  )
})

export default SpinLoader
