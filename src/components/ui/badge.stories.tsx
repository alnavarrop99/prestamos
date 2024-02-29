import type { Meta, StoryObj } from '@storybook/react'
import { Badge, badgeVariants } from '@/components/ui/badge'
import { VariantProps } from 'class-variance-authority'

const meta: Meta<VariantProps<typeof badgeVariants>> = {
  title: '@components/badge',
  component: Badge,
}
export default meta

export const _Basic: StoryObj<typeof Badge> = {
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
