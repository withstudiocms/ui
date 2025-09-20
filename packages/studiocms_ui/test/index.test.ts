import type { AstroIntegration } from 'astro';
import { describe, expect, expectTypeOf, test } from 'vitest';
import integration from '../src/index';

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
