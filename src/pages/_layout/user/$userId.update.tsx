import { DialogContent } from '@/components/ui/dialog'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/user/$userId/update')({
  component: UpdateUserById,
})

export function UpdateUserById() {
  return (
    <DialogContent className="max-w-xl">
      Update User By Id
    </DialogContent>
  )
}

UpdateUserById.dispalyname = 'UpdateUserById'
