import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

function Basic({ label }: { label: string }) {
  return (
    <Label className="inline-flex items-center gap-1">
      <Checkbox /> {label}
    </Label>
  )
}

const meta: Meta<React.ComponentProps<typeof Label>> = {
  title: '@components/label',
  component: Label,
}
export default meta

export const Primary: StoryObj<React.ComponentProps<typeof Basic>> = {
  name: 'Basic',
  args: {
    label: 'Label',
  },
  render: Basic,
}
