// @ts-expect-error - This is a TypeGenerated Module, available in dev thanks to manual d.ts file - This comment is here because this causes a type-error during build
import type { iconCollections as _iconCollections } from 'studiocms:ui/icons';
import { AstroError } from 'astro/errors';

/**
 * Custom error class for handling errors related to StudioCMS UI Icons.
 *
 * @extends {AstroError}
 *
 * @property {string} name - The name of the error, set to 'StudioCMS UI Icon Error'.
 * @property {string} hint - A hint message suggesting to check the Icon Collection for the required icon.
 * @property {const} type - The type of the error, set to 'AstroUserError'.
 */
export class StudioCMS_UI_IconError extends AstroError {
	override name = '@studiocms/ui Icon Error';
	override type = 'AstroUserError' as const;
}

/**
 * Constructs a string representation of an icon based on the provided prefix and icon name.
 *
 * @param prefix - The prefix for the icon. If undefined, it will be treated as an empty string.
 * @param iconName - The name of the icon. If undefined, it will be treated as an empty string.
 * @returns A string in the format "prefix:iconName". If both prefix and iconName are undefined, returns "undefined".
 */
function receivedIcon(prefix: string | undefined, iconName: string | undefined): string {
	if (!prefix && !iconName) {
		return 'undefined';
	}
	if (!prefix) {
		return `${iconName}`;
	}
	if (!iconName) {
		return `${prefix}:undefined`;
	}
	return `${prefix}:${iconName}`;
}

/**
 * Builds an error hint message for invalid or missing icons.
 *
 * @param data - An object containing the following properties:
 * @param data.iconCollections - An array of valid icon collections.
 * @param data.prefix - The prefix of the icon name.
 * @param data.iconName - The name of the icon.
 * @returns A string containing the error hint message.
 */
export function errorHintBuilder(data: {
	iconCollections: typeof _iconCollections;
	prefix: string | undefined;
	iconName: string | undefined;
}): string {
	const { iconCollections, prefix, iconName } = data;

	return `Valid icon collections: ${iconCollections.join(', ')}. Received: "${receivedIcon(prefix, iconName)}", Icon is either missing or invalid.`;
}
