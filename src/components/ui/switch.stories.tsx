import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { SwitchProps } from '@radix-ui/react-switch'

export function Basic({ ...props }: SwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch {...props} id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
const meta: Meta<React.ComponentProps<typeof Switch>> = {
  title: '@components/switch',
  component: Switch,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof Basic>> = {
  name: 'Basic',
  args: {
    disabled: false,
    checked: false,
  },
  render: Basic,
}
