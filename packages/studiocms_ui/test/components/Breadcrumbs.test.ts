import { describe, expect } from 'vitest';
import Breadcrumbs from '../../src/components/Breadcrumbs/Breadcrumbs.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Breadcrumbs Component', () => {
	test.for([
		{
			segments: [
				{ label: 'Home', segment: '/' },
				{ label: 'About', segment: 'about' },
				{ label: 'Contact', segment: 'contact' },
			],
		},
		{ segments: [] },
		{ segments: [{ label: 'Home', segment: '/' }] },
	])('renders Breadcrumbs with props %#', async (props, { renderComponent }) => {
		const result = await renderComponent(Breadcrumbs, 'Breadcrumbs', { props });
		expect(result).toMatchSnapshot();
	});

	const testSegments = [
		{ label: 'Home', segment: '/' },
		{ label: 'Products', segment: '/products' },
		{ label: 'Electronics', segment: '/products/electronics' },
	];

	test.for([
		{ separator: '>', segments: testSegments },
		{ separator: '/', segments: testSegments },
		{ separator: '|', segments: testSegments },
		{ separator: '»', segments: testSegments },
		{ separator: '›', segments: testSegments },
	])('renders Breadcrumbs with separator "%s"', async (props, { renderComponent }) => {
		const result = await renderComponent(Breadcrumbs, 'Breadcrumbs', {
			props: { ...props, ...{ segments: props.segments ?? [] } },
		});
		expect(result).toMatchSnapshot();
	});
});
