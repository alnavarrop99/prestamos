import * as React from 'react'
import styles from './timeline.module.css'
import clsx from 'clsx'
import { Pin } from 'lucide-react'

export interface Timeline
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {}

const Timeline = React.forwardRef<HTMLUListElement, Timeline>(
  ({ className, children, ...props }, ref) => {
    return (
      <ul
        {...(props && { ref })}
        className={clsx(
          'inline-flex flex-col [&>*]:m-0 [&>li]:grid [&_hr]:h-4 [&_hr]:w-1.5 [&_hr]:bg-secondary [&_svg]:rounded-full [&_svg]:p-px',
          className
        )}
      >
        {React.Children.toArray(children).map((child, i, list) => (
          <li
            key={i}
            className={clsx('place-items-center', styles?.['grid-3x2'])}
          >
            {i !== 0 && <hr className="row-start-1" />}
            <div
              className={clsx(
                'row-subgrid col-span-full row-start-2 grid place-items-center gap-2',
                styles?.['grid-3x2']
              )}
            >
              <Pin className="rotate-45" /> {child}
            </div>
            {i !== list?.length - 1 && <hr className="row-start-3" />}
          </li>
        ))}
      </ul>
    )
  }
)

Timeline.displayName = 'Timeline'

export interface TimelineItem
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}
const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItem>(
  ({ ref, children, ...prop }) => {
    return <div {...(prop && { ref })}> {children} </div>
  }
)

export { Timeline, TimelineItem }
