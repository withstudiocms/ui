import ui from '@studiocms/ui';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	integrations: [ui()],
	devToolbar: {
		enabled: true,
	},
});
