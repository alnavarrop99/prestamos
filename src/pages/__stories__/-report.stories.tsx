import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { Layout } from '@/pages/_layout'
import { getReports } from '@/api/report'
import { Report } from '@/pages/_layout/report'
import { getClients } from '@/api/clients'
import { getUserId } from '@/api/users'
import { Theme } from '@/components/theme-provider'

function _Layout(Story: StoryFn, context: { globals: { theme: Theme } }) {
  return (
    <Layout theme={context.globals.theme} clients={getClients()} user={getUserId({ userId: 4 })}>
      <Story />
    </Layout>
  )
}

function _Router(Story: StoryFn) {
  return $.customRenderStorie(() => <Story />)
}

const meta: Meta<React.ComponentProps<typeof Report>> = {
  title: '@pages/report',
  component: Report,
  decorators: [_Layout, _Router],
}
export default meta

export const _Report: StoryObj<React.ComponentProps<typeof Report>> = {
  name: '/report',
  args: {
    reports: getReports(),
  },
}
