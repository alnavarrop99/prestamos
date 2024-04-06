import type { Meta, StoryObj } from '@storybook/react'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'

export function Basic({ ...props }: React.ComponentProps<typeof Slider>) {
  return <Slider className={cn('w-[30%]')} {...props} />
}
const meta: Meta<React.ComponentProps<typeof Slider>> = {
  title: '@components/slider',
  component: Slider,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof Basic>> = {
  name: 'Basic',
  args: {
    max: 100,
    min: 0,
    step: 10,
    defaultValue: [70],
  },
  render: Basic,
}
