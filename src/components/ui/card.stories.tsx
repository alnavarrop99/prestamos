import type { Meta, StoryObj } from '@storybook/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from './card'
import React from 'react'

function Basic({
  title,
  footer,
  content,
  description,
}: {
  title: string
  content: string
  footer: string
  description: string
}) {
  return (
    <Card className="inline-block">
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {content && (
        <CardContent>
          <p>{content}</p>
        </CardContent>
      )}
      {footer && (
        <CardFooter>
          <p>{footer}</p>
        </CardFooter>
      )}
    </Card>
  )
}

const meta: Meta<React.ComponentProps<typeof Card>> = {
  title: '@components/card',
  component: Card,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof Basic>> = {
  name: 'Basic',
  args: {
    footer: 'Card Footer',
    content:
      'Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem',
    description: 'Card Description',
    title: 'Card Title',
  },
  render: Basic,
}
