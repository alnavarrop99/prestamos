import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { Layout } from '@/pages/_layout'
import notifications from "@/__mock__/NOTIFICATION.json";
import { Notifications, ActionIcon } from "@/pages/_layout/notification";

function _Layout(Story: StoryFn) {
  return (
    <Layout>
      <Story />
    </Layout>
  )
}

function _Router(Story: StoryFn) {
  return $.customRenderStorie(() => <Story />)
}

const meta: Meta< React.ComponentProps<typeof Notifications>> = {
  title: '@pages/notifications',
  component: Notifications,
}
export default meta

export const _Notifications: StoryObj< React.ComponentProps< typeof Notifications > > = {
  name: '/notifications',
  args: {
    notifications: notifications
  },
  decorators: [_Layout, _Router],
}

export const _ActionIcon: StoryObj< React.ComponentProps< typeof ActionIcon > > = {
  name: 'aiction-icon',
  render: ActionIcon,
  args: {
    action: "POST"
  },
  argTypes: {
    action: {
      type: {
        name: "enum",
        value: ["POST", "PATH", "DELETE"]
      }
    }
  }
}
