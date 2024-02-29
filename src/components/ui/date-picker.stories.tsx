import type { Meta, StoryObj } from '@storybook/react'
import { DatePicker } from './date-picker'

const meta: Meta<React.ComponentProps<typeof DatePicker>> = {
  title: '@components/date-picker',
  component: DatePicker,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof DatePicker>> = {
  name: 'Basic',
  args: {
    label: 'Pick a date',
    range: false,
  },
}
