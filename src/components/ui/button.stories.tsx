import type { Meta, StoryObj } from '@storybook/react'
import { Button, buttonVariants } from './button'
import { VariantProps } from 'class-variance-authority'

const meta: Meta<VariantProps<typeof buttonVariants>> = {
  title: '@components/button',
  component: Button,
}
export default meta

export const Primary: StoryObj<
  VariantProps<typeof buttonVariants> & { children: string }
> = {
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
