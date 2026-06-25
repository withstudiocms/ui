import fs from "node:fs";
import type { InjectedType } from "astro";

export function generateIconTypes(
	filename: string,
	replacers: {
		collections: string;
		availableIcons: string;
		iconCollections: string;
	},
): InjectedType {
	const stubFile = fs.readFileSync(
		new URL("./stubs/icons-d-ts.stub", import.meta.url),
		"utf-8",
	);
	const outputFile = stubFile
		.replace("$$COLLECTIONS$$", replacers.collections)
		.replace("$$AVAILABLE_ICONS$$", replacers.availableIcons)
		.replace("$$ICON_COLLECTIONS$$", replacers.iconCollections);

	return {
		filename,
		content: outputFile,
	};
}
