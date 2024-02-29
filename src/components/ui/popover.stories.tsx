import type { Meta, StoryObj } from '@storybook/react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'

function Basic({ label, content }: { label: string; content: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{label}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <p>{content}</p>
      </PopoverContent>
    </Popover>
  )
}

const meta: Meta<React.ComponentProps<typeof Popover>> = {
  title: '@components/popover',
  component: Popover,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof Basic>> = {
  name: 'Basic',
  args: {
    label: 'Popover',
    content:
      'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
  },
  render: Basic,
}
