import type { Meta, StoryObj } from '@storybook/react'
import { SpinLoader, BoundleLoader } from '@/components/ui/loader'
import React from 'react'

const meta: Meta = {
  title: '@components/loader',
  component: React.Fragment,
}
export default meta

export const _spin: StoryObj<React.ComponentRef< typeof SpinLoader>> = {
  name: 'Spin Loader',
  render: () => <SpinLoader />,
}

export const _boundle: StoryObj<React.ComponentRef<typeof BoundleLoader>> = {
  name: 'Boundle Loader',
  render: () => <BoundleLoader />,
}

