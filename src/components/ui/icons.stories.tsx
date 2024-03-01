import type { Meta, StoryObj } from '@storybook/react'
import { icons } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { Input } from './input'

type IconsName = keyof typeof icons
function Basic({ name }: { name: IconsName }) {
  const [Comp, setName] = useState(() => icons?.[name])
  useEffect(() => {
    setName(() => icons?.[name])
  }, [name])

  return <Comp />
}

function All() {
  const [search, setSearch] = useState<string | undefined>(undefined)
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    setSearch(ev.target?.value)
  }
  return (
    <div className="space-y-2">
      <Input
        className="ms-auto w-1/6"
        type="search"
        value={search}
        placeholder="Search..."
        {...{ onChange }}
      />
      <div className="flex flex-row flex-wrap gap-2">
        {Object.entries(icons)
          ?.filter(([name]) =>
            search ? name.toLowerCase().includes(search.toLowerCase()) : true
          )
          ?.map(([name, Icons]) => (
            <span key={name} title={name} className="border border-black p-2">
              <Icons />
            </span>
          ))}
      </div>
    </div>
  )
}

const meta: Meta = {
  title: '@components/icons',
  component: Fragment,
}
export default meta

export const _Basic: StoryObj<{ name: keyof typeof icons }> = {
  name: 'Basic',
  args: {
    name: 'Bug',
  },
  argTypes: {
    name: {
      type: {
        name: 'enum',
        value: Object.keys(icons),
      },
    },
  },
  render: Basic,
}

export const _All: StoryObj<React.ComponentProps<typeof All>> = {
  name: 'All Icons',
  args: {},
  render: All,
}
