import type { Meta, StoryObj } from '@storybook/react'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toast/toaster'

export function Basic({
  title,
  description,
  alt,
  action,
  variant,
}: {
  title: string
  description: string
  alt: string
  action: string
  variant: 'destructive' | 'default'
}) {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title,
          description,
          variant,
          action: <ToastAction altText={alt}>{action}</ToastAction>,
        })
      }}
    >
      Add to calendar
    </Button>
  )
}

const meta: Meta<React.ComponentProps<typeof Basic>> = {
  title: '@components/toast',
  component: Basic,
  decorators: [
    function (Story) {
      return (
        <>
          <Toaster />
          <Story />
        </>
      )
    },
  ],
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof Basic>> = {
  name: 'Basic',
  args: {
    title: 'Scheduled: Catch up ',
    description: 'Friday, February 10, 2023 at 5:57 PM',
    alt: 'Goto schedule to undo',
    action: 'undo',
    variant: 'default',
  },
  render: Basic,
  argTypes: {
    variant: {
      type: {
        name: 'enum',
        value: ['default', 'destructive'],
      },
    },
  },
}
