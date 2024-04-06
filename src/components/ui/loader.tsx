import clsx from 'clsx'
import * as React from 'react'
import styles from "@/components/ui/loader.module.css"

interface TSpinLoader extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {}

const SpinLoader = React.forwardRef<HTMLSpanElement, TSpinLoader>(( { className, ...props }, ref) => (
  <span {...props} ref={ref} className={clsx( styles?.["loader"], className )}></span>
))

export { SpinLoader }
