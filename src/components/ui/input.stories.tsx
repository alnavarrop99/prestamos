import type { Meta, StoryObj } from '@storybook/react'
import { Input, InputProps } from './input'
import { Label } from './label'

function InputLabel({ label, ...props }: InputProps & { label: string }) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="input">{label}</Label>
      <Input {...props} id="input" />
    </div>
  )
}

const meta: Meta<React.ComponentProps<typeof Input>> = {
  title: '@components/input',
  component: Input,
}
export default meta

export const _Basic: StoryObj<InputProps> = {
  args: {
    type: 'text',
    placeholder: 'phone',
    disabled: false,
  },
}

export const _Label: StoryObj<React.ComponentProps<typeof InputLabel>> = {
  args: {
    label: 'Input: ',
    type: 'text',
    placeholder: 'placeholder',
    disabled: false,
  },
  argTypes: {
    type: {
      type: {
        name: 'enum',
        value: [
          'text',
          'email',
          'range',
          'week',
          'tel',
          'file',
          'url',
          'time',
          'color',
          'image',
          'number',
          'search',
          'password',
        ] as React.HTMLInputTypeAttribute[],
      },
    },
  },
  render: InputLabel,
}
