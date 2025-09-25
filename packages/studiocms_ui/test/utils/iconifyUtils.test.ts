import { describe, expect, it } from 'vitest';
import {
	calculateSize,
	getIconData,
	getIconsTree,
	getSVGViewBox,
	iconToSVG,
	isUnsetKeyword,
	mergeDefsAndContent,
	mergeIconTransformations,
	replaceIDs,
	splitSVGDefs,
	wrapSVGContent,
} from '../../src/utils/iconifyUtils';

describe('getSVGViewBox', () => {
	it('parses valid viewBox string', () => {
		expect(getSVGViewBox('0 0 24 24')).toEqual([0, 0, 24, 24]);
	});
	it('returns undefined for invalid string', () => {
		expect(getSVGViewBox('0 0 24')).toBeUndefined();
		expect(getSVGViewBox('a b c d')).toBeUndefined();
	});
});

describe('splitSVGDefs', () => {
	it('extracts defs from SVG content', () => {
		const svg = '<svg><defs><mask id="m"></mask></defs><rect/></svg>';
		const result = splitSVGDefs(svg);
		expect(result.defs).toContain('<mask id="m"></mask>');
		expect(result.content).toContain('<svg><rect/></svg>');
	});
	it('returns empty defs if none found', () => {
		const svg = '<svg><rect/></svg>';
		const result = splitSVGDefs(svg);
		expect(result.defs).toBe('');
		expect(result.content).toBe(svg);
	});
});

describe('mergeDefsAndContent', () => {
	it('merges defs and content', () => {
		expect(mergeDefsAndContent('<mask/>', '<rect/>')).toBe('<defs><mask/></defs><rect/>');
		expect(mergeDefsAndContent('', '<rect/>')).toBe('<rect/>');
	});
});

describe('wrapSVGContent', () => {
	it('wraps content with start/end tags, keeps defs outside', () => {
		const body = '<defs><mask/></defs><rect/>';
		const wrapped = wrapSVGContent(body, '<g>', '</g>');
		expect(wrapped).toContain('<defs><mask/></defs>');
		expect(wrapped).toContain('<g><rect/></g>');
	});
});

describe('calculateSize', () => {
	it('returns same value if ratio is 1', () => {
		expect(calculateSize(24, 1)).toBe(24);
		expect(calculateSize('24px', 1)).toBe('24px');
	});
	it('calculates size for number', () => {
		expect(calculateSize(10, 2)).toBe(20);
	});
	it('calculates size for string with units', () => {
		expect(calculateSize('10px', 2)).toBe('20px');
		expect(calculateSize('2em', 0.5)).toBe('1em');
	});
	it('handles complex strings', () => {
		expect(calculateSize('calc(100% - 2px)', 2)).toBe('calc(200% - 4px)');
	});
});

describe('mergeIconTransformations', () => {
	it('merges flips and rotations', () => {
		expect(
			mergeIconTransformations(
				{ hFlip: true, vFlip: false, rotate: 1 },
				{ hFlip: false, vFlip: true, rotate: 2 }
			)
		).toMatchObject({ hFlip: true, vFlip: true, rotate: 3 });
	});
	it('returns correct rotate modulo 4', () => {
		expect(mergeIconTransformations({ rotate: 3 }, { rotate: 2 })).toMatchObject({ rotate: 1 });
	});
});

describe('isUnsetKeyword', () => {
	it('detects unset keywords', () => {
		expect(isUnsetKeyword('unset')).toBe(true);
		expect(isUnsetKeyword('undefined')).toBe(true);
		expect(isUnsetKeyword('none')).toBe(true);
		expect(isUnsetKeyword('auto')).toBe(false);
	});
});

describe('replaceIDs', () => {
	it('replaces ids with unique values', () => {
		const svg = '<rect id="foo"/><use xlink:href="#foo"/>';
		const replaced = replaceIDs(svg, 'testPrefix');
		expect(replaced).toContain('id="testPrefix');
		expect(replaced).not.toContain('id="foo"');
		expect(replaced).toContain('xlink:href="#testPrefix');
	});
	it('returns original if no ids', () => {
		const svg = '<rect/>';
		expect(replaceIDs(svg)).toBe(svg);
	});
});

describe('iconToSVG', () => {
	it('returns correct attributes and body', () => {
		const icon = { body: '<rect/>', left: 0, top: 0, width: 24, height: 24 };
		const result = iconToSVG(icon);
		expect(result.attributes.width).toBe('1em');
		expect(result.attributes.height).toBe('1em');
		expect(result.attributes.viewBox).toBe('0 0 24 24');
		expect(result.body).toContain('<rect/>');
	});
	it('applies customisations', () => {
		const icon = { body: '<rect/>', left: 0, top: 0, width: 24, height: 24 };
		const custom = { width: '48px', height: '48px', hFlip: true };
		const result = iconToSVG(icon, custom);
		expect(result.attributes.width).toBe('48px');
		expect(result.attributes.height).toBe('48px');
		expect(result.body).toContain('transform=');
	});
});

describe('getIconsTree', () => {
	it('resolves parent icons', () => {
		const data = {
			icons: { foo: { body: '' }, bar: { body: '' } },
			aliases: { baz: { parent: 'foo' } },
		};
		const tree = getIconsTree(data as any);
		expect(tree.foo).toEqual([]);
		expect(tree.bar).toEqual([]);
		expect(tree.baz).toEqual(['foo']);
	});
});

describe('getIconData', () => {
	it('returns icon data for direct icon', () => {
		const data = { icons: { foo: { body: '<rect/>', width: 24, height: 24 } } };
		const icon = getIconData(data as any, 'foo');
		expect(icon?.body).toBe('<rect/>');
	});
	it('returns null for missing icon', () => {
		const data = { icons: {} };
		expect(getIconData(data as any, 'bar')).toBeNull();
	});
	it('resolves alias chain', () => {
		const data = {
			icons: { foo: { body: '<rect/>', width: 24, height: 24 } },
			aliases: { bar: { parent: 'foo' } },
		};
		const icon = getIconData(data as any, 'bar');
		expect(icon?.body).toBe('<rect/>');
	});
});
