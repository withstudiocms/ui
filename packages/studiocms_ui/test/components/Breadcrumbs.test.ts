import type { ComponentProps } from 'astro/types';
import { describe, expect } from 'vitest';
import Breadcrumbs from '../../src/components/Breadcrumbs/Breadcrumbs.astro';
import { test } from '../fixtures/vitest/AstroContainer';

type BreadCrumbsProps = ComponentProps<typeof Breadcrumbs>;

const props: BreadCrumbsProps = {
	segments: [
		{ label: 'Home', segment: '/' },
		{ label: 'About', segment: 'about' },
		{ label: 'Contact', segment: 'contact' },
	],
};

describe('Breadcrumbs Component', () => {
	test('renders Breadcrumbs component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Breadcrumbs, 'Breadcrumbs', { props });
		expect(result).toMatchSnapshot();
	});

	test('renders Breadcrumbs component with custom separator', async ({ renderComponent }) => {
		const result = await renderComponent(Breadcrumbs, 'Breadcrumbs', {
			props: { ...props, separator: '>' },
		});
		expect(result).toMatchSnapshot();
	});

	test('renders Breadcrumbs component with single segment', async ({ renderComponent }) => {
		const result = await renderComponent(Breadcrumbs, 'Breadcrumbs', {
			props: { segments: [{ label: 'Home', segment: '/' }] },
		});
		expect(result).toMatchSnapshot();
	});

	test('renders Breadcrumbs component with no segments', async ({ renderComponent }) => {
		const result = await renderComponent(Breadcrumbs, 'Breadcrumbs', { props: { segments: [] } });
		expect(result).toMatchSnapshot();
	});
});
