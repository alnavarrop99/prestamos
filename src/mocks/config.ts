import { setupWorker } from 'msw/browser'
import users from '@/mocks/user'
import clients from '@/mocks/client'

const handlers = [...users, ...clients]

export const worker = setupWorker(...handlers)
