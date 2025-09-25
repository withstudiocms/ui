import fs from 'node:fs';
import type { InjectedType } from 'astro';
import { createResolver } from 'astro-integration-kit';

const { resolve } = createResolver(import.meta.url);

export function generateIconTypes(
	filename: string,
	replacers: {
		collections: string;
		availableIcons: string;
		iconCollections: string;
	}
): InjectedType {
	const stubFile = fs.readFileSync(resolve('./stubs/icons-d-ts.stub.js'), 'utf-8');
	const outputFile = stubFile
		.replace('$$COLLECTIONS$$', replacers.collections)
		.replace('$$AVAILABLE_ICONS$$', replacers.availableIcons)
		.replace('$$ICON_COLLECTIONS$$', replacers.iconCollections);

	return {
		filename,
		content: outputFile,
	};
}
