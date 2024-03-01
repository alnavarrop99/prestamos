import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '@/components/ui/textarea'

export function Basic({ ...props }: React.ComponentProps<typeof Textarea>) {
  return <Textarea {...props} />
}

const meta: Meta<React.ComponentProps<typeof Textarea>> = {
  title: '@components/textarea',
  component: Textarea,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof Basic>> = {
  name: 'Basic',
  args: {
    placeholder: 'Type your message here.',
  },
  render: Basic,
}
