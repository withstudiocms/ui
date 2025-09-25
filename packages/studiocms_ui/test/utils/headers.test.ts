import { describe, expect, it } from 'vitest';
import {
	type HeadConfig,
	HeadConfigSchema,
	type HeadUserConfig,
	createHead,
	getAttr,
	hasOneOf,
	hasTag,
	headDefaults,
	mergeHead,
	sortHead,
} from '../../src/utils/headers';

describe('HeadConfigSchema', () => {
	it('should parse valid head config', () => {
		const schema = HeadConfigSchema();
		const input = [
			{ tag: 'title', content: 'Test Title', attrs: {} },
			{ tag: 'meta', attrs: { name: 'description', content: 'desc' } },
		];
		expect(schema.parse(input)).toEqual([
			{ tag: 'title', content: 'Test Title', attrs: {} },
			{ tag: 'meta', attrs: { name: 'description', content: 'desc' }, content: '' },
		]);
	});

	it('should default attrs and content', () => {
		const schema = HeadConfigSchema();
		const input = [{ tag: 'title' }];
		expect(schema.parse(input)[0]).toMatchObject({ attrs: {}, content: '' });
	});
});

describe('headDefaults', () => {
	const Astro = { generator: 'Astro' };
	it('should generate default head tags', () => {
		// @ts-expect-error Mocking Astro object
		const result = headDefaults('Title', 'Desc', Astro, undefined, new URL('https://test.com'));
		expect(result.some((e) => e.tag === 'title' && e.content === 'Title')).toBe(true);
		expect(result.some((e) => e.tag === 'meta' && e.attrs?.name === 'description')).toBe(true);
		expect(result.some((e) => e.tag === 'link' && e.attrs?.rel === 'canonical')).toBe(true);
	});

	it('should include og:image and twitter:image if ogImage is provided', () => {
		// @ts-expect-error Mocking Astro object
		const result = headDefaults('Title', 'Desc', Astro, 'img.png', new URL('https://test.com'));
		expect(result.some((e) => e.tag === 'meta' && e.attrs?.property === 'og:image')).toBe(true);
		expect(result.some((e) => e.tag === 'meta' && e.attrs?.name === 'twitter:image')).toBe(true);
	});
});

describe('hasTag', () => {
	const head: HeadConfig = [
		{ tag: 'title', attrs: {}, content: 'A' },
		{ tag: 'meta', attrs: { name: 'description', content: 'desc' }, content: '' },
	];
	it('should detect title tag', () => {
		expect(hasTag(head, { tag: 'title', attrs: {}, content: 'B' })).toBe(true);
	});
	it('should detect meta tag by name', () => {
		expect(
			hasTag(head, { tag: 'meta', attrs: { name: 'description', content: 'other' }, content: '' })
		).toBe(true);
	});
	it('should return false for non-existing meta', () => {
		expect(
			hasTag(head, { tag: 'meta', attrs: { name: 'viewport', content: 'x' }, content: '' })
		).toBe(false);
	});
});

describe('hasOneOf', () => {
	const head: HeadConfig = [
		{ tag: 'meta', attrs: { name: 'description', content: 'desc' }, content: '' },
		{ tag: 'meta', attrs: { property: 'og:title', content: 'Title' }, content: '' },
	];
	it('should match by name', () => {
		expect(
			hasOneOf(
				head,
				{ tag: 'meta', attrs: { name: 'description', content: 'other' }, content: '' },
				['name']
			)
		).toBe(true);
	});
	it('should match by property', () => {
		expect(
			hasOneOf(
				head,
				{ tag: 'meta', attrs: { property: 'og:title', content: 'other' }, content: '' },
				['property']
			)
		).toBe(true);
	});
	it('should not match if key not present', () => {
		expect(
			hasOneOf(head, { tag: 'meta', attrs: { name: 'viewport', content: 'other' }, content: '' }, [
				'name',
			])
		).toBe(false);
	});
});

describe('getAttr', () => {
	it('should return first matching key-value pair', () => {
		const entry: HeadConfig[number] = {
			tag: 'meta',
			attrs: { name: 'description', property: 'og:title', content: 'desc' },
			content: '',
		};
		expect(getAttr(['property', 'name'], entry)).toEqual(['property', 'og:title']);
	});
	it('should return undefined if no key matches', () => {
		const entry: HeadConfig[number] = { tag: 'meta', attrs: { content: 'desc' }, content: '' };
		expect(getAttr(['name', 'property'], entry)).toBeUndefined();
	});
});

describe('mergeHead', () => {
	it('should merge heads and overwrite duplicates', () => {
		const oldHead: HeadConfig = [
			{ tag: 'title', attrs: {}, content: 'Old' },
			{ tag: 'meta', attrs: { name: 'description', content: 'OldDesc' }, content: '' },
		];
		const newHead: HeadConfig = [
			{ tag: 'title', attrs: {}, content: 'New' },
			{ tag: 'meta', attrs: { name: 'description', content: 'NewDesc' }, content: '' },
		];
		const merged = mergeHead(oldHead, newHead);
		expect(merged).toContainEqual({ tag: 'title', attrs: {}, content: 'New' });
		expect(merged).toContainEqual({
			tag: 'meta',
			attrs: { name: 'description', content: 'NewDesc' },
			content: '',
		});
		expect(merged.length).toBe(2);
	});
});

describe('sortHead', () => {
	it('should sort important tags first', () => {
		const head: HeadConfig = [
			{ tag: 'meta', attrs: { name: 'viewport', content: 'x' }, content: '' },
			{ tag: 'title', attrs: {}, content: 'Title' },
			{ tag: 'meta', attrs: { name: 'description', content: 'desc' }, content: '' },
			{ tag: 'link', attrs: { rel: 'shortcut icon', href: '/favicon.ico' }, content: '' },
		];
		const sorted = sortHead([...head]);
		expect(sorted[0].attrs.name).toBe('viewport');
		expect(sorted[1].tag).toBe('title');
		expect(sorted[2].tag).toBe('link');
		expect(sorted[3].attrs.name).toBe('description');
	});
});

describe('createHead', () => {
	it('should parse, merge, and sort head configs', () => {
		const defaults: HeadUserConfig = [
			{ tag: 'title', attrs: {}, content: 'Default' },
			{ tag: 'meta', attrs: { name: 'description', content: 'DefaultDesc' }, content: '' },
		];
		const override: HeadConfig = [
			{ tag: 'title', attrs: {}, content: 'Override' },
			{ tag: 'meta', attrs: { name: 'description', content: 'OverrideDesc' }, content: '' },
			{ tag: 'meta', attrs: { name: 'viewport', content: 'width=device-width' }, content: '' },
		];
		const result = createHead(defaults, override);
		expect(result.some((e) => e.content === 'Override')).toBe(true);
		expect(result.some((e) => e.attrs.name === 'viewport')).toBe(true);
		expect(result.some((e) => e.attrs.name === 'description' && e.content === 'OverrideDesc')).toBe(
			false
		);
		// viewport should be first due to importance
		expect(result[0].attrs.name).toBe('viewport');
	});
});
