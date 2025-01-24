import type {
	ExtendedIconifyIcon,
	IconifyAliases,
	IconifyDimenisons,
	IconifyIcon,
	IconifyJSON,
	IconifyOptional,
	IconifyTransformations,
} from '@iconify/types';

export type FullIconifyIcon = Required<IconifyIcon>;

/**
 * SVG viewBox: x, y, width, height
 */
export type SVGViewBox = [x: number, y: number, width: number, height: number];

/**
 * Get viewBox from string
 */
export function getSVGViewBox(value: string): SVGViewBox | undefined {
	const result = value.trim().split(/\s+/).map(Number);
	if (result.length === 4 && result.reduce((prev, value) => prev && !Number.isNaN(value), true)) {
		return result as SVGViewBox;
	}
	return undefined;
}

/**
 * Extract definitions from SVG
 *
 * Can be used with other tags, but name kept for backwards compatibility.
 * Should be used only with tags that cannot be nested, such as masks, clip paths, etc.
 */
interface SplitSVGDefsResult {
	defs: string;
	content: string;
}

export function splitSVGDefs(content: string, tag = 'defs'): SplitSVGDefsResult {
	let defs = '';
	const index = content.indexOf(`<${tag}`);
	while (index >= 0) {
		const start = content.indexOf('>', index);
		const end = content.indexOf(`</${tag}`);
		if (start === -1 || end === -1) {
			// Fail
			break;
		}
		const endEnd = content.indexOf('>', end);
		if (endEnd === -1) {
			break;
		}
		defs += content.slice(start + 1, end).trim();
		content = content.slice(0, index).trim() + content.slice(endEnd + 1);
	}

	return {
		defs,
		content,
	};
}

/**
 * Merge defs and content
 */
export function mergeDefsAndContent(defs: string, content: string): string {
	return defs ? `<defs>${defs}</defs>${content}` : content;
}

/**
 * Wrap SVG content, without wrapping definitions
 */
export function wrapSVGContent(body: string, start: string, end: string): string {
	const split = splitSVGDefs(body);
	return mergeDefsAndContent(split.defs, start + split.content + end);
}

// Partial and full extended icon
export type PartialExtendedIconifyIcon = Partial<ExtendedIconifyIcon>;

type IconifyIconExtraProps = Omit<ExtendedIconifyIcon, keyof IconifyIcon>;
export type FullExtendedIconifyIcon = FullIconifyIcon & IconifyIconExtraProps;
/**
 * Regular expressions for calculating dimensions
 */
const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;

/**
 * Calculate second dimension when only 1 dimension is set
 */
export function calculateSize(size: string, ratio: number, precision?: number): string;

export function calculateSize(size: number, ratio: number, precision?: number): number;

export function calculateSize(
	size: string | number,
	ratio: number,
	precision?: number
): string | number;

export function calculateSize(
	size: string | number,
	ratio: number,
	precision?: number
): string | number {
	if (ratio === 1) {
		return size;
	}

	precision = precision || 100;
	if (typeof size === 'number') {
		return Math.ceil(size * ratio * precision) / precision;
	}

	if (typeof size !== 'string') {
		return size;
	}

	// Split code into sets of strings and numbers
	const oldParts = size.split(unitsSplit);
	if (oldParts === null || !oldParts.length) {
		return size;
	}

	const newParts = [];
	let code = oldParts.shift() as string;
	let isNumber = unitsTest.test(code);

	while (true) {
		if (isNumber) {
			const num = Number.parseFloat(code);
			if (Number.isNaN(num)) {
				newParts.push(code);
			} else {
				newParts.push(Math.ceil(num * ratio * precision) / precision);
			}
		} else {
			newParts.push(code);
		}

		// next
		code = oldParts.shift() as string;
		if (code === void 0) {
			return newParts.join('');
		}

		isNumber = !isNumber;
	}
}

/**
 * Default values for dimensions
 */
export const defaultIconDimensions: Required<IconifyDimenisons> = Object.freeze({
	left: 0,
	top: 0,
	width: 16,
	height: 16,
});

/**
 * Default values for transformations
 */
export const defaultIconTransformations: Required<IconifyTransformations> = Object.freeze({
	rotate: 0,
	vFlip: false,
	hFlip: false,
});

/**
 * Default values for all optional IconifyIcon properties
 */
export const defaultIconProps: Required<IconifyOptional> = Object.freeze({
	...defaultIconDimensions,
	...defaultIconTransformations,
});

/**
 * Default values for all properties used in ExtendedIconifyIcon
 */
export const defaultExtendedIconProps: Required<FullExtendedIconifyIcon> = Object.freeze({
	...defaultIconProps,
	body: '',
	hidden: false,
});

/**
 * Merge transformations
 */
export function mergeIconTransformations<T extends IconifyTransformations>(
	obj1: T,
	obj2: IconifyTransformations
): T {
	const result = {} as T;
	if (!obj1.hFlip !== !obj2.hFlip) {
		result.hFlip = true;
	}
	if (!obj1.vFlip !== !obj2.vFlip) {
		result.vFlip = true;
	}
	const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
	if (rotate) {
		result.rotate = rotate;
	}
	return result;
}

/**
 * Icon size
 */
export type IconifyIconSize = null | string | number;

/**
 * Dimensions
 */
export interface IconifyIconSizeCustomisations {
	width?: IconifyIconSize;
	height?: IconifyIconSize;
}

/**
 * Icon customisations
 */
export interface IconifyIconCustomisations
	extends IconifyTransformations,
		IconifyIconSizeCustomisations {}

export type FullIconCustomisations = Required<IconifyIconCustomisations>;

/**
 * Default icon customisations values
 */
export const defaultIconSizeCustomisations: Required<IconifyIconSizeCustomisations> = Object.freeze(
	{
		width: null,
		height: null,
	}
);

export const defaultIconCustomisations: FullIconCustomisations = Object.freeze({
	// Dimensions
	...defaultIconSizeCustomisations,

	// Transformations
	...defaultIconTransformations,
});

/**
 * Merge icon and alias
 *
 * Can also be used to merge default values and icon
 */
export function mergeIconData<T extends PartialExtendedIconifyIcon>(
	parent: T,
	child: PartialExtendedIconifyIcon
): T {
	// Merge transformations and add defaults
	const result = mergeIconTransformations(parent, child);

	// Merge icon properties that aren't transformations
	for (const key in defaultExtendedIconProps) {
		// Add default transformations if needed
		if (key in defaultIconTransformations) {
			if (key in parent && !(key in result)) {
				result[key as 'rotate'] = defaultIconTransformations[key as 'rotate'];
			}
			// Not transformation
		} else if (key in child) {
			result[key as 'width'] = child[key as 'width']!;
		} else if (key in parent) {
			result[key as 'width'] = parent[key as 'width']!;
		}
	}

	return result;
}

// Parent icons, first is direct parent, then parent of parent and so on. Does not include self
export type ParentIconsList = string[];

// Result. Key is icon, value is list of parent icons
export type ParentIconsTree = Record<string, ParentIconsList | null>;

/**
 * Resolve icon set icons
 *
 * Returns parent icon for each icon
 */
export function getIconsTree(data: IconifyJSON, names?: string[]): ParentIconsTree {
	const icons = data.icons;
	const aliases = data.aliases || (Object.create(null) as IconifyAliases);

	const resolved = Object.create(null) as ParentIconsTree;

	function resolve(name: string): ParentIconsList | null {
		if (icons[name]) {
			// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
			return (resolved[name] = []);
		}

		if (!(name in resolved)) {
			// Mark as failed if parent alias points to this icon to avoid infinite loop
			resolved[name] = null;

			// Get parent icon name
			const parent = aliases[name]?.parent;

			// Get value for parent
			const value = parent && resolve(parent);
			if (value) {
				resolved[name] = [parent].concat(value);
			}
		}

		return resolved[name] || null;
	}

	// Resolve only required icons
	(names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve);

	return resolved;
}

/**
 * Get icon data, using prepared aliases tree
 */
export function internalGetIconData(
	data: IconifyJSON,
	name: string,
	tree: string[]
): ExtendedIconifyIcon {
	const icons = data.icons;
	const aliases = data.aliases || (Object.create(null) as IconifyAliases);

	let currentProps = {} as ExtendedIconifyIcon;

	// Parse parent item
	function parse(name: string) {
		currentProps = mergeIconData(
			icons[name] || aliases[name]!,
			currentProps
		) as ExtendedIconifyIcon;
	}

	parse(name);
	tree.forEach(parse);

	// Add default values
	return mergeIconData(data, currentProps) as unknown as ExtendedIconifyIcon;
}

/**
 * Get data for icon
 */
export function getIconData(data: IconifyJSON, name: string): ExtendedIconifyIcon | null {
	if (data.icons[name]) {
		// Parse only icon
		return internalGetIconData(data, name, []);
	}

	// Resolve tree
	const tree = getIconsTree(data, [name])[name];
	return tree ? internalGetIconData(data, name, tree) : null;
}

/**
 * Interface for getSVGData() result
 */
export interface IconifyIconBuildResult {
	attributes: {
		// Attributes for <svg>
		width?: string;
		height?: string;
		viewBox: string;
	};

	// viewBox as numbers
	viewBox: SVGViewBox;

	// Content
	body: string;
}

/**
 * Interface for viewBox
 */
interface ViewBox {
	left: number;
	top: number;
	width: number;
	height: number;
}

/**
 * Check if value should be unset. Allows multiple keywords
 */
export const isUnsetKeyword = (value: unknown) =>
	value === 'unset' || value === 'undefined' || value === 'none';

/**
 * IDs usage:
 *
 * id="{id}"
 * xlink:href="#{id}"
 * url(#{id})
 *
 * From SVG animations:
 *
 * begin="0;{id}.end"
 * begin="{id}.end"
 * begin="{id}.click"
 */

/**
 * Regular expression for finding ids
 */
const regex = /\sid="(\S+)"/g;

/**
 * New random-ish prefix for ids
 *
 * Do not use dash, it cannot be used in SVG 2 animations
 */
const randomPrefix = `IconifyId${Date.now().toString(16)}${((Math.random() * 0x1000000) | 0).toString(16)}`;

/**
 * Counter for ids, increasing with every replacement
 */
let counter = 0;

/**
 * Replace IDs in SVG output with unique IDs
 */
export function replaceIDs(
	body: string,
	prefix: string | ((id: string) => string) = randomPrefix
): string {
	// Find all IDs
	const ids: string[] = [];
	let match: RegExpExecArray | null;
	// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
	while ((match = regex.exec(body))) {
		ids.push(match[1]!);
	}
	if (!ids.length) {
		return body;
	}

	// Random text to make sure there are no conflicts between old and new ids
	const suffix = `suffix${((Math.random() * 0x1000000) | Date.now()).toString(16)}`;

	// Replace with unique ids
	// biome-ignore lint/complexity/noForEach: <explanation>
	ids.forEach((id) => {
		const newID = typeof prefix === 'function' ? prefix(id) : prefix + (counter++).toString();

		const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		body = body.replace(
			// Allowed characters before id: [#;"]
			// Allowed characters after id: [)"], .[a-z]
			new RegExp(`([#;"])(${escapedID})([")]|\\.[a-z])`, 'g'),
			`$1${newID}${suffix}$3`
		);
	});
	body = body.replace(new RegExp(suffix, 'g'), '');

	return body;
}

/**
 * Get SVG attributes and content from icon + customisations
 *
 * Does not generate style to make it compatible with frameworks that use objects for style, such as React.
 * Instead, it generates 'inline' value. If true, rendering engine should add verticalAlign: -0.125em to icon.
 *
 * Customisations should be normalised by platform specific parser.
 * Result should be converted to <svg> by platform specific parser.
 * Use replaceIDs to generate unique IDs for body.
 */
export function iconToSVG(
	icon: IconifyIcon,
	customisations?: IconifyIconCustomisations
): IconifyIconBuildResult {
	const fullIcon = {
		...defaultIconProps,
		...icon,
	};
	const fullCustomisations = {
		...defaultIconCustomisations,
		...customisations,
	};

	// viewBox
	const box: ViewBox = {
		left: fullIcon.left,
		top: fullIcon.top,
		width: fullIcon.width,
		height: fullIcon.height,
	};

	// Body
	let body = fullIcon.body;

	// Apply transformations
	// biome-ignore lint/complexity/noForEach: <explanation>
	[fullIcon, fullCustomisations].forEach((props) => {
		const transformations: string[] = [];
		const hFlip = props.hFlip;
		const vFlip = props.vFlip;
		let rotation = props.rotate;

		// Icon is flipped first, then rotated
		if (hFlip) {
			if (vFlip) {
				rotation += 2;
			} else {
				// Horizontal flip
				transformations.push(
					`translate(${(box.width + box.left).toString()} ${(0 - box.top).toString()})`
				);
				transformations.push('scale(-1 1)');
				box.top = box.left = 0;
			}
		} else if (vFlip) {
			// Vertical flip
			transformations.push(
				`translate(${(0 - box.left).toString()} ${(box.height + box.top).toString()})`
			);
			transformations.push('scale(1 -1)');
			box.top = box.left = 0;
		}

		let tempValue: number;
		if (rotation < 0) {
			rotation -= Math.floor(rotation / 4) * 4;
		}
		rotation = rotation % 4;
		switch (rotation) {
			case 1:
				// 90deg
				tempValue = box.height / 2 + box.top;
				transformations.unshift(`rotate(90 ${tempValue.toString()} ${tempValue.toString()})`);
				break;

			case 2:
				// 180deg
				transformations.unshift(
					`rotate(180 ${(box.width / 2 + box.left).toString()} ${(box.height / 2 + box.top).toString()})`
				);
				break;

			case 3:
				// 270deg
				tempValue = box.width / 2 + box.left;
				transformations.unshift(`rotate(-90 ${tempValue.toString()} ${tempValue.toString()})`);
				break;
		}

		if (rotation % 2 === 1) {
			// Swap width/height and x/y for 90deg or 270deg rotation
			if (box.left !== box.top) {
				tempValue = box.left;
				box.left = box.top;
				box.top = tempValue;
			}
			if (box.width !== box.height) {
				tempValue = box.width;
				box.width = box.height;
				box.height = tempValue;
			}
		}

		if (transformations.length) {
			body = wrapSVGContent(body, `<g transform="${transformations.join(' ')}">`, '</g>');
		}
	});

	// Calculate dimensions
	const customisationsWidth = fullCustomisations.width;
	const customisationsHeight = fullCustomisations.height;
	const boxWidth = box.width;
	const boxHeight = box.height;

	let width: string | number;
	let height: string | number;
	if (customisationsWidth === null) {
		// Width is not set: calculate width from height, default to '1em'
		height =
			customisationsHeight === null
				? '1em'
				: customisationsHeight === 'auto'
					? boxHeight
					: customisationsHeight;
		width = calculateSize(height, boxWidth / boxHeight);
	} else {
		// Width is set
		width = customisationsWidth === 'auto' ? boxWidth : customisationsWidth;
		height =
			customisationsHeight === null
				? calculateSize(width, boxHeight / boxWidth)
				: customisationsHeight === 'auto'
					? boxHeight
					: customisationsHeight;
	}

	// Attributes for result
	const attributes = {} as IconifyIconBuildResult['attributes'];

	const setAttr = (prop: 'width' | 'height', value: string | number) => {
		if (!isUnsetKeyword(value)) {
			attributes[prop] = value.toString();
		}
	};
	setAttr('width', width);
	setAttr('height', height);

	const viewBox: SVGViewBox = [box.left, box.top, boxWidth, boxHeight];
	attributes.viewBox = viewBox.join(' ');

	return {
		attributes,
		viewBox,
		body,
	};
}
