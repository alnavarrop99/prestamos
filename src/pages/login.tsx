import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: Login,
})

export function Login() {
  return (
    <section className="grid min-h-screen place-content-center place-items-center">
      <h1> Login </h1>
    </section>
  )
}

Login.dispalyname = 'Login'
