import starlight from '@astrojs/starlight';
import onestWoff2 from '@fontsource-variable/onest/files/onest-latin-wght-normal.woff2?url';
import { defineConfig, envField } from 'astro/config';
import starlightImageZoom from 'starlight-image-zoom';
import rehypePluginKit from './src/plugins/rehypePluginKit';

// Define the Site URL
const site = 'https://ui.studiocms.dev/';

export const locales = {
	root: { label: 'English', lang: 'en' },
	es: { label: 'Español', lang: 'es' },
	// de: { label: 'Deutsch', lang: 'de' },
	// ja: { label: '日本語', lang: 'ja' },
	// fr: { label: 'Français', lang: 'fr' },
	// it: { label: 'Italiano', lang: 'it' },
	// id: { label: 'Bahasa Indonesia', lang: 'id' },
	// 'zh-cn': { label: '简体中文', lang: 'zh-CN' },
	// 'pt-br': { label: 'Português do Brasil', lang: 'pt-BR' },
	// 'pt-pt': { label: 'Português', lang: 'pt-PT' },
	// ko: { label: '한국어', lang: 'ko' },
	// tr: { label: 'Türkçe', lang: 'tr' },
	// ru: { label: 'Русский', lang: 'ru' },
	// hi: { label: 'हिंदी', lang: 'hi' },
	// da: { label: 'Dansk', lang: 'da' },
	// uk: { label: 'Українська', lang: 'uk' },
};

export default defineConfig({
	site,
	experimental: {
		svg: true,
	},
	image: {
		remotePatterns: [{ protocol: 'https' }],
	},
	markdown: {
		rehypePlugins: rehypePluginKit,
	},
	env: {
		schema: {
			THUM_SECRET_KEY: envField.string({ access: 'secret', context: 'server', optional: true }),
		},
	},
	integrations: [
		starlight({
			title: 'StudioCMS UI',
			description: 'The UI library for StudioCMS, available for Astro for all to use.',
			lastUpdated: true,
			credits: false,
			tagline: 'The UI library for StudioCMS, available for Astro for all to use.',
			components: {
				SiteTitle: './src/starlightOverrides/SiteTitle.astro',
				PageTitle: './src/starlightOverrides/PageTitle.astro',
				Sidebar: './src/starlightOverrides/Sidebar.astro',
				Head: './src/starlightOverrides/Head.astro',
				Header: './src/starlightOverrides/Header.astro',
			},
			logo: {
				src: './src/assets/logo-adaptive.svg',
			},
			defaultLocale: 'root',
			locales,
			social: {
				github: 'https://github.com/withstudiocms/studiocms',
				discord: 'https://chat.studiocms.dev',
				youtube: 'https://www.youtube.com/@StudioCMS',
				'x.com': 'https://x.com/withstudiocms',
				blueSky: 'https://bsky.app/profile/studiocms.dev',
				patreon: 'https://patreon.com/StudioCMS',
			},
			customCss: [
				'@studiocms/ui/css/global.css',
				'./src/styles/sponsorcolors.css',
				'./src/styles/starlight.css',
			],
			editLink: {
				baseUrl: 'https://github.com/withstudiocms/ui/tree/main/docs',
			},
			head: [
				// {
				// 	tag: 'script',
				// 	attrs: {
				// 		src: 'https://analytics.studiocms.xyz/script.js',
				// 		'data-website-id': '00717cde-0d92-42be-8f49-8de0b1d810b2',
				// 		defer: true,
				// 	},
				// },
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: `${site}og.jpg?v=1`,
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'twitter:image',
						content: `${site}og.jpg?v=1`,
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'twitter:site',
						content: 'withstudiocms',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'twitter:creator',
						content: 'withstudiocms',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preload',
						as: 'font',
						type: 'font/woff2',
						href: onestWoff2,
						crossorigin: 'anonymous',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon.svg',
						type: 'image/svg+xml',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon-light.png',
						type: 'image/png',
						media: '(prefers-color-scheme: light)',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon-dark.png',
						type: 'image/png',
						media: '(prefers-color-scheme: dark)',
					},
				},
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{
							label: 'Installation',
							link: 'docs/',
						},
						{
							label: 'Release Notes',
							link: 'docs/changelog',
						},
						{
							label: 'Site Showcase',
							link: 'docs/showcase',
						},
					],
				},
				{
					label: 'Components',
					autogenerate: {
						directory: 'docs/components',
						collapsed: true,
					},
				},
			],
			plugins: [starlightImageZoom()],
		}),
	],
});
