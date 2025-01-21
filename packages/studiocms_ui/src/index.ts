import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import transitionEventPolyfill from 'astro-transition-event-polyfill';
import { resolve as _resolve, join } from 'pathe';
import pkgJson from '../package.json' assert { type: 'json' };
import { studiocmsLogo } from './toolbar/icon.js';
import { createResolver } from './utils/create-resolver.js';
import { addVirtualImports } from './utils/integration-utils.js';

type Options = {
	/**
	 * Path to a custom CSS file to be included in the build.
	 * Can be used to overwrite the default styles by redefining the CSS variables.
	 *
	 * @link https://ui.studiocms.dev/docs/guides/customization/
	 */
	customCss?: string;
};

export default function integration({ customCss }: Options = {}): AstroIntegration {
	// Resolve paths relative to the current file (pkg/src/index.ts)
	const { resolve } = createResolver(import.meta.url);

	// Resolve paths relative to the assets directory (pkg/assets/)
	const { resolve: resolveAssets } = createResolver(
		_resolve(fileURLToPath(join(import.meta.url, '..', '..', 'assets/')))
	);

	return {
		name: '@studiocms/ui',
		hooks: {
			'astro:config:setup': (params) => {
				const { addDevToolbarApp, injectScript, updateConfig } = params;
				const { resolve: rootResolve } = createResolver(params.config.root.pathname);

				updateConfig({
					integrations: [transitionEventPolyfill()],
				});

				addVirtualImports(params, {
					name: '@studiocms/ui',
					imports: {
						// Internal Version
						'studiocms:ui/version': `export default ${JSON.stringify(pkgJson.version)}`,
						// Styles
						'studiocms:ui/global-css': `import ${JSON.stringify(resolveAssets('./css/global.css'))}`,
						'studiocms:ui/custom-css': `import '${JSON.stringify(rootResolve(customCss ? customCss : ''))}'`,
						// Scripts
						'studiocms:ui/scripts/checkbox': `import ${JSON.stringify(resolveAssets('./components/Checkbox/checkbox.ts'))}`,
						'studiocms:ui/scripts/radiogroup': `import ${JSON.stringify(resolveAssets('./components/RadioGroup/radiogroup.ts'))}`,
						'studiocms:ui/scripts/searchselect': `import ${JSON.stringify(resolveAssets('./components/SearchSelect/searchselect.ts'))}`,
						'studiocms:ui/scripts/select': `import ${JSON.stringify(resolveAssets('./components/Select/select.ts'))}`,
						'studiocms:ui/scripts/tabs': `import ${JSON.stringify(resolveAssets('./components/Tabs/tabs.ts'))}`,
						'studiocms:ui/scripts/themetoggle': `import ${JSON.stringify(resolveAssets('./components/ThemeToggle/themetoggle.ts'))}`,
						'studiocms:ui/scripts/toaster': `import ${JSON.stringify(resolveAssets('./components/Toast/toaster.ts'))}`,
						'studiocms:ui/scripts/toast': `import ${JSON.stringify(resolveAssets('./components/Toast/toast.ts'))}`,
						'studiocms:ui/scripts/toggle': `import ${JSON.stringify(resolveAssets('./components/Toggle/toggle.ts'))}`,
						'studiocms:ui/scripts/accordion': `import ${JSON.stringify(resolveAssets('./components/Accordion/accordion.ts'))}`,
						'studiocms:ui/scripts/progress': `import ${JSON.stringify(resolveAssets('./components/Progress/progress.ts'))}`,
					},
				});

				injectScript('page-ssr', `import 'studiocms:ui/global-css';`);

				if (customCss) {
					injectScript('page-ssr', `import 'studiocms:ui/custom-css';`);
				}

				addDevToolbarApp({
					id: 'studiocms-ui-toolbar',
					name: 'StudioCMS/UI',
					entrypoint: resolve('./toolbar/index.js'),
					icon: studiocmsLogo,
				});
			},
		},
	};
}
