import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

function Basic({ label }: { label: string }) {
  return (
    <div>
      <Label className="inline-flex items-center gap-1">
        <Checkbox /> {label}{' '}
      </Label>
    </div>
  )
}

function Group() {
  return (
    <form className="flex flex-col gap-2">
      <Label className="inline-flex items-center gap-1">
        <Checkbox />
        Checkbox 1
      </Label>
      <Label className="inline-flex items-center gap-1">
        <Checkbox />
        Checkbox 2
      </Label>
      <Label className="inline-flex items-center gap-1">
        <Checkbox />
        Checkbox 3
      </Label>
    </form>
  )
}

const meta: Meta<React.ComponentProps<typeof Checkbox>> = {
  title: '@components/check',
  component: Checkbox,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof Basic>> = {
  name: 'Basic',
  args: {
    label: 'Checkbox',
  },
  render: Basic,
}

export const _Group: StoryObj<typeof Group> = {
  name: 'Group',
  render: Group,
}
