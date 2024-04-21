import { resolve } from 'path'

const root = resolve(__dirname, 'src')
const public_root = resolve(__dirname, 'public')

export const alias: Record<string, string> = {
  '@': root,
  public: public_root,
}

export default alias
