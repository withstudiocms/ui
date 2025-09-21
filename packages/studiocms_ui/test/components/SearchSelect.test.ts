import { describe, expect } from 'vitest';
import SearchSelect from '../../src/components/SearchSelect/SearchSelect.astro';
import { test } from '../fixtures/vitest/AstroContainer';

const mockProps = {
	name: 'search-selector',
	label: 'Select Element',
	options: [
		{ label: 'Option 1', value: 'opt-1' },
		{ label: 'Option 2', value: 'opt-2' },
		{ label: 'Option 3', value: 'opt-3' },
	],
};

describe('SearchSelect Component', () => {
	// SearchSelect input component current uses a dynamic input instead of a static one
	// which makes snapshot testing difficult. This test is a placeholder for future implementation.

	// TODO Add a name prop to the SearchSelect Input element to make it easier to target in tests
	// and then enable this test.

	test.todo('renders SearchSelect component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(SearchSelect, 'SearchSelect', { props: mockProps });
		expect(result).toMatchSnapshot();
	});
});
