import { DialogContent } from '@/components/ui/dialog'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/user/new')({
  component: NewUser,
})

export function NewUser() {
  return (
    <DialogContent className="max-w-xl">
      New User
    </DialogContent>
  )
}

NewUser.dispalyname = 'NewUser'
