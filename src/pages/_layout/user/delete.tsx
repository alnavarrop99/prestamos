import { DialogContent } from '@/components/ui/dialog'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/user/delete')({
  component: DeleteUsers,
})

export function DeleteUsers() {
  return (
    <DialogContent className="max-w-xl">
      Delete User
    </DialogContent>
  )
}

DeleteUsers.dispalyname = 'DeleteUser'
