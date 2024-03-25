import { setupWorker } from 'msw/browser'

const handlers = []

export const worker = setupWorker(...handlers)
