import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

function Basic({ name, src }: { src: string; name: string }) {
  return (
    <Avatar>
      <AvatarImage src={src} alt="@shadcn" />
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  )
}

const meta: Meta<typeof Avatar> = {
  title: '@components/avatar',
  component: Avatar,
}
export default meta

export const _Basic: StoryObj<{ src: string; name: string }> = {
  name: 'Basic',
  args: {
    src: 'https://github.com/shadcn.png',
    name: 'CN',
  },
  render: Basic,
}
