import type { Meta, StoryObj } from '@storybook/react'
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";

function Basic({
  ...props
}: React.ComponentProps<typeof Accordion>) {
  return (
       <Accordion {...props} className="w-80">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default, but you can disable it if you
            prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
  )
}

const meta: Meta< React.ComponentProps< typeof Basic > > = {
  title: '@components/accordion',
  component: Accordion,
}
export default meta

export const _Basic: StoryObj< React.ComponentProps< typeof Accordion > > = {
  name: 'Basic',
  args: {
    type: "single",
    collapsible: true,
  },
  argTypes: {
  },
  render: Basic,
}
