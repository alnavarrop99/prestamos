import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)
function Basic( { ...props }: React.ComponentProps< typeof ScrollArea > ) {
  return (
     <ScrollArea {...props} className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className="text-sm">
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}

const meta: Meta<React.ComponentProps<typeof ScrollArea>> = {
  title: '@components/scroll-area',
  component: ScrollArea,
}
export default meta

export const _Basic: StoryObj<React.ComponentProps<typeof ScrollArea>> = {
  name: 'Basic',
  args: {
  },
  render: Basic,
}
