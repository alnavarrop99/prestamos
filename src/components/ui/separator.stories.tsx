import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from '@/components/ui/separator'

export function Basic() {
  return (
    <div className="inline-block">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  )
}

const meta: Meta<React.ComponentProps<typeof Separator>> = {
  title: '@components/separator',
  component: Separator,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof Separator>> = {
  name: 'Basic',
  args: {},
  render: Basic,
}
