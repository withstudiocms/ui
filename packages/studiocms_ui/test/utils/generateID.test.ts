import { describe, expect, it } from 'vitest';
import { generateID } from '../../src/utils/generateID';

describe('generateID', () => {
	it('should return a string starting with the given prefix followed by a dash', () => {
		const prefix = 'test';
		const id = generateID(prefix);
		expect(id.startsWith(`${prefix}-`)).toBe(true);
	});

	it('should generate different IDs for subsequent calls', () => {
		const prefix = 'unique';
		const id1 = generateID(prefix);
		const id2 = generateID(prefix);
		expect(id1).not.toBe(id2);
	});

	it('should include only valid hexadecimal characters after the prefix and dash', () => {
		const prefix = 'hex';
		const id = generateID(prefix);
		const hexPart = id.slice(prefix.length + 1);
		expect(/^[a-f0-9]+$/i.test(hexPart)).toBe(true);
	});
});
