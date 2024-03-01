import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function subscribe(
  eventName: string,
  listener?: (param: unknown) => void
) {
  document.addEventListener(eventName, listener ?? (() => {}))
}

export function unsubscribe(
  eventName: string,
  listener?: (param: unknown) => void
) {
  document.removeEventListener(eventName, listener ?? (() => {}))
}

export function publish(eventName: string, data?: Record<string, unknown>) {
  const event = new CustomEvent(eventName, { detail: data })
  document.dispatchEvent(event)
}

export default {
  subscribe,
  unsubscribe,
  publish,
}
