import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import {
  ErrorComponentProps,
  Navigate,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect, useReducer, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Annoyed, Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { type TUSER_LOGIN, type TUSER_LOGIN_BODY, loginUser } from '@/api/users'
import { useToken } from '@/lib/context/login'
import { BoundleLoader } from '@/components/ui/loader'
import { Separator } from '@radix-ui/react-separator'
import brand from '@/assets/menu-brand.avif'
import { main as text } from '@/assets/locale/login.ts'

export const postCurrentUser = {
  mutationKey: ['login-user'],
  mutationFn: loginUser,
}

export const Route = createFileRoute('/login')({
  component: Login,
  errorComponent: Error,
})

/* eslint-disable-next-line */
interface TStatus {
  password?: boolean
  error?: boolean
}

const reducer: React.Reducer<TStatus, TStatus> = (prev, state) => {
  return { ...prev, ...state }
}

const initUser: TStatus = {
  password: false,
  error: false,
}

/* eslint-disable-next-line */
export function Login() {
  const ref = useRef<HTMLFormElement>(null)
  const [{ error, password }, setStatus] = useReducer(reducer, initUser)
  const { token, setToken } = useToken()

  useEffect(() => {
    document.title = import.meta.env.VITE_NAME + ' | ' + text.browser
  }, [])

  const onSuccess: (
    data: TUSER_LOGIN,
    variables: TUSER_LOGIN_BODY
  ) => unknown = (user, { username }) => {
    toast({
      title: text.notification?.title,
      description: text.notification?.description + ' ' + username,
      variant: !error ? 'default' : 'destructive',
    })

    setToken(user.access_token)
  }

  const onError: (error: Error) => unknown = (error) => {
    const errorMsg: { type: number; msg: string } = JSON.parse(error.message)

    toast({
      title: error.name + ': ' + errorMsg?.type,
      description: (
        <div className="text-sm">
          <p>{errorMsg?.msg}</p>
        </div>
      ),
      variant: 'destructive',
    })
  }
  const { mutate: login, isPending } = useMutation({
    ...postCurrentUser,
    onSuccess,
    onError,
  })

  const onSubmit: React.FormEventHandler = (ev) => {
    if (!ref.current) return

    const { username, password } = Object.fromEntries(
      new FormData(ref.current).entries()
    ) as Record<keyof (TUSER_LOGIN_BODY & { remember: string }), string>

    if (!!username && !!password) {
      login({ username, password })
    }

    ev.preventDefault()
  }

  const onClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setStatus({ password: !password })
  }

  return (
    <>
      {token && <Navigate to={'/'} />}
      <section className="grid min-h-screen place-content-center place-items-center">
        <Card className="w-screen shadow-lg md:w-full">
          <CardHeader>
            <CardTitle>{text.title}</CardTitle>
            <CardDescription>
              <p className="text-base font-bold md:text-lg">
                {text?.description?.[0]}
              </p>
              <p className="text-xs md:block md:text-base">
                {text?.description?.[1]}
              </p>
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>
            <form
              autoFocus={false}
              id="login"
              className="flex flex-col gap-4 [&>label>span]:font-bold [&>label]:space-y-2"
              ref={ref}
              onSubmit={onSubmit}
            >
              <Label>
                <span>{text.username.label}</span>
                <Input
                  required
                  name={'username' as keyof TUSER_LOGIN_BODY}
                  type="text"
                  placeholder={text.username.placeholder}
                />
              </Label>
              <Label>
                {' '}
                <span>{text.password.label}</span>
                <div className="flex items-center gap-x-2">
                  <Input
                    required
                    type={!password ? 'password' : 'text'}
                    name={'password' as keyof TUSER_LOGIN_BODY}
                    placeholder={text.password.placeholder}
                  />
                  <Button
                    type="button"
                    className="w-fit p-1.5"
                    variant={!password ? 'outline' : 'default'}
                    {...{ onClick }}
                  >
                    {!password ? <Eye /> : <EyeOff />}
                  </Button>
                </div>
              </Label>
            </form>
          </CardContent>
          <CardFooter>
            <img alt="brand" src={brand} className="aspect-contain max-h-12" />
            <Button
              type="submit"
              form="login"
              variant="default"
              className="ms-auto"
            >
              {text.login}
              {isPending && <BoundleLoader />}
            </Button>
          </CardFooter>
        </Card>
      </section>
    </>
  )
}

/* eslint-disable-next-line */
export function Error({ error }: ErrorComponentProps) {
  const navigate = useNavigate()
  const [errorMsg, setMsg] = useState<
    { type: number | string; msg?: string } | undefined
  >(undefined)
  useEffect(() => {
    try {
      setMsg(JSON?.parse((error as Error)?.message))
    } catch {
      setMsg({ type: 'Error', msg: (error as Error).message })
    }
  }, [error])
  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    navigate({ to: Route.to })
  }
  return (
    <div className="flex h-[100dvh] flex-col items-center items-center justify-center gap-4 md:flex-row [&>svg]:h-32 [&>svg]:w-32 [&>svg]:stroke-destructive [&_h1]:text-2xl">
      <Annoyed className="animate-bounce" />
      <div className="space-y-2">
        <h1 className="font-bold">{errorMsg?.type}</h1>
        <p className="italic">{errorMsg?.msg}</p>
        <Separator />
        <Button variant="ghost" onClick={onClick} className="text-sm">
          {' '}
          {text.retry + '.'}{' '}
        </Button>
      </div>
    </div>
  )
}

Login.dispalyname = 'Login'
Error.dispalyname = 'LoginError'
