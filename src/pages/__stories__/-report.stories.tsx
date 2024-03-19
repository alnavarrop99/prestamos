import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { Layout } from '@/pages/_layout'
import reports from '@/__mock__/REPORT.json'
import { Report } from '@/pages/_layout/report'

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

const meta: Meta<React.ComponentProps<typeof Report>> = {
  title: '@pages/report',
  component: Report,
  decorators: [_Layout, _Router],
}
export default meta

export const _Report: StoryObj<React.ComponentProps<typeof Report>> = {
  name: '/report',
  args: {
    reports: reports,
  },
}
