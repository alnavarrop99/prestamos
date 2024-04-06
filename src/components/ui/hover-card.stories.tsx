import type { Meta, StoryObj } from '@storybook/react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

function Basic({ ...props }: React.ComponentProps<typeof HoverCard>) {
  return (
    <HoverCard {...props}>
      <HoverCardTrigger>Hover</HoverCardTrigger>
      <HoverCardContent>
        The React Framework – created and maintained by @vercel.
      </HoverCardContent>
    </HoverCard>
  )
}

const meta: Meta<React.ComponentProps<typeof HoverCard>> = {
  title: '@components/hover-card',
  component: HoverCard,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof Basic>> = {
  name: 'Basic',
  args: {},
  render: Basic,
}
