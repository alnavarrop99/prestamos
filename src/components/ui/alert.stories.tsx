import type { Meta, StoryObj } from '@storybook/react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  alertVariants,
} from '@/components/ui/alert'
import { VariantProps } from 'class-variance-authority'
import { AlertCircle, AlertTriangle, Terminal } from 'lucide-react'

function Basic({
  title,
  description,
  status,
  ...props
}: VariantProps<typeof alertVariants> & {
  title: string
  description: string
  status: 'info' | 'normal' | 'warn'
}) {
  return (
    <Alert {...props}>
      {status === 'normal' && <Terminal className="h-4 w-4" />}
      {status === 'info' && <AlertCircle className="h-4 w-4" />}
      {status === 'warn' && <AlertTriangle className="h-4 w-4" />}
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

const meta: Meta<VariantProps<typeof alertVariants>> = {
  title: '@components/alert',
  component: Alert,
}
export default meta

export const _Basic: StoryObj<
  VariantProps<typeof alertVariants> & {
    title: string
    description: string
    status: 'info' | 'normal' | 'warn'
  }
> = {
  name: 'Basic',
  args: {
    description: 'You can add components to your app using the cli.',
    title: 'Heads up!',
    variant: 'default',
    status: 'normal',
  },
  argTypes: {
    status: {
      type: {
        name: 'enum',
        value: ['info', 'normal', 'warn'],
      },
    },
  },
  render: Basic,
}
