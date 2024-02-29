import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './progress'
import React, { useEffect, useState } from 'react'

function Basic({
  progress: _progress,
  init,
}: {
  progress: number
  init: number
}) {
  const [progress, setProgress] = useState(init)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(_progress), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress value={progress} className="w-[30%]" />
}

const meta: Meta<React.ComponentProps<typeof Progress>> = {
  title: '@components/progress',
  component: Progress,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof Basic>> = {
  name: 'Basic',
  args: {
    init: 0,
    progress: 77,
  },
  render: Basic,
}
