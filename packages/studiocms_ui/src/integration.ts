import type { AstroIntegration } from 'astro'

type Config = {
}

export default function integration(cfg: Config = {}): AstroIntegration {
  return {
    name: '@studiocms/ui',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        injectScript("page-ssr", "import '@studiocms/ui/css/global.css'")
      }
    }
  }
}
