import type { IconifyJSON } from '@iconify/types';
import type { AstroIntegration } from 'astro';
import { describe, expect, expectTypeOf, test } from 'vitest';
import integration from '../src/index';
import { createIconifyCollection } from '../src/index';

describe('Astro Integration', () => {
	test('should correctly setup integration for Astro', () => {
		const result = integration();

		expect(result).toBeDefined();
		expectTypeOf(result).toEqualTypeOf<AstroIntegration>();
		expect(result.name).toBe('@studiocms/ui');
		expect(result.hooks).toBeDefined();
		expectTypeOf(result.hooks).toEqualTypeOf<AstroIntegration['hooks']>();

		expect(result.hooks!['astro:config:setup']).toBeDefined();
		expect(result.hooks!['astro:config:setup']).toBeTypeOf('function');

		expect(result.hooks!['astro:config:done']).toBeDefined();
		expect(result.hooks!['astro:config:done']).toBeTypeOf('function');
	});
});

describe('createIconifyPrefixCollection', () => {
	test('returns empty arrays when no icons are provided', () => {
		const result = createIconifyCollection();
		expect(result.collections).toEqual({});
		expect(result.integrationCollections).toEqual(undefined);
		expect(result.availableIcons).toEqual([]);
		expect(result.collectionNames).toEqual([]);
	});

	test('returns correct collections for a single icon set', () => {
		const icons: Record<string, IconifyJSON> = {
			testicons: {
				prefix: 'testicons',
				icons: {
					// @ts-expect-error Testing with mock data
					foo: {},
					// @ts-expect-error Testing with mock data
					bar: {},
				},
				width: 24,
				height: 24,
			},
		};
		const result = createIconifyCollection(icons);

		expect(result.collections).toEqual({ testicons: icons.testicons });
		expect(result.integrationCollections).toContain('export const collections = {"testicons"');
		expect(result.availableIcons).toEqual(['testicons:foo', 'testicons:bar']);
	});

	test('handles multiple icon collections', () => {
		const icons: Record<string, IconifyJSON> = {
			set1: {
				prefix: 'set1',
				// @ts-expect-error Testing with mock data
				icons: { a: {}, b: {} },
				width: 16,
				height: 16,
			},
			set2: {
				prefix: 'set2',
				// @ts-expect-error Testing with mock data
				icons: { x: {}, y: {}, z: {} },
				width: 32,
				height: 32,
			},
		};
		const result = createIconifyCollection(icons);

		expect(result.collections).toEqual({
			set1: icons.set1,
			set2: icons.set2,
		});
		expect(result.availableIcons).toEqual(['set1:a', 'set1:b', 'set2:x', 'set2:y', 'set2:z']);
	});

	test('handles empty icons object', () => {
		const icons: Record<string, IconifyJSON> = {};
		const result = createIconifyCollection(icons);

		expect(result.collections).toEqual({});
		expect(result.integrationCollections).toEqual('export const collections = {};');
		expect(result.availableIcons).toEqual([]);
	});
});
