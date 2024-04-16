import clsx from 'clsx'
import * as React from 'react'
import styles from "@/components/ui/loader.module.css"

interface TSpinLoader extends React.HTMLAttributes<HTMLSpanElement> {}

const SpinLoader = React.forwardRef< HTMLSpanElement, TSpinLoader>(( { className, ...props }, ref) => (
  <span {...props} ref={ref} className={clsx( styles?.["spin-loader"], className )}></span>
))

const BoundleLoader = React.forwardRef<HTMLSpanElement, TSpinLoader>(( { className, ...props }, ref) => (
  <span {...props} ref={ref} className={clsx( styles?.["boundle-loader"], className )}></span>
))

export { SpinLoader, BoundleLoader }
