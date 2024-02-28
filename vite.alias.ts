import { resolve } from 'path'

const root = resolve(__dirname, 'src')

export const alias: Record<string, string> = {
  '@': root,
}

export default alias
