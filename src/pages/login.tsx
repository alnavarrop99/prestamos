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
import { createFileRoute } from '@tanstack/react-router'
import { useReducer, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Eye, EyeOff } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

export const Route = createFileRoute('/login')({
  component: Login,
})

type TStatus = { readonly password?: boolean; readonly error?: boolean }
const reducer: React.Reducer<TStatus, TStatus> = (prev, state) => {
  return { ...prev, ...state }
}

export function Login() {
  const ref = useRef<HTMLFormElement>(null)
  const [{ error, password }, setStatus] = useReducer(reducer, {
    password: false,
    error: false,
  })
  const onSubmit: React.FormEventHandler = (ev) => {
    ev.preventDefault()
    if (!ref.current) return

    const { username, password, remember } = Object.fromEntries(
      new FormData(ref.current).entries()
    ) as Record<LoginForm, string>
    const status: keyof typeof text.notification = !error ? 'success' : 'error'

    if (!!username && !!password) {
      toast({
        title: text.notification?.[status].title,
        description: text.notification?.[status]?.description({ username }),
        variant: !error ? 'default' : 'destructive',
      })
    }

    if (remember) {
      alert('guardar en storage')
    }
  }
  const onClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setStatus({ password: !password })
  }

  return (
    <section className="grid min-h-screen place-content-center place-items-center">
      <Card className="inline-block shadow-lg">
        <CardHeader>
          <CardTitle>{text.title}</CardTitle>
          <CardDescription>
            <p className="text-lg font-bold">{text?.description?.[0]}</p>
            <p>{text?.description?.[1]}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="login"
            className="flex flex-col gap-4"
            {...{ ref, onSubmit }}
          >
            <Label>
              {' '}
              {text.username.label}
              <Input
                name="username"
                type="text"
                placeholder={text.username.placeholder}
              />
            </Label>
            <Label>
              {' '}
              {text.password.label}
              <div className="flex items-center gap-x-2">
                <Input
                  type={!password ? 'password' : 'text'}
                  name="password"
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
              <Checkbox name="remember" /> {text.remember}
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
  )
}
Login.dispalyname = 'Login'

type LoginForm = 'password' | 'username' | 'remember'

const text = {
  title: 'Inicio de sesion:',
  description: [
    'Bienvenido a su aplicacion de creditos.',
    'Por favor introdusca sus credenciales para acceder a su cuenta.',
  ],
  username: {
    placeholder: 'Escriba su @username aqui',
    label: 'Username:',
  },
  password: {
    placeholder: 'Escriba su ****** aqui',
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
