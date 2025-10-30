/// <reference path="./events.d.ts" preserve="true" />
/// <reference path="./virtuals.d.ts" preserve="true" />

import fs from 'node:fs';
import type { IconifyJSON } from '@iconify/types';
import { icons as heroicons } from '@iconify-json/heroicons';
import type { AstroIntegration } from 'astro';
import { addVirtualImports, createResolver } from 'astro-integration-kit';
import transitionEventPolyfill from 'astro-transition-event-polyfill';
import { studiocmsLogo } from './toolbar/icon.js';
import { generateIconTypes } from './utils/typegen.js';

const pkgJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));

type Options = {
	/**
	 * Path to a custom CSS file to be included in the build.
	 * Can be used to overwrite the default styles by redefining the CSS variables.
	 *
	 * @link https://ui.studiocms.dev/docs/guides/customization/
	 */
	customCss?: string;

	/**
	 * Disable CSS Generation and require manual addition of the global CSS
	 *
	 * @example
	 * ```ts
	 * import 'studiocms:ui/global-css';
	 * ```
	 */
	noInjectCSS?: boolean;

	/**
	 * Allows the ability to add custom icons to the Icon component.
	 *
	 * @example:
	 * ```ts
	 * import { icons as heroicons } from '@iconify-json/heroicons';
	 *
	 * {
	 * 	icons: {
	 * 		heroicons,
	 * 		// OR
	 * 		'custom-heroicons': heroicons
	 * }
	 */
	icons?: Record<string, IconifyJSON>;
};

type IconifyCollections = {
	collections: Record<string, IconifyJSON>;
	collectionNames: string[];
	integrationCollections: string | undefined;
	availableIcons: string[];
};

export function createIconifyCollection(icons?: Record<string, IconifyJSON>): IconifyCollections {
	const collections: Record<string, IconifyJSON> = {};
	const collectionNames: string[] = [];
	const availableIcons: string[] = [];

	if (!icons) {
		return { collections, collectionNames, integrationCollections: undefined, availableIcons };
	}

	for (const [prefix, collection] of Object.entries(icons)) {
		collections[prefix] = collection;
		collectionNames.push(prefix);

		for (const icon of Object.keys(collection.icons)) {
			availableIcons.push(`${prefix}:${icon}`);
		}
	}

	const integrationCollections = `export const collections = ${JSON.stringify(collections)};`;

	return { collections, collectionNames, integrationCollections, availableIcons };
}

/**
 * The Astro integration for StudioCMS UI.
 *
 * @see https://ui.studiocms.dev
 * @param {Options} [options] - The options for the integration.
 * @returns {AstroIntegration} The Astro integration object.
 */
export default function integration(options: Options = {}): AstroIntegration {
	// Resolve paths relative to the current file (pkg/src/index.ts)
	const { resolve } = createResolver(import.meta.url);

	const optIcons: Record<string, IconifyJSON> = {
		heroicons,
	};

	let icons: IconifyCollections = {
		collections: {},
		collectionNames: [],
		integrationCollections: undefined,
		availableIcons: [],
	};

	return {
		name: '@studiocms/ui',
		hooks: {
			/* v8 ignore start */
			/** Astro integrations cannot be properly tested for code coverage */
			'astro:config:setup': (params) => {
				const { addDevToolbarApp, injectScript, updateConfig } = params;
				const { resolve: rootResolve } = createResolver(params.config.root.pathname);

				updateConfig({
					integrations: [transitionEventPolyfill()],
				});

				if (options.icons) {
					for (const [prefix, collection] of Object.entries(options.icons)) {
						if (!optIcons[prefix]) {
							optIcons[prefix] = collection;
						}
					}
				}

				icons = createIconifyCollection(optIcons);

				const componentMap: Record<string, string> = {
					'studiocms:ui/components/button': `export { default as Button } from '${resolve('./components/Button/Button.astro')}';`,
					'studiocms:ui/components/divider': `export { default as Divider } from '${resolve('./components/Divider/Divider.astro')}';`,
					'studiocms:ui/components/input': `export { default as Input } from '${resolve('./components/Input/Input.astro')}';`,
					'studiocms:ui/components/textarea': `export { default as Textarea } from '${resolve('./components/Textarea/Textarea.astro')}';`,
					'studiocms:ui/components/row': `export { default as Row } from '${resolve('./components/Row/Row.astro')}';`,
					'studiocms:ui/components/center': `export { default as Center } from '${resolve('./components/Center/Center.astro')}';`,
					'studiocms:ui/components/checkbox': `export { default as Checkbox } from '${resolve('./components/Checkbox/Checkbox.astro')}';`,
					'studiocms:ui/components/toggle': `export { default as Toggle } from '${resolve('./components/Toggle/Toggle.astro')}';`,
					'studiocms:ui/components/radiogroup': `export { default as RadioGroup } from '${resolve('./components/RadioGroup/RadioGroup.astro')}';`,
					'studiocms:ui/components/toaster': `
						export { default as Toaster } from '${resolve('./components/Toast/Toaster.astro')}';
						export { toast } from '${resolve('./components/Toast/toast.js')}';
					`,
					'studiocms:ui/components/card': `export { default as Card } from '${resolve('./components/Card/Card.astro')}';`,
					'studiocms:ui/components/modal': `
						export { default as Modal } from '${resolve('./components/Modal/Modal.astro')}';
						export { ModalHelper } from '${resolve('./components/Modal/modal.js')}';
					`,
					'studiocms:ui/components/select': `
						export { default as Select } from '${resolve('./components/Select/Select.astro')}';
						export { default as SearchSelect } from '${resolve('./components/SearchSelect/SearchSelect.astro')}';
					`,
					'studiocms:ui/components/select/script': `
						export { SUISelectElement } from '${resolve('./components/Select/select.js')}';
					`,
					'studiocms:ui/components/dropdown': `
						export { default as Dropdown } from '${resolve('./components/Dropdown/Dropdown.astro')}';
						export { DropdownHelper } from '${resolve('./components/Dropdown/dropdown.js')}';
					`,
					'studiocms:ui/components/user': `export { default as User } from '${resolve('./components/User/User.astro')}';`,
					'studiocms:ui/components/tabs': `
						export { default as Tabs } from '${resolve('./components/Tabs/Tabs.astro')}';
						export { default as TabItem } from '${resolve('./components/Tabs/TabItem.astro')}';
					`,
					'studiocms:ui/components/accordion': `
						export { default as Accordion } from '${resolve('./components/Accordion/Accordion.astro')}';
						export { default as AccordionItem } from '${resolve('./components/Accordion/Item.astro')}';
					`,
					'studiocms:ui/components/footer': `export { default as Footer } from '${resolve('./components/Footer/Footer.astro')}';`,
					'studiocms:ui/components/progress': `
						export { default as Progress } from '${resolve('./components/Progress/Progress.astro')}';
						export { ProgressHelper } from '${resolve('./components/Progress/helper.js')}';
					`,
					'studiocms:ui/components/sidebar': `
						export { default as Sidebar } from '${resolve('./components/Sidebar/Single.astro')}';
						export { default as DoubleSidebar } from '${resolve('./components/Sidebar/Double.astro')}';
						export { SingleSidebarHelper, DoubleSidebarHelper } from '${resolve('./components/Sidebar/helpers.js')}';
					`,
					'studiocms:ui/components/breadcrumbs': `export { default as Breadcrumbs } from '${resolve('./components/Breadcrumbs/Breadcrumbs.astro')}';`,
					'studiocms:ui/components/group': `export { default as Group } from '${resolve('./components/Group/Group.astro')}';`,
					'studiocms:ui/components/badge': `export { default as Badge } from '${resolve('./components/Badge/Badge.astro')}';`,
					'studiocms:ui/components/icon': `
						export { default as Icon } from '${resolve('./components/Icon/Icon.astro')}';
						export { default as IconBase } from '${resolve('./components/Icon/IconBase.astro')}';
					`,
					'studiocms:ui/components/skeleton': `export { default as Skeleton } from '${resolve('./components/Skeleton/Skeleton.astro')}';`,
					'studiocms:ui/components/tooltip': `export { default as Tooltip } from '${resolve('./components/Tooltip/Tooltip.astro')}';`,
				};

				const virtualComponents: Record<string, string> = {
					...componentMap,
					'studiocms:ui/components': Object.values(componentMap).join('\n'),
				};

				addVirtualImports(params, {
					name: '@studiocms/ui',
					imports: {
						// Internal Version
						'studiocms:ui/version': `export default '${pkgJson.version}';`,
						// Styles
						'studiocms:ui/global-css': `import '${resolve('./css/global.css')}';`,
						'studiocms:ui/prose': `import '${resolve('./css/prose.css')}';`,
						'studiocms:ui/custom-css': `import '${rootResolve(options.customCss ? options.customCss : '')}';`,
						// Scripts
						'studiocms:ui/scripts/checkbox': `import '${resolve('./components/Checkbox/checkbox.js')}';`,
						'studiocms:ui/scripts/radiogroup': `import '${resolve('./components/RadioGroup/radiogroup.js')}';`,
						'studiocms:ui/scripts/searchselect': `import '${resolve('./components/SearchSelect/searchselect.js')}';`,
						'studiocms:ui/scripts/select': `import '${resolve('./components/Select/select.js')}';`,
						'studiocms:ui/scripts/tabs': `import '${resolve('./components/Tabs/tabs.js')}';`,
						'studiocms:ui/scripts/themetoggle': `import '${resolve('./components/ThemeToggle/themetoggle.js')}';`,
						'studiocms:ui/scripts/toaster': `import '${resolve('./components/Toast/toaster.js')}';`,
						'studiocms:ui/scripts/toast': `import '${resolve('./components/Toast/toast.js')}';`,
						'studiocms:ui/scripts/toggle': `import '${resolve('./components/Toggle/toggle.js')}';`,
						'studiocms:ui/scripts/tooltip': `import '${resolve('./components/Tooltip/tooltip.js')}';`,
						'studiocms:ui/scripts/accordion': `import '${resolve('./components/Accordion/accordion.js')}';`,
						'studiocms:ui/scripts/progress': `import '${resolve('./components/Progress/progress.js')}';`,
						// Components
						...virtualComponents,

						'studiocms:ui/utils': `
							export { ThemeHelper, Theme } from '${resolve('./utils/ThemeHelper.js')}';
						`,

						'studiocms:ui/icons': `
							${icons.integrationCollections ? icons.integrationCollections : ''}
							export const availableIcons = ${JSON.stringify(icons.availableIcons)};
							export const iconCollections = ${JSON.stringify(icons.collectionNames)};
						`,
					},
				});

				if (!options.noInjectCSS) {
					injectScript('page-ssr', `import 'studiocms:ui/global-css';`);
				}

				if (options.customCss) {
					injectScript('page-ssr', `import 'studiocms:ui/custom-css';`);
				}

				addDevToolbarApp({
					id: 'studiocms-ui-toolbar',
					name: 'StudioCMS/UI',
					entrypoint: resolve('./toolbar/index.js'),
					icon: studiocmsLogo,
				});
			},
			'astro:config:done': ({ injectTypes }) => {
				injectTypes(
					generateIconTypes('icons.d.ts', {
						collections:
							icons.collections && Object.keys(icons.collections).length > 0
								? `${Object.keys(icons.collections)
										.map((collection) => {
											return `'${collection}': import('@studiocms/ui/types').IconifyJSON;`;
										})
										.join('\n')}`
								: 'export const collections: Record<string, import("@studiocms/ui/types").IconifyJSON>;',
						availableIcons: `('${icons.availableIcons.join("'\n | '")}')[]`,
						iconCollections: `('${icons.collectionNames.join("'\n | '")}')[]`,
					})
				);
			},
			/* v8 ignore stop */
		},
	};
}
