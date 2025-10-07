import { describe, expect } from 'vitest';
import DoubleSidebar from '../../src/components/Sidebar/Double.astro';
import SingleSidebar from '../../src/components/Sidebar/Single.astro';
import { test } from '../fixtures/vitest/AstroContainer';

const mockContent = '<p>This is some sidebar content.</p>';

describe('Sidebar Component', () => {
	test('renders SingleSidebar component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(SingleSidebar, 'SingleSidebar', {
			slots: { default: mockContent },
		});
		expect(result).toMatchSnapshot();
	});

	test('renders DoubleSidebar component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(DoubleSidebar, 'DoubleSidebar', {
			slots: { inner: mockContent, outer: mockContent },
		});
		expect(result).toMatchSnapshot();
	});
});
