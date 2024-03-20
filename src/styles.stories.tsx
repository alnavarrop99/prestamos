import type { Meta, StoryObj } from '@storybook/react'

const list = {
  basic: {
    background: ['background', 'foreground'],
    primary: ['primary', 'primary-foreground'],
    secondary: ['secondary', 'secondary-foreground'],
    muted: ['muted', 'muted-foreground'],
    accent: ['accent', 'accent-foreground'],
    destructive: ['destructive', 'destructive-foreground'],
  },
  comp: {
    basic: ['border', 'input', 'ring'],
    card: ['card', 'card-foreground'],
    popover: ['popover', 'popover-foreground'],
  },
}

function Basic() {
  const basic = Object.entries(list.basic)
  const comp = Object.entries(list.comp)
  return (
    <div className="flex flex-row space-y-4">
      <div className="space-y-2">
        {basic.map(([key, value]) => (
          <div key={key}>
            <span className='font-bold uppercase after:content-[":"]'>
              {key}
            </span>
            <div className="flex flex-wrap gap-4 px-4 [&_span]:block [&_span]:h-32 [&_span]:w-32 [&_span]:border-2">
              {value.map((color) => (
                <div key={color}>
                  {color}
                  <span
                    style={{ backgroundColor: `hsl(var(--${color}))` }}
                  ></span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {comp.map(([key, value]) => (
          <div key={key}>
            <span className='font-bold uppercase after:content-[":"]'>
              {key}
            </span>
            <div className="flex flex-wrap gap-4 px-4 [&_span]:block [&_span]:h-32 [&_span]:w-32 [&_span]:border-2">
              {value.map((color) => (
                <div key={color}>
                  {color}
                  <span
                    style={{ backgroundColor: `hsl(var(--${color}))` }}
                  ></span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const meta: Meta<React.ComponentProps<typeof Basic>> = {
  title: '@styles/colors',
  component: Basic,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof Basic>> = {
  name: 'Basic',
  render: Basic,
}
