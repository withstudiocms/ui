import type { AstroIntegration } from 'astro';
import { createResolver } from './utils/create-resolver';

// biome-ignore lint/complexity/noBannedTypes: Will be implemented in v0.3.0
type Options = {};

export default function integration(options: Options = {}): AstroIntegration {
	const { resolve } = createResolver(import.meta.url);

	return {
		name: '@studiocms/ui',
		hooks: {
			'astro:config:setup': ({ injectScript }) => {
				injectScript('page-ssr', `import '${resolve('./css/global.css')}'`);
			},
		},
	};
}
