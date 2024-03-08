import { DialogContent } from '@/components/ui/dialog'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/user/$userId/delete')({
  component: DeleteUserById,
})

export function DeleteUserById() {
  return (
    <DialogContent className="max-w-xl">
      Delete User By Id
    </DialogContent>
  )
}

DeleteUserById.dispalyname = 'DeleteUserById'
