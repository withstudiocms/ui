import type { AstroIntegration } from 'astro';
import { createResolver } from './utils/create-resolver';
import { viteVirtualModulePluginBuilder } from './utils/virtual-module-plugin-builder'

// biome-ignore lint/complexity/noBannedTypes: Will be implemented in v0.3.0
type Options = {};

export default function integration(options: Options = {}): AstroIntegration {
	const { resolve } = createResolver(import.meta.url);

	const globalCss = viteVirtualModulePluginBuilder('studiocms:ui/global-css', 'sui-global-css', `import '${resolve('./css/global.css')}'`);

	return {
		name: '@studiocms/ui',
		hooks: {
			'astro:config:setup': ({ injectScript, updateConfig }) => {
				updateConfig({
					vite: {
						plugins: [globalCss()],
					},
				});

				injectScript('page-ssr', `import 'studiocms:ui/global-css';`);
			},
		},
	};
}
