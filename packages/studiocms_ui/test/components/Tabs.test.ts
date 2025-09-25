import { describe, expect } from 'vitest';
import TabItem from '../../src/components/Tabs/TabItem.astro';
import Tabs from '../../src/components/Tabs/Tabs.astro';
import { test } from '../fixtures/vitest/AstroContainer';

// TODO Tab and TabItem have to much dynamic behavior to snapshot test effectively
describe.todo('Tabs Component', () => {
	test.todo('renders Tabs component correctly', async ({ renderComponent }) => {
		const tabsContent = [];
		for (let i = 1; i <= 3; i++) {
			tabsContent.push(
				await renderComponent(TabItem, 'TabItem', {
					props: { label: `Tab ${i}` },
					slots: { default: `Content for Tab ${i}` },
				})
			);
		}

		const result = await renderComponent(Tabs, 'Tabs', {
			slots: { default: tabsContent.join('') },
		});
		expect(result).toMatchSnapshot();
	});
});
