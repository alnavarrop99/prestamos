import { setupWorker } from 'msw/browser'
import users from '@/mocks/user'
import clients from '@/mocks/client'
import credits from '@/mocks/credit'
import payment from '@/mocks/payment'

const handlers = [...users, ...clients, ...credits, ...payment]

export const worker = setupWorker(...handlers)
