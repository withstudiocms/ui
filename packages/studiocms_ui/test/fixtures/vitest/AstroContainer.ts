import {
	experimental_AstroContainer as AstroContainer,
	type AstroContainerOptions,
	type ContainerRenderOptions,
} from 'astro/container';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import { test as baseTest } from 'vitest';

export function cleanAstroAttributes(str: string, mockPath: string): string {
	const regex1 = /\s*data-astro-[a-zA-Z0-9-]*(?:="[^"]*")?/g;
	const replacer1 = '';
	const regex2 = /src="[^"?]*(\?[^"]*)"/g;
	const replacer2 = (_: string, p1: string) => `src="${mockPath}${p1}"`;
	const regex3 = /(<meta name="generator" content="Astro v)[0-9]+\.[0-9]+\.[0-9]+(")/g;
	const replacer3 = '$10.0.0-test$2';
	const regex4 = /(<img[^>]*href=)[^&"]*(&[^>]*>|"[^>]*>)/g;
	const replacer4 = '$1%2Fmock%2Fpath%2Fimage.webp$2';

	return str
		.replace(regex1, replacer1)
		.replace(regex2, replacer2)
		.replace(regex3, replacer3)
		.replace(regex4, replacer4);
}

/**
 * Extends the base test with custom options for container-based component rendering.
 *
 * @remarks
 * This test extension provides a `renderComponent` fixture that creates an `AstroContainer`
 * and exposes a function to render Astro components to string with mocked locals.
 * The rendered output is cleaned of Astro-specific attributes for testing purposes.
 *
 * @param containerOptions - Options used to create the `AstroContainer`.
 * @param use - Callback that receives a function to render a component.
 *
 * @returns
 * The `renderComponent` fixture provides an async function that:
 * - Renders the given Astro component to a string using the container.
 * - Applies mock locals to the rendering context.
 * - Cleans Astro-specific attributes from the output.
 * - Returns the cleaned HTML string.
 *
 * @example
 * ```typescript
 * test('render component', async ({ renderComponent }) => {
 *   const result = await renderComponent(MyComponent, 'MyComponent', { props: { title: 'Test' } });
 *   expect(result).toMatchSnapshot();
 * });
 * ```
 */
export const test = baseTest.extend<{
	containerOptions?: AstroContainerOptions;
	renderComponent: (
		component: AstroComponentFactory,
		name: string,
		opts?: ContainerRenderOptions
	) => Promise<string>;
}>({
	renderComponent: async ({ containerOptions }, use) => {
		const container = await AstroContainer.create(containerOptions);
		const render = async (
			component: AstroComponentFactory,
			name: string,
			opts: ContainerRenderOptions = {}
		) => {
			const raw = await container.renderToString(component, opts);

			return cleanAstroAttributes(raw, `/mock/path/${name}.astro`);
		};
		await use(render);
	},
});
