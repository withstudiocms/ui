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
	test('renders SearchSelect component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(SearchSelect, 'SearchSelect', { props: mockProps });
		expect(result).toMatchSnapshot();
	});
});
