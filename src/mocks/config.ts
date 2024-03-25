import { setupWorker } from 'msw/browser'
import users from '@/mocks/user'

const handlers = [...users]

export const worker = setupWorker(...handlers)
