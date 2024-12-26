import type { AstroIntegration } from 'astro';
import { version as packageVersion } from '../package.json';
import { createResolver } from './utils/create-resolver';
import { viteVirtualModulePluginBuilder } from './utils/virtual-module-plugin-builder';

type Options = {
	/**
	 * Path to a custom CSS file to be included in the build.
	 * Can be used to overwrite the default styles by redefining the CSS variables.
	 * 
	 * @link https://ui.studiocms.dev/...
	 */
	customCss?: string;
};

export default function integration(options: Options = {}): AstroIntegration {
	const { resolve } = createResolver(import.meta.url);

	const globalCss = viteVirtualModulePluginBuilder(
		'studiocms:ui/global-css',
		'sui-global-css',
		`import '${resolve('./css/global.css')}'`
	);

	const version = viteVirtualModulePluginBuilder(
		'studiocms:ui/version',
		'sui-version',
		`export default '${packageVersion}'`
	);

	return {
		name: '@studiocms/ui',
		hooks: {
			'astro:config:setup': ({ injectScript, updateConfig }) => {
				updateConfig({
					vite: {
						plugins: [globalCss(), version()],
					},
				});

				injectScript('page-ssr', `import 'studiocms:ui/global-css';`);
			},
		},
	};
}
