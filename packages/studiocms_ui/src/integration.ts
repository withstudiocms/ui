import type { AstroIntegration } from 'astro';
import { version as packageVersion } from '../package.json';
import { createResolver } from './utils/create-resolver';
import { viteVirtualModulePluginBuilder } from './utils/virtual-module-plugin-builder';
import { addVirtualImports } from './utils/integration-utils';

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
			'astro:config:setup': (params) => {
				const { injectScript, updateConfig } = params;

				updateConfig({
					vite: {
						plugins: [globalCss(), version()],
					},
				});

				addVirtualImports(params, {
					name: 'sui-scripts',
					imports: {
						'studiocms:ui/scripts/checkbox': `import ${JSON.stringify(resolve('./components/Checkbox/checkbox.ts'))}`,
						'studiocms:ui/scripts/radiogroup': `import ${JSON.stringify(resolve('./components/RadioGroup/radiogroup.ts'))}`,
						'studiocms:ui/scripts/searchselect': `import ${JSON.stringify(resolve('./components/SearchSelect/searchselect.ts'))}`,
						'studiocms:ui/scripts/select': `import ${JSON.stringify(resolve('./components/Select/select.ts'))}`,
						'studiocms:ui/scripts/tabs': `import ${JSON.stringify(resolve('./components/Tabs/tabs.ts'))}`,
						'studiocms:ui/scripts/themetoggle': `import ${JSON.stringify(resolve('./components/ThemeToggle/themetoggle.ts'))}`,
						'studiocms:ui/scripts/toaster': `import ${JSON.stringify(resolve('./components/Toast/toaster.ts'))}`,
						'studiocms:ui/scripts/toast': `import ${JSON.stringify(resolve('./components/Toast/toast.ts'))}`,
						'studiocms:ui/scripts/toggle': `import ${JSON.stringify(resolve('./components/Toggle/toggle.ts'))}`,
					},
				});

				injectScript('page-ssr', `import 'studiocms:ui/global-css';`);
			},
		},
	};
}
