import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useEffect, useReducer, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Eye, EyeOff } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useMutation } from '@tanstack/react-query'
import { type TUSER_LOGIN, type TUSER_LOGIN_BODY, loginUser } from '@/api/users'
import { useToken } from '@/lib/context/login'

export const postCurrentUser = {
  mutationKey: ["login-user"],
  mutationFn: loginUser,
}

export const Route = createFileRoute('/login')({
  component: Login,
})

/* eslint-disable-next-line */
interface TStatus {
  password?: boolean; 
  error?: boolean
}

/* eslint-disable-next-line */
interface TLoginProps { }

const reducer: React.Reducer<TStatus, TStatus> = (prev, state) => {
  return { ...prev, ...state }
}

const initUser: TStatus = {
  password: false,
  error: false,
}

/* eslint-disable-next-line */
export function Login({}: TLoginProps) {
  const ref = useRef<HTMLFormElement>(null)
  const [{ error, password }, setStatus] = useReducer(reducer, initUser)
  const { token, setToken } = useToken()

  useEffect( () => {
    document.title = import.meta.env.VITE_NAME + " | " + text.browser
  }, [] )

  const onSuccess: (data: TUSER_LOGIN) => unknown = ( user ) => {
    setToken(user.access_token)
  }
  const { mutate: login } = useMutation({
    ...postCurrentUser,
    onSuccess
  })

  const onSubmit: React.FormEventHandler = (ev) => {
    if (!ref.current) return

    const { username, password } = Object.fromEntries(
      new FormData(ref.current).entries()
    ) as Record<keyof (TUSER_LOGIN_BODY & {remember: string}), string>

    if (!!username && !!password) {
      login({ username, password })
      toast({
        title: text.notification?.success.title,
        description: text.notification?.success.description({ username }),
        variant: !error ? 'default' : 'destructive',
      })
    }

    ev.preventDefault()
  }

  const onClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setStatus({ password: !password })
  }

  return (
    <>
    { token && <Navigate to={"/"} />}
    <section className="grid min-h-screen place-content-center place-items-center">
      <Card className="inline-block shadow-lg">
        <CardHeader>
          <CardTitle>{text.title}</CardTitle>
          <CardDescription>
            <p className="text-lg font-bold">{text?.description?.[0]}</p>
            <p>{text?.description?.[1]}</p>
          </CardDescription>
        </CardHeader>
        <CardContent >
          <form
            id="login"
            className="flex flex-col gap-4 [&>label>span]:font-bold"
            {...{ ref, onSubmit }}
          >
            <Label>
              <span>{text.username.label}</span>
              <Input
                name={"username" as keyof TUSER_LOGIN_BODY}
                type="text"
                placeholder={text.username.placeholder}
              />
            </Label>
            <Label>
              {' '}
              <span>{text.password.label}</span>
              <div className="flex items-center gap-x-2">
                <Input
                  type={!password ? 'password' : 'text'}
                  name={"password" as keyof TUSER_LOGIN_BODY}
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
            <Label className="flex items-center gap-2 px-4">
              <Checkbox name={"remember"} /> {text.remember}
            </Label>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="login"
            variant="default"
            className="ms-auto"
          >
            {text.login}
          </Button>
        </CardFooter>
      </Card>
    </section>
    </>
  )
}
Login.dispalyname = 'Login'

const text = {
  title: 'Inicio de sesion:',
  browser: 'Bienvenido',
  description: [
    'Bienvenido a su aplicacion de creditos.',
    'Por favor introdusca sus credenciales para acceder a su cuenta.',
  ],
  username: {
    placeholder: 'Escriba su @username',
    label: 'Username:',
  },
  password: {
    placeholder: 'Escriba su contraseña',
    label: 'Password:',
  },
  remember: 'Recuerdame.',
  notification: {
    success: {
      title: 'Usuario logeado con exito!.',
      description: ({ username }: { username: string }) =>
        'Bienvenido ' + username,
    },
    error: {
      title: 'Error:',
      description: ({ username }: { username: string }) =>
        `El nombre de usuario ${username} o la contraseña son incorrecttos.`,
    },
  },
  login: 'Login',
}
