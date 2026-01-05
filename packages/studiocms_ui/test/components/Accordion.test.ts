import { describe, expect } from 'vitest';
import Accordion from '../../src/components/Accordion/Accordion.astro';
import AccordionItem from '../../src/components/Accordion/Item.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Accordion Component', () => {
	test('renders Accordion component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Accordion, 'Accordion');
		expect(result).toMatchSnapshot();
	});

	test('renders AccordionItem component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(AccordionItem, 'AccordionItem');
		expect(result).toMatchSnapshot();
	});

	test('renders Accordion with multiple AccordionItem components', async ({ renderComponent }) => {
		const AccordionItems: string[] = [];

		for (let i = 0; i < 3; i++) {
			const itemResult = await renderComponent(AccordionItem, `AccordionItem${i + 1}`, {
				slots: {
					default: `Content for item ${i + 1}`,
				},
			});
			AccordionItems.push(itemResult);
		}

		const result = await renderComponent(Accordion, 'Accordion', {
			slots: { default: AccordionItems.join('\n') },
		});
		expect(result).toMatchSnapshot();
	});
});
