/// <reference path="./events.d.ts" preserve="true" />
/// <reference path="./virtuals.d.ts" preserve="true" />

import fs from 'node:fs';
import { icons as heroicons } from '@iconify-json/heroicons';
import type { IconifyJSON } from '@iconify/types';
import type { AstroIntegration } from 'astro';
import transitionEventPolyfill from 'astro-transition-event-polyfill';
import { studiocmsLogo } from './toolbar/icon.js';
import { addVirtualImports, createResolver } from './utils/integration-utils.js';
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

/**
 * Creates a collection of icon prefixes, integration collections, and available icons from the provided IconifyJSON records.
 *
 * @param {Record<string, IconifyJSON>} [icons] - An optional record of icon collections keyed by their prefix.
 * @returns {object} An object containing:
 * - `iconCollections`: An array of icon collection prefixes.
 * - `integrationCollections`: An array of strings representing the export statements for each icon collection.
 * - `availableIcons`: An array of strings representing the available icons in the format `prefix:icon`.
 */
function createIconifyPrefixCollection(icons?: Record<string, IconifyJSON>): {
	iconCollections: string[];
	integrationCollections: string[];
	availableIcons: string[];
} {
	const iconCollections: string[] = [];

	const integrationCollections: string[] = [];

	const availableIcons: string[] = [];

	if (!icons) {
		return {
			iconCollections,
			integrationCollections,
			availableIcons,
		};
	}

	for (const [prefix, collection] of Object.entries(icons)) {
		iconCollections.push(prefix);

		integrationCollections.push(`export const ${prefix} = ${JSON.stringify(collection)};`);

		for (const icon of Object.keys(collection.icons)) {
			availableIcons.push(`${prefix}:${icon}`);
		}
	}

	return {
		iconCollections,
		integrationCollections,
		availableIcons,
	};
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

	let icons: {
		iconCollections: string[];
		integrationCollections: string[];
		availableIcons: string[];
	} = {
		iconCollections: [],
		integrationCollections: [],
		availableIcons: [],
	};

	return {
		name: '@studiocms/ui',
		hooks: {
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

				icons = createIconifyPrefixCollection(optIcons);

				addVirtualImports(params, {
					name: '@studiocms/ui',
					imports: {
						// Internal Version
						'studiocms:ui/version': `export default '${pkgJson.version}';`,
						// Styles
						'studiocms:ui/global-css': `import '${resolve('./css/global.css')}';`,
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
						'studiocms:ui/scripts/accordion': `import '${resolve('./components/Accordion/accordion.js')}';`,
						'studiocms:ui/scripts/progress': `import '${resolve('./components/Progress/progress.js')}';`,
						// Components
						'studiocms:ui/components': `
							export { default as Button } from '${resolve('./components/Button/Button.astro')}';
							export { default as Divider } from '${resolve('./components/Divider/Divider.astro')}';
							export { default as Input } from '${resolve('./components/Input/Input.astro')}';
							export { default as Row } from '${resolve('./components/Row/Row.astro')}';
							export { default as Center } from '${resolve('./components/Center/Center.astro')}';
							export { default as Textarea } from '${resolve('./components/Textarea/Textarea.astro')}';
							export { default as Checkbox } from '${resolve('./components/Checkbox/Checkbox.astro')}';
							export { default as Toggle } from '${resolve('./components/Toggle/Toggle.astro')}';
							export { default as RadioGroup } from '${resolve('./components/RadioGroup/RadioGroup.astro')}';
							export { default as Toaster } from '${resolve('./components/Toast/Toaster.astro')}';
							export { default as Card } from '${resolve('./components/Card/Card.astro')}';
							export { default as Modal } from '${resolve('./components/Modal/Modal.astro')}';
							export { default as Select } from '${resolve('./components/Select/Select.astro')}';
							export { default as SearchSelect } from '${resolve('./components/SearchSelect/SearchSelect.astro')}';
							export { default as Dropdown } from '${resolve('./components/Dropdown/Dropdown.astro')}';
							export { default as User } from '${resolve('./components/User/User.astro')}';
							export { default as Tabs } from '${resolve('./components/Tabs/Tabs.astro')}';
							export { default as TabItem } from '${resolve('./components/Tabs/TabItem.astro')}';
							export { default as Accordion } from '${resolve('./components/Accordion/Accordion.astro')}';
							export { default as AccordionItem } from '${resolve('./components/Accordion/Item.astro')}';
							export { default as Footer } from '${resolve('./components/Footer/Footer.astro')}';
							export { default as Progress } from '${resolve('./components/Progress/Progress.astro')}';
							export { default as Sidebar } from '${resolve('./components/Sidebar/Single.astro')}';
							export { default as DoubleSidebar } from '${resolve('./components/Sidebar/Double.astro')}';
							export { default as Breadcrumbs } from '${resolve('./components/Breadcrumbs/Breadcrumbs.astro')}';
							export { default as Group } from '${resolve('./components/Group/Group.astro')}';
							export { default as Badge } from '${resolve('./components/Badge/Badge.astro')}';
							export { default as Icon } from '${resolve('./components/Icon/Icon.astro')}';
							export { default as IconBase } from '${resolve('./components/Icon/IconBase.astro')}';
							export { default as Skeleton } from '${resolve('./components/Skeleton/Skeleton.astro')}';

							export { ProgressHelper } from '${resolve('./components/Progress/helper.js')}';
							export { SingleSidebarHelper, DoubleSidebarHelper } from '${resolve('./components/Sidebar/helpers.js')}';
							export { toast } from '${resolve('./components/Toast/toast.js')}';
							export { ModalHelper } from '${resolve('./components/Modal/modal.js')}';
							export { DropdownHelper } from '${resolve('./components/Dropdown/dropdown.js')}';
						`,

						'studiocms:ui/utils': `
							export { ThemeHelper, Theme } from '${resolve('./utils/ThemeHelper.js')}';
						`,

						'studiocms:ui/icons': `
							${icons.integrationCollections.join('\n')}

							export const availableIcons = ${JSON.stringify(icons.availableIcons)};

							export const iconCollections = ${JSON.stringify(icons.iconCollections)};
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
				injectTypes({
					filename: 'icons.d.ts',
					content: `
						declare module 'studiocms:ui/icons' {
							export const availableIcons: ('${icons.availableIcons.join("'\n | '")}')[];
							export const iconCollections: ('${icons.iconCollections.join("'\n | '")}')[];

							${icons.iconCollections
								.map((collection) => {
									return `export const ${collection}: import('@studiocms/ui/types').IconifyJSON;`;
								})
								.join('\n')}

							export type AvailableIcons = (typeof availableIcons)[number];
							export type IconCollections = (typeof iconCollections)[number];
						}
					`,
				});
			},
		},
	};
}
