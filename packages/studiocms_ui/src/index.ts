import fs from 'node:fs';
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
	 * import 'studiocms:ui/global-css';
   	 */
	noInjectCSS?: boolean;
};

export default function integration(options: Options = {}): AstroIntegration {
	// Resolve paths relative to the current file (pkg/src/index.ts)
	const { resolve } = createResolver(import.meta.url);

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
							export { default as ThemeToggle } from '${resolve('./components/ThemeToggle/ThemeToggle.astro')}';
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

							export { ProgressHelper } from '${resolve('./components/Progress/helper.js')}';
							export { SingleSidebarHelper, DoubleSidebarHelper } from '${resolve('./components/Sidebar/helpers.js')}';
							export { toast } from '${resolve('./components/Toast/toast.js')}';
							export { ModalHelper } from '${resolve('./components/Modal/modal.js')}';
							export { DropdownHelper } from '${resolve('./components/Dropdown/dropdown.js')}';

							export * from '${resolve('./components/Icon/iconType.js')}';
						`,

						'studiocms:ui/utils': `
							export { ThemeHelper, Theme } from '${resolve('./utils/ThemeHelper.js')}';
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
					filename: 'types.d.ts',
					content: `
						declare module 'studiocms:ui/version' {
							const version: string;
							export default version;
						}

						declare module 'studiocms:ui/global-css' {}

						declare module 'studiocms:ui/custom-css' {}

						declare module 'studiocms:ui/scripts/*' {}

						declare module 'studiocms:ui/components' {
							export const Button: typeof import('${resolve('./components/Button/Button.astro')}').default;
							export const Divider: typeof import('${resolve('./components/Divider/Divider.astro')}').default;
							export const Input: typeof import('${resolve('./components/Input/Input.astro')}').default;
							export const Row: typeof import('${resolve('./components/Row/Row.astro')}').default;
							export const Center: typeof import('${resolve('./components/Center/Center.astro')}').default;
							export const Textarea: typeof import('${resolve('./components/Textarea/Textarea.astro')}').default;
							export const Checkbox: typeof import('${resolve('./components/Checkbox/Checkbox.astro')}').default;
							export const Toggle: typeof import('${resolve('./components/Toggle/Toggle.astro')}').default;
							export const RadioGroup: typeof import('${resolve('./components/RadioGroup/RadioGroup.astro')}').default;
							export const Toaster: typeof import('${resolve('./components/Toast/Toaster.astro')}').default;
							export const Card: typeof import('${resolve('./components/Card/Card.astro')}').default;
							export const Modal: typeof import('${resolve('./components/Modal/Modal.astro')}').default;
							export const Select: typeof import('${resolve('./components/Select/Select.astro')}').default;
							export const SearchSelect: typeof import('${resolve('./components/SearchSelect/SearchSelect.astro')}').default;
							export const Dropdown: typeof import('${resolve('./components/Dropdown/Dropdown.astro')}').default;
							export const User: typeof import('${resolve('./components/User/User.astro')}').default;
							export const ThemeToggle: typeof import('${resolve('./components/ThemeToggle/ThemeToggle.astro')}').default;
							export const Tabs: typeof import('${resolve('./components/Tabs/Tabs.astro')}').default;
							export const TabItem: typeof import('${resolve('./components/Tabs/TabItem.astro')}').default;
							export const Accordion: typeof import('${resolve('./components/Accordion/Accordion.astro')}').default;
							export const AccordionItem: typeof import('${resolve('./components/Accordion/Item.astro')}').default;
							export const Footer: typeof import('${resolve('./components/Footer/Footer.astro')}').default;
							export const Progress: typeof import('${resolve('./components/Progress/Progress.astro')}').default;
							export const Sidebar: typeof import('${resolve('./components/Sidebar/Single.astro')}').default;
							export const DoubleSidebar: typeof import('${resolve('./components/Sidebar/Double.astro')}').default;
							export const Breadcrumbs: typeof import('${resolve('./components/Breadcrumbs/Breadcrumbs.astro')}').default;
							export const Group: typeof import('${resolve('./components/Group/Group.astro')}').default;
							export const Badge: typeof import('${resolve('./components/Badge/Badge.astro')}').default;
							export const Icon: typeof import('${resolve('./components/Icon/Icon.astro')}').default;
							export const IconBase: typeof import('${resolve('./components/Icon/IconBase.astro')}').default;
							export const toast: typeof import('${resolve('./components/Toast/toast.js')}').toast;
							export type HeroIconName = import('${resolve('./components/Icon/iconType.js')}').HeroIconName;

							export class ModalHelper {
								private element;
								private cancelButton;
								private confirmButton;
								private isForm;
								private modalForm;
								/**
								 * A helper to manage modals.
								 * @param id The ID of the modal.
								 * @param triggerID The ID of the element that should trigger the modal.
								 */
								constructor(id: string, triggerID?: string);
								/**
								 * A helper function which adds event listeners to the modal buttons to close the modal when clicked.
								 * @param id The ID of the modal.
								 * @param dismissable Whether the modal is dismissable.
								 */
								private addButtonListeners;
								/**
								 * A helper function to close the modal when the user clicks outside of it.
								 */
								private addDismissiveClickListener;
								/**
								 * A function to show the modal.
								 */
								show: () => void;
								/**
								 * A function to hide the modal.
								 */
								hide: () => void;
								/**
								 * A function to add another trigger to show the modal with.
								 * @param elementID The ID of the element that should trigger the modal when clicked.
								 */
								bindTrigger: (elementID: string) => void;
								/**
								 * Registers a callback for the cancel button.
								 * @param func The callback function.
								 */
								registerCancelCallback: (func: () => void) => void;
								/**
								 * Registers a callback for the confirm button.
								 * @param func The callback function. If the modal is a form, the function will be called with
								 * the form data as the first argument.
								 */
								registerConfirmCallback: (func: (data?: FormData | undefined) => void) => void;
							}

							export class DropdownHelper {
								private container;
								private toggleEl;
								private dropdown;
								private alignment;
								private triggerOn;
								private fullWidth;
								private focusIndex;
								active: boolean;
								/**
								 * A helper function to interact with dropdowns.
								 * @param id The ID of the dropdown.
								 * @param fullWidth Whether the dropdown should be full width. Not needed normally.
								 */
								constructor(id: string, fullWidth?: boolean);
								/**
								 * Registers a click callback for the dropdown options. Whenever one of the options
								 * is clicked, the callback will be called with the value of the option.
								 * @param func The callback function.
								 */
								registerClickCallback: (func: (value: string) => void) => void;
								/**
								 * Sets up all listeners for the dropdown.
								 */
								private initialBehaviorRegistration;
								/**
								 * Registers callbacks to hide the dropdown when an option is clicked.
								 */
								private initialOptClickRegistration;
								/**
								 * A function to toggle the dropdown.
								 */
								toggle: () => void;
								/**
								 * A function to hide the dropdown.
								 */
								hide: () => void;
								/**
								 * A function to show the dropdown.
								 */
								show: () => void;
								/**
								 * A jQuery-like function to hide the dropdown when clicking outside of it.
								 * @param element The element to hide when clicking outside of it.
								 */
								private hideOnClickOutside;
							}

							export class ProgressHelper {
								private bar;
								private progress;
								private value;
								private max;
								constructor(id: string);
								getValue(): number;
								setValue(value: number): void;
								getMax(): number;
								setMax(value: number): void;
								getPercentage(): number;
							}

							export class SingleSidebarHelper {
								private sidebar;
								private sidebarToggle?;
								/**
								 * A helper to manage the sidebar with.
								 * @param toggleID The ID of the element that should toggle the sidebar.
								 */
								constructor(toggleID?: string);
								/**
								 * A helper function register an element which should toggle the sidebar.
								 * @param elementID The ID of the element that should toggle the sidebar.
								 */
								toggleSidebarOnClick: (elementID: string) => void;
								/**
								 * A helper function to hide the sidebar when an element is clicked.
								 * @param elementID The ID of the element that should hide the sidebar.
								 */
								hideSidebarOnClick: (elementID: string) => void;
								/**
								 * A helper function to show the sidebar when an element is clicked.
								 * @param elementID The ID of the element that should show the sidebar.
								 */
								showSidebarOnClick: (elementID: string) => void;
								/**
								 * A function to hide the sidebar.
								 */
								hideSidebar: () => void;
								/**
								 * A function to show the sidebar.
								 */
								showSidebar: () => void;
							}
							
							export class DoubleSidebarHelper {
								private sidebarsContainer;
								/**
								 * A helper to manage the double sidebar with.
								 */
								constructor();
								/**
								 * A helper function to hide the sidebar when an element is clicked.
								 * @param elementID The ID of the element that should hide the sidebar.
								 */
								hideSidebarOnClick: (elementID: string) => void;
								/**
								 * A helper function to show the outer sidebar when an element is clicked.
								 * @param elementID The ID of the element that should show the outer sidebar.
								 */
								showOuterOnClick: (elementID: string) => void;
								/**
								 * A helper function to show the inner sidebar when an element is clicked.
								 * @param elementID The ID of the element that should show the inner sidebar.
								 */
								showInnerOnClick: (elementID: string) => void;
								/**
								 * A function to show the inner sidebar.
								 */
								showInnerSidebar: () => void;
								/**
								 * A function to show the outer sidebar.
								 */
								showOuterSidebar: () => void;
								/**
								 * A function to hide the sidebar altogether.
								 */
								hideSidebar: () => void;
							}
						}

						declare module 'studiocms:ui/utils' {
							export type Theme = import('${resolve('./utils/ThemeHelper.js')}').Theme;

							type ThemeChangeCallback = (newTheme: Theme, oldTheme: Theme) => void;

							/**
							 * A helper to toggle, set and get the current StudioCMS UI theme.
							 */
							export class ThemeHelper {
								private themeManagerElement;
								private observer;
								private themeChangeCallbacks;
								/**
								 * A helper to toggle, set and get the current StudioCMS UI theme.
								 * @param themeProvider The element that should carry the data-theme attribute (replaces the document root)
								 */
								constructor(themeProvider?: HTMLElement);
								/**
								 * Get the current theme.
								 * @param {boolean} resolveSystemTheme Whether to resolve the \`system\` theme to the actual theme (\`dark\` or \`light\`)
								 * @returns {Theme} The current theme.
								 */
								getTheme: <T extends boolean>(resolveSystemTheme?: T) => T extends true ? "dark" | "light" : Theme;
								/**
								 * Sets the current theme.
								 * @param theme The new theme. One of \`dark\`, \`light\` or \`system\`.
								 */
								setTheme: (theme: Theme) => void;
								/**
								 * Toggles the current theme.
								 *
								 * If the theme is set to \`system\` (or no theme is set via the root element),
								 * the theme is set depending on the user's color scheme preference (set in the browser).
								 */
								toggleTheme: () => void;
								/**
								 * Register an element to act as a toggle! When clicked, it will toggle the theme.
								 * @param toggle The HTML element that should act as the toggle
								 */
								registerToggle: (toggle: HTMLElement | null) => void;
								/**
								 * Allows for adding a callback that gets called whenever the theme changes.
								 * @param callback The callback to be executed
								 */
								onThemeChange: (callback: ThemeChangeCallback) => void;
								/**
								 * Simply gets the first mutation and calls all registered callbacks.
								 * @param mutations The mutations array from the observer. Due to the specified options, this will always be a 1-length array,
								 */
								private themeManagerMutationHandler;
							}
						}
					`,
				});
			},
		},
	};
}
