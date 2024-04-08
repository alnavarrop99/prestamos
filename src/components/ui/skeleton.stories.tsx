import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from '@/components/ui/skeleton'

function Avatar() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

function Content() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

const meta: Meta<React.ComponentProps<typeof Skeleton>> = {
  title: '@components/skeleton',
  component: Skeleton,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof Avatar>> = {
  name: 'Basic',
  args: {},
  render: Avatar,
}

export const _Content: StoryObj<React.ComponentProps<typeof Content>> = {
  name: 'Content',
  args: {},
  render: Content,
}
