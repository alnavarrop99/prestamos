/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API: string
  readonly VITE_AUTH0_DOMAIN: string
  readonly VITE_AUTH0_CLIENT_ID: string
  readonly MSW: boolean
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
