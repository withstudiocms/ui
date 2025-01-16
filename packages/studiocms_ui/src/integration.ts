import type { AstroIntegration } from 'astro';
import { version as packageVersion } from '../package.json';
import { createResolver } from './utils/create-resolver';
import { addVirtualImports } from './utils/integration-utils';
import { viteVirtualModulePluginBuilder } from './utils/virtual-module-plugin-builder';

type Options = {
	/**
	 * Path to a custom CSS file to be included in the build.
	 * Can be used to overwrite the default styles by redefining the CSS variables.
	 * 
	 * @link https://ui.studiocms.dev/docs/guides/customization/
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
				const { addDevToolbarApp, injectScript, updateConfig } = params;
				const { resolve: rootResolve } = createResolver(params.config.root.pathname);

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
						'studiocms:ui/scripts/accordion': `import ${JSON.stringify(resolve('./components/Accordion/accordion.ts'))}`,
					},
				});

				injectScript('page-ssr', `import 'studiocms:ui/global-css';`);

				if (options.customCss) {
					const customCss = viteVirtualModulePluginBuilder(
						'studiocms:ui/custom-css',
						'sui-custom-css',
						`import '${rootResolve(options.customCss)}'`
					);

					updateConfig({
						vite: {
							plugins: [customCss()]
						}
					});

					injectScript('page-ssr', `import 'studiocms:ui/custom-css';`);
				}

				addDevToolbarApp({
					id: 'studiocms:ui/toolbar',
					name: 'StudioCMS/UI',
					entrypoint: '@studiocms/ui/toolbar',
					icon: `
						<svg width="755" height="792" viewBox="0 0 755 792" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect x="295" width="460" height="466" rx="32" fill="white"/>
							<path d="M272 434V166H180C162.327 166 148 180.327 148 198V597C148 614.673 162.327 629 180 629H577.5C595.173 629 609.5 614.673 609.5 597V490H328C297.072 490 272 464.928 272 434Z" fill="white"/>
							<path d="M124 597V329H32C14.3269 329 0 343.327 0 361V760C0 777.673 14.3269 792 32 792H429.5C447.173 792 461.5 777.673 461.5 760V653H180C149.072 653 124 627.928 124 597Z" fill="white"/>
						</svg>`
				})
			},
		},
	};
}
