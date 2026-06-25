/**
 * Triple slash references for ambient types
 *
 * @remarks
 * The references are duplicated here to ensure that they are included in the
 * emitted declaration files. as well as available in the source code for IDEs
 * during development.
 */

/// <reference path="./events.d.ts" />
/// <reference path="./virtuals.d.ts" />
/// <reference path="../dist/events.d.ts" preserve="true" />
/// <reference path="../dist/virtuals.d.ts" preserve="true" />

import fs from "node:fs";
import type { IconifyJSON } from "@iconify/types";
import { icons as heroicons } from "@iconify-json/heroicons";
import type { AstroIntegration } from "astro";
import transitionEventPolyfill from "astro-transition-event-polyfill";
import { studiocmsLogo } from "./toolbar/icon.js";
import { generateIconTypes } from "./utils/typegen.js";

const pkgJson = JSON.parse(
	fs.readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
);

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
	 * Disables the CSS reset. Can be manually included.
	 *
	 * @example
	 * ```ts
	 * import 'studiocms:ui/reset-css';
	 * ```
	 */
	noInjectResetCSS?: boolean;

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

function virtualImportsPlugin(name: string, imports: Record<string, string>) {
	return {
		name,
		resolveId(id: string) {
			if (id in imports) return `\0${id}`;
		},
		load(id: string) {
			if (id.startsWith("\0")) return imports[id.slice(1)];
		},
	};
}

export function createIconifyCollection(
	icons?: Record<string, IconifyJSON>,
): IconifyCollections {
	const collections: Record<string, IconifyJSON> = {};
	const collectionNames: string[] = [];
	const availableIcons: string[] = [];

	if (!icons) {
		return {
			collections,
			collectionNames,
			integrationCollections: undefined,
			availableIcons,
		};
	}

	for (const [prefix, collection] of Object.entries(icons)) {
		collections[prefix] = collection;
		collectionNames.push(prefix);

		for (const icon of Object.keys(collection.icons)) {
			availableIcons.push(`${prefix}:${icon}`);
		}
	}

	const integrationCollections = `export const collections = ${JSON.stringify(collections)};`;

	return {
		collections,
		collectionNames,
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
		name: "@studiocms/ui",
		hooks: {
			/* v8 ignore start */
			/** Astro integrations cannot be properly tested for code coverage */
			"astro:config:setup": (params) => {
				try {
					const { addDevToolbarApp, injectScript, updateConfig } = params;

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
						"studiocms:ui/components/alert": `export { default as Alert } from '${new URL("./components/Alert/Alert.astro", import.meta.url)}';`,
						"studiocms:ui/components/button": `export { default as Button } from '${new URL("./components/Button/Button.astro", import.meta.url)}';`,
						"studiocms:ui/components/divider": `export { default as Divider } from '${new URL("./components/Divider/Divider.astro", import.meta.url)}';`,
						"studiocms:ui/components/input": `export { default as Input } from '${new URL("./components/Input/Input.astro", import.meta.url)}';`,
						"studiocms:ui/components/textarea": `export { default as Textarea } from '${new URL("./components/Textarea/Textarea.astro", import.meta.url)}';`,
						"studiocms:ui/components/row": `export { default as Row } from '${new URL("./components/Row/Row.astro", import.meta.url)}';`,
						"studiocms:ui/components/center": `export { default as Center } from '${new URL("./components/Center/Center.astro", import.meta.url)}';`,
						"studiocms:ui/components/checkbox": `export { default as Checkbox } from '${new URL("./components/Checkbox/Checkbox.astro", import.meta.url)}';`,
						"studiocms:ui/components/toggle": `export { default as Toggle } from '${new URL("./components/Toggle/Toggle.astro", import.meta.url)}';`,
						"studiocms:ui/components/radiogroup": `export { default as RadioGroup } from '${new URL("./components/RadioGroup/RadioGroup.astro", import.meta.url)}';`,
						"studiocms:ui/components/toaster": `export { default as Toaster } from '${new URL("./components/Toast/Toaster.astro", import.meta.url)}';`,
						"studiocms:ui/components/toaster/client": `export { toast } from '${new URL("./components/Toast/toast.js", import.meta.url)}';`,
						"studiocms:ui/components/card": `export { default as Card } from '${new URL("./components/Card/Card.astro", import.meta.url)}';`,
						"studiocms:ui/components/modal": `export { default as Modal } from '${new URL("./components/Modal/Modal.astro", import.meta.url)}';`,
						"studiocms:ui/components/modal/client": `export { ModalHelper } from '${new URL("./components/Modal/modal.js", import.meta.url)}';`,
						"studiocms:ui/components/select": `
							export { default as Select } from '${new URL("./components/Select/Select.astro", import.meta.url)}';
							export { default as SearchSelect } from '${new URL("./components/SearchSelect/SearchSelect.astro", import.meta.url)}';
						`,
						"studiocms:ui/components/dropdown": `export { default as Dropdown } from '${new URL("./components/Dropdown/Dropdown.astro", import.meta.url)}';`,
						"studiocms:ui/components/dropdown/client": `export { DropdownHelper } from '${new URL("./components/Dropdown/dropdown.js", import.meta.url)}';`,
						"studiocms:ui/components/user": `export { default as User } from '${new URL("./components/User/User.astro", import.meta.url)}';`,
						"studiocms:ui/components/tabs": `
							export { default as Tabs } from '${new URL("./components/Tabs/Tabs.astro", import.meta.url)}';
							export { default as TabItem } from '${new URL("./components/Tabs/TabItem.astro", import.meta.url)}';
						`,
						"studiocms:ui/components/accordion": `
							export { default as Accordion } from '${new URL("./components/Accordion/Accordion.astro", import.meta.url)}';
							export { default as AccordionItem } from '${new URL("./components/Accordion/Item.astro", import.meta.url)}';
						`,
						"studiocms:ui/components/footer": `export { default as Footer } from '${new URL("./components/Footer/Footer.astro", import.meta.url)}';`,
						"studiocms:ui/components/progress": `export { default as Progress } from '${new URL("./components/Progress/Progress.astro", import.meta.url)}';`,
						"studiocms:ui/components/progress/client": `export { ProgressHelper } from '${new URL("./components/Progress/helper.js", import.meta.url)}';`,
						"studiocms:ui/components/sidebar": `
							export { default as Sidebar } from '${new URL("./components/Sidebar/Single.astro", import.meta.url)}';
							export { default as DoubleSidebar } from '${new URL("./components/Sidebar/Double.astro", import.meta.url)}';
						`,
						"studiocms:ui/components/sidebar/client": `export { SingleSidebarHelper, DoubleSidebarHelper } from '${new URL("./components/Sidebar/helpers.js", import.meta.url)}';`,
						"studiocms:ui/components/breadcrumbs": `export { default as Breadcrumbs } from '${new URL("./components/Breadcrumbs/Breadcrumbs.astro", import.meta.url)}';`,
						"studiocms:ui/components/group": `export { default as Group } from '${new URL("./components/Group/Group.astro", import.meta.url)}';`,
						"studiocms:ui/components/badge": `export { default as Badge } from '${new URL("./components/Badge/Badge.astro", import.meta.url)}';`,
						"studiocms:ui/components/icon": `
							export { default as Icon } from '${new URL("./components/Icon/Icon.astro", import.meta.url)}';
							export { default as IconBase } from '${new URL("./components/Icon/IconBase.astro", import.meta.url)}';
						`,
						"studiocms:ui/components/skeleton": `export { default as Skeleton } from '${new URL("./components/Skeleton/Skeleton.astro", import.meta.url)}';`,
						"studiocms:ui/components/tooltip": `export { default as Tooltip } from '${new URL("./components/Tooltip/Tooltip.astro", import.meta.url)}';`,
					};

					const ServerComponents = Object.entries(componentMap).filter(
						([key]) => !key.endsWith("/client"),
					);

					const ClientComponents = Object.entries(componentMap).filter(
						([key]) => key.endsWith("/client"),
					);

					const virtualComponents: Record<string, string> = {
						...componentMap,
						"studiocms:ui/components": ServerComponents.map(
							([_, value]) => value,
						).join("\n"),
						"studiocms:ui/components/client": ClientComponents.map(
							([_, value]) => value,
						).join("\n"),
					};

					updateConfig({
						vite: {
							plugins: [
								virtualImportsPlugin("@studiocms/ui", {
									// Internal Version
									"studiocms:ui/version": `export default '${pkgJson.version}';`,
									// Styles
									"studiocms:ui/global-css": `import '${new URL("./css/global.css", import.meta.url)}';`,
									"studiocms:ui/reset-css": `import '${new URL("./css/resets.css", import.meta.url)}';`,
									"studiocms:ui/prose": `import '${new URL("./css/prose.css", import.meta.url)}';`,
									"studiocms:ui/custom-css": options.customCss
										? `import '${new URL(options.customCss, params.config.root.pathname)}';`
										: "",
									// Scripts
									"studiocms:ui/scripts/checkbox": `import '${new URL("./components/Checkbox/checkbox.js", import.meta.url)}';`,
									"studiocms:ui/scripts/radiogroup": `import '${new URL("./components/RadioGroup/radiogroup.js", import.meta.url)}';`,
									"studiocms:ui/scripts/searchselect": `import '${new URL("./components/SearchSelect/searchselect.js", import.meta.url)}';`,
									"studiocms:ui/scripts/select": `import '${new URL("./components/Select/select.js", import.meta.url)}';`,
									"studiocms:ui/scripts/tabs": `import '${new URL("./components/Tabs/tabs.js", import.meta.url)}';`,
									"studiocms:ui/scripts/themetoggle": `import '${new URL("./components/ThemeToggle/themetoggle.js", import.meta.url)}';`,
									"studiocms:ui/scripts/toaster": `import '${new URL("./components/Toast/toaster.js", import.meta.url)}';`,
									"studiocms:ui/scripts/toast": `import '${new URL("./components/Toast/toast.js", import.meta.url)}';`,
									"studiocms:ui/scripts/toggle": `import '${new URL("./components/Toggle/toggle.js", import.meta.url)}';`,
									"studiocms:ui/scripts/tooltip": `import '${new URL("./components/Tooltip/tooltip.js", import.meta.url)}';`,
									"studiocms:ui/scripts/accordion": `import '${new URL("./components/Accordion/accordion.js", import.meta.url)}';`,
									"studiocms:ui/scripts/progress": `import '${new URL("./components/Progress/progress.js", import.meta.url)}';`,
									"studiocms:ui/components/select/script": `
									export { SUISelectElement } from '${new URL("./components/Select/select.js", import.meta.url)}';
								`,
									// Components
									...virtualComponents,

									"studiocms:ui/utils": `
									export { ThemeHelper, Theme } from '${new URL("./utils/ThemeHelper.js", import.meta.url)}';
								`,

									"studiocms:ui/icons": `
									${icons.integrationCollections ? icons.integrationCollections : ""}
									export const availableIcons = ${JSON.stringify(icons.availableIcons)};
									export const iconCollections = ${JSON.stringify(icons.collectionNames)};
								`,
								}),
							],
						},
					});

					if (!options.noInjectResetCSS || !options.noInjectCSS) {
						injectScript("page-ssr", `import 'studiocms:ui/reset-css';`);
					}

					if (!options.noInjectCSS) {
						injectScript("page-ssr", `import 'studiocms:ui/global-css';`);
					}

					if (options.customCss) {
						injectScript("page-ssr", `import 'studiocms:ui/custom-css';`);
					}

					addDevToolbarApp({
						id: "studiocms-ui-toolbar",
						name: "StudioCMS/UI",
						entrypoint: new URL("./toolbar/index.js", import.meta.url),
						icon: studiocmsLogo,
					});
				} catch (err) {
					console.error(err);
				}
			},
			"astro:config:done": ({ injectTypes }) => {
				injectTypes(
					generateIconTypes("icons.d.ts", {
						collections:
							icons.collections && Object.keys(icons.collections).length > 0
								? `${Object.keys(icons.collections)
										.map((collection) => {
											return `'${collection}': import('@studiocms/ui/types').IconifyJSON;`;
										})
										.join("\n")}`
								: 'export const collections: Record<string, import("@studiocms/ui/types").IconifyJSON>;',
						availableIcons: `('${icons.availableIcons.join("'\n | '")}')[]`,
						iconCollections: `('${icons.collectionNames.join("'\n | '")}')[]`,
					}),
				);
			},
			/* v8 ignore stop */
		},
	};
}
