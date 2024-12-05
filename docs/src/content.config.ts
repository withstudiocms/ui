import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loader';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

const baseSchema = z.object({
	type: z.literal('base').optional().default('base'),
	i18nReady: z.boolean().optional().default(false),
});

const redirectSchema = baseSchema.extend({
	type: z.literal('redirect'),
	redirect: z.string(),
});

const docsCollectionSchema = z.union([baseSchema, redirectSchema]);

const customTranslationsSchema = z.object({
	'site-title.labels.docs': z.string().optional(),
	'site-title.labels.main-site': z.string().optional(),
	'site-title.labels.live-demo': z.string().optional(),
	'sponsors.sponsoredby': z.string().optional(),
	'package-catalog.readmore.start': z.string().optional(),
	'package-catalog.readmore.end': z.string().optional(),
	'integration-labels.changelog': z.string().optional(),
	'contributors.core-packages': z.string().optional(),
	'contributors.ui-library': z.string().optional(),
	'contributors.devapps': z.string().optional(),
	'contributors.plugins': z.string().optional(),
	'contributors.documentation': z.string().optional(),
	'contributors.website': z.string().optional(),
	'contributors.bots': z.string().optional(),
});

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({ extend: docsCollectionSchema }),
	}),
	i18n: defineCollection({
		loader: i18nLoader(),
		schema: i18nSchema({
			extend: customTranslationsSchema,
		}),
	}),
};
