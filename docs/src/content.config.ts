import { defineCollection, z } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { file, glob } from 'astro/loaders';

const baseSchema = z.object({
	type: z.literal('base').optional().default('base'),
	i18nReady: z.boolean().optional().default(false),
});

const integrationSchema = baseSchema.extend({
	type: z.literal('integration'),
	integration: z.object({
		name: z.string(),
		githubURL: z.string(),
		released: z.boolean().default(true),
	}),
});

const docs = defineCollection({
	loader: docsLoader(),
	schema: docsSchema({ extend: z.union([baseSchema, integrationSchema]) }),
});

const i18n = defineCollection({
	loader: i18nLoader(),
	schema: i18nSchema({
		extend: z.object({
			'site-title.labels.docs': z.string().optional(),
			'sponsors.sponsoredby': z.string().optional(),
			'integration-labels.changelog': z.string().optional(),
			'contributors.ui-library': z.string().optional(),
		}),
	}),
});

const socialproof = defineCollection({
	loader: glob({ pattern: '*.json', base: 'src/content/socialproof' }),
	schema: z.object({
		avatar: z.string(),
		name: z.string(),
		handle: z.string(),
		message: z.string(),
		image: z
			.object({
				path: z.string(),
				width: z.number(),
				height: z.number(),
			})
			.optional(),
	}),
});

const showcase = defineCollection({
	loader: file('src/content/showcase.json'),
	schema: z.array(
		z.object({
			name: z.string(),
			link: z.string(),
		})
	),
});

export const collections = {
	docs,
	i18n,
	socialproof,
	showcase,
};
