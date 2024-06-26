import type { Meta, StoryObj } from '@storybook/react'
import { Button, buttonVariants } from '@/components/ui/button'
import { VariantProps } from 'class-variance-authority'

const meta: Meta<VariantProps<typeof buttonVariants>> = {
  title: '@components/button',
  component: Button,
}
export default meta

export const Primary: StoryObj<typeof Button> = {
  args: {
    size: 'default',
    variant: 'default',
    children: 'button',
  },
  argTypes: {
    children: {
      name: 'label',
    },
  },
}
