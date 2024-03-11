import type { Meta, StoryObj } from '@storybook/react'
import { Timeline, TimelineItem } from '@/components/ui/timeline'

export function Basic({ ...props }: React.ComponentProps<typeof Timeline>) {
  return (
    <Timeline {...props}>
      <TimelineItem> Time-1 </TimelineItem>
      <TimelineItem> Time-2 </TimelineItem>
      <TimelineItem> Time-3 </TimelineItem>
    </Timeline>
  )
}

const meta: Meta<React.ComponentProps<typeof Timeline>> = {
  title: '@components/timeline',
  component: Timeline,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof Basic>> = {
  name: 'Basic',
  args: {},
  render: Basic,
}
