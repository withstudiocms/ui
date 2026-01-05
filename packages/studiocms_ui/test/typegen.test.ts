import { describe, expect, it } from 'vitest';
import { generateIconTypes } from '../src/utils/typegen';

describe('generateIconTypes', () => {
	const filename = 'icons.d.ts';
	const replacers = {
		collections: "'collectionA' | 'collectionB'",
		availableIcons: "'iconA' | 'iconB'",
		iconCollections: "['collectionA', 'collectionB']",
	};

	it('should generate types with correct replacements', async () => {
		const result = generateIconTypes(filename, replacers);

		expect(result.filename).toBe(filename);
		expect(result.content).toContain(replacers.collections);
		expect(result.content).toContain(replacers.availableIcons);
		expect(result.content).toContain(replacers.iconCollections);
		expect(result.content).not.toContain('$$COLLECTIONS$$');
		expect(result.content).not.toContain('$$AVAILABLE_ICONS$$');
		expect(result.content).not.toContain('$$ICON_COLLECTIONS$$');
	});
});
