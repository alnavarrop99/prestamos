import type { Meta, StoryObj } from '@storybook/react'
import { Calendar, CalendarProps } from './calendar'
import { useState } from 'react'

function Basic({...props}: CalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
 
  return (
    <Calendar
      {...props}
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
  
}

const meta: Meta<CalendarProps> = {
  title: '@components/calendar',
  component: Calendar,
}
export default meta

export const _Basic: StoryObj<CalendarProps> = {
  name: "Basic",
  args: {
  },
  render: Basic,
}
