import starlight from '@astrojs/starlight';
// import starlightUtils from '@lorenzo_lewis/starlight-utils';
import { defineConfig } from 'astro/config';
// import starlightImageZoom from 'starlight-image-zoom';
// import getCoolifyURL from './hostUtils';
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
	image: {
		remotePatterns: [{ protocol: 'https' }],
	},
	markdown: {
		rehypePlugins: rehypePluginKit,
	},
	integrations: [
		starlight({
			title: 'StudioCMS UI',
			description: 'The UI library for StudioCMS, available for Astro for all to use.',
			favicon: '/logo-light.svg',
			lastUpdated: true,
			credits: true,
			tagline: 'The UI library for StudioCMS, available for Astro for all to use.',
			components: {
				SiteTitle: './src/starlightOverrides/SiteTitle.astro',
				PageTitle: './src/starlightOverrides/PageTitle.astro',
				Sidebar: './src/starlightOverrides/Sidebar.astro',
				Head: './src/starlightOverrides/Head.astro',
			},
			logo: {
				dark: '../assets/logo-light.svg',
				light: '../assets/logo-dark.svg',
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
			],
			sidebar: [
				{ label: 'Getting Started', link: 'docs/' },
				{
					label: 'Components',
					autogenerate: {
						directory: 'docs/components',
						collapsed: true,
					},
				},
			],
			plugins: [
				// starlightUtils({
				// 	multiSidebar: { switcherStyle: 'horizontalList' },
				// }),
				// starlightImageZoom(),
			],
		}),
	],
});
