import type { Meta, StoryObj } from '@storybook/react'
import { Badge, badgeVariants } from './badge'
import { VariantProps } from 'class-variance-authority'

const meta: Meta<VariantProps<typeof badgeVariants>> = {
  title: '@components/badge',
  component: Badge,
}
export default meta

export const _Basic: StoryObj<
  VariantProps<typeof badgeVariants> & { children: string }
> = {
  name: 'Basic',
  args: {
    variant: 'default',
    children: 'badge',
  },
  argTypes: {
    children: {
      name: 'label',
    },
  },
}
